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

from service.turn import turn_service

router = APIRouter()

@router.get("/playrooms/{playroom_id}/active-turn")
async def playroom_get_active_turn(
    playroom_id: str,
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    try:
        master_turn = await turn_service.get_active_master_turn_by_playroom_id(session, playroom_id)
        return master_turn
    except HTTPException as e:
        log_route(endpoint=f"/playroom/{playroom_id}/active-turn", status=e.status_code, data={}, error=e)
        raise e
    except Exception as e:
        log_route(endpoint=f"/playroom/{playroom_id}/active-turn", status=500, data={}, error=e)
        raise HTTPException(status_code=500)