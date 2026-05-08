from fastapi.websockets import WebSocketDisconnect
from fastapi.websockets import WebSocketState
import logging
from fastapi import WebSocket
import uuid
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Path, Query, Request, Response
from fastapi.responses import JSONResponse, StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession 
from database.db_helper import db_helper

from service.playroom.playroom_websocket import PlayroomWebsocketService, get_playroom_websocket_service
from service.agent_ai_stream import agent_make_history, agent_ai_stream, agent_ai
from utils.log_route import log_route
from database.models import Agent, World

router = APIRouter()

rooms = []
@router.websocket("/playroom/{room_id}/websocket")
async def playroom_websocket(
    websocket: WebSocket,
    room_id: str = Path(..., description="Room id"),
    token: str = Query(None),
    session: AsyncSession = Depends(db_helper.session_dependency),
    websocket_service: PlayroomWebsocketService = Depends(get_playroom_websocket_service)
):
    try:
        # manager = websocket_service.
        # await manager.connect(websocket, client_id, token)
        # await manager.send_message(client_id, json.dumps({'type': 'STT_RECORDER_STATUS', 'value': 'READY'}))
        await websocket_service.connect_player(room_id, token, websocket)
        async for raw_message in websocket.iter_json():
            if websocket.client_state != WebSocketState.CONNECTED:
                logging.warning(f"WebSocket {token} is {websocket.client_state}, stopping processing")
                break
    except WebSocketDisconnect as e:
        logging.error(f"Error disconnect: client_id -> {token} error ->  {str(e)}")
    except Exception as e:
        logging.error(f"Unexpected error disconnect: client_id -> {token} error ->  {str(e)}")
    finally:
        await websocket_service.disconnect_player(room_id, token)


    # try:
    #     # await websocket_service.on_player_connected(ws=websocket, )
    #     # await manager.send_message(client_id, json.dumps({'type': 'STT_RECORDER_STATUS', 'value': 'READY'}))
    #     # asyncio.create_task(recorder_pool.submit_task(client_id))
    #     async for raw_message in websocket.iter_bytes():
    # except Exception as e:
    #     pass        
