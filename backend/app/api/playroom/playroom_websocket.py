import logging
import uuid

from database.db_helper import db_helper
from fastapi import (APIRouter, BackgroundTasks, Depends, HTTPException, Path,
                     Query, Request, Response, WebSocket)
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.websockets import WebSocketDisconnect, WebSocketState
from service.playroom import playroom_service
from service.playroom.playroom_websocket import (
    PlayroomWebsocketService, get_playroom_websocket_service)
from service.playroom.schemas import CreatePlayroomRequestSchema
from sqlalchemy.ext.asyncio import AsyncSession
from utils.log_route import log_route

router = APIRouter()

@router.websocket("/playrooms/{room_id}/websocket")
async def playroom_websocket(
    websocket: WebSocket,
    room_id: str = Path(..., description="Room id"),
    token: str = Query(None),
    session: AsyncSession = Depends(db_helper.session_dependency),
    websocket_service: PlayroomWebsocketService = Depends(get_playroom_websocket_service)
):
    try:
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
