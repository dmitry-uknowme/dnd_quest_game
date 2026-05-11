
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
import json

from service.playroom import playroom_service
from service.agent_ai_service import agent_ai, agent_make_history
from service.world.world_service import get_world
from service.location import location_service
from service.world import world_service
from service.playroom.schemas import PlayroomResponseSchema

from repository import master_turn_repository, player_turn_repository, agent_repository

from .schemas import MasterTurnResponseSchema, PlayerTurnResponseSchema, TurnHandlerAgentResponseSchema

async def get_active_master_turn_by_playroom_id(db: AsyncSession, playroom_id: str) -> MasterTurnResponseSchema | None:
    playroom = await playroom_service.get_playroom(db, playroom_id)
    master_turn = await master_turn_repository.get_master_turn_by_number(db, playroom_id, playroom.active_turn_number)
    if not master_turn:
        # return None
        master_turn = await master_turn_repository.get_master_turn_by_number(db, playroom_id, playroom.active_turn_number-1)
    return MasterTurnResponseSchema.model_validate(master_turn)

async def get_all_master_turns_by_playroom_id(db: AsyncSession, playroom_id: str) -> list[MasterTurnResponseSchema]:
    master_turns = await master_turn_repository.get_all_master_turns_by_playroom_id(db, playroom_id)
    return [MasterTurnResponseSchema.model_validate(master_turn) for master_turn in master_turns]

async def player_make_turn(db: AsyncSession, playroom_id: str, player_id: str, input_text: str) -> MasterTurnResponseSchema:
    playroom = await playroom_service.get_playroom(db, playroom_id)
    location_id = playroom.active_location.id
    last_master_turn_number = await master_turn_repository.get_last_master_turn_number(db, playroom_id)

    active_turn_number = playroom.active_turn_number
    master_turn = await master_turn_repository.get_master_turn_by_number(db, playroom_id, active_turn_number)
    
    if not master_turn:
        master_turn = await master_turn_repository.create_master_turn(db, playroom_id, location_id, active_turn_number - 1)

    prev_master_turn = await master_turn_repository.get_master_turn_by_number(db, playroom_id, master_turn.number - 1)
    prev_result_text = None

    if prev_master_turn:
        prev_result_text = prev_master_turn.result_text


    # next_turn_number = last_master_turn_number + 1
    # await playroom_service.playroom_increment_active_turn_number(db, playroom_id)
    
    # new_master_turn = await master_turn_repository.create_master_turn(db, playroom_id, location_id, next_turn_number)
    await player_turn_repository.create_player_turn(db, player_id, master_turn.id, input_text)

    finished_master_turn = await handle_master_ai_turn(db, master_turn.id, prev_result_text)
    await db.commit()
    return MasterTurnResponseSchema.model_validate(finished_master_turn)    

async def handle_master_ai_turn(db: AsyncSession, master_turn_id: str, prev_result_text: str | None) -> MasterTurnResponseSchema:
    master_turn = await master_turn_repository.get_master_turn(db, master_turn_id)
    players_turns = await master_turn_repository.get_players_turns_by_master_turn_id(db, master_turn_id)
    players_turns =  [PlayerTurnResponseSchema.model_validate(player_turn) for player_turn in players_turns]

    location_id = master_turn.location_id
    location = await location_service.get_location(db, location_id)
    playroom_id = master_turn.playroom_id
    playroom = await playroom_service.get_playroom(db, playroom_id)
    world = await world_service.get_world(db, playroom.world.id)

    agent = await agent_repository.get_agent_by_name(db, "TURN_HANDLER_AGENT")
    world_json = {
        "genre": world.genre,
        "tone": world.tone,
        "world_rules": world.world_rules,
        "power_limits": world.power_limits,
        "global_goal": world.global_goal,
        "conflict_core": world.conflict_core,
        "world_constraints": world.world_constraints
    }
    world_json = json.dumps(world_json, ensure_ascii=False)

    location_json = {
        "title": location.title,
        "description": location.description,
        "type": location.type,
    }
    location_json = json.dumps(location_json, ensure_ascii=False)

    player_turns_text = "\n".join([f"{turn.player.username}: {turn.input_text}" for turn in players_turns])
    player_turns_text = json.dumps(player_turns_text, ensure_ascii=False)

    user_prompt = f"**WORLD JSON**: {world_json}\n\n**LOCATION JSON**: {location_json}\n\n**PLAYER TURNS**: {player_turns_text}"
    if prev_result_text:
        user_prompt += f"\n\n**PREVIOUS TURN RESULT**: {prev_result_text}"

    messages, sum_tokens, max_output_tokens = await agent_make_history(agent=agent, messages=[{"role": "user", "content": user_prompt}])    
    response = agent_ai(messages, model="nvidia/nemotron-3-super-120b-a12b:free", temperature=None, response_model=TurnHandlerAgentResponseSchema, response_format=agent.response_format, max_output_tokens=2000, subscription_tokens_left=0)

    master_turn = await master_turn_repository.finish_master_turn(db, master_turn_id, response.turn_summary, response.choice_variants, response.dict())
    await playroom_service.playroom_increment_active_turn(db, playroom_id)
    return MasterTurnResponseSchema.model_validate(master_turn)

  

