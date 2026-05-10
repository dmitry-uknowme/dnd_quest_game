


import uuid
import uuid
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Path, Query, Request, Response
from fastapi.responses import JSONResponse, StreamingResponse
from sqlalchemy import and_, func, or_, select, desc
from sqlalchemy.ext.asyncio import AsyncSession 
from database.db_helper import db_helper

from utils.log_route import log_route
from service.turn import turn_service
from service.turn.schemas import PlayroomMakeTurnRequestSchema

router = APIRouter()
PLAYER_ID = uuid.UUID("e150f7f9-2535-468d-bab0-be83443dda89")

@router.post("/playrooms/{playroom_id}/make-turn")
async def playroom_make_turn(
    body: PlayroomMakeTurnRequestSchema,
    playroom_id: str = Path(..., description="Playroom id"),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    try:
        data = await turn_service.player_make_turn(session, playroom_id, PLAYER_ID, body.input_text)
        await session.commit()
        log_route(endpoint=f"/playrooms/{playroom_id}/make-turn", status=200, data={"playroom_id": playroom_id, "player_id": str(PLAYER_ID), "input_text": body.input_text}, error=None)
        return data
    except HTTPException as e:
        log_route(endpoint=f"/playrooms/{playroom_id}/make-turn", status=e.status_code, data={"playroom_id": playroom_id, "player_id": str(PLAYER_ID), "input_text": body.input_text}, error=e)
        raise e
    except Exception as e:
        log_route(endpoint=f"/playroom/{playroom_id}/make-turn", status=500, data={"playroom_id": playroom_id, "player_id": str(PLAYER_ID), "input_text": body.input_text}, error=e)
        raise HTTPException(status_code=500)    

