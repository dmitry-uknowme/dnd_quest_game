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

@router.get("/playrooms/{playroom_id}")
async def get_playroom(
    playroom_id: str = Path(..., description="Playroom id"),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    try:
        playroom = await playroom_service.get_playroom(session, playroom_id)
        return playroom
    except HTTPException as e:
        log_route(endpoint=f"/playroom", status=e.status_code, data={"playroom_id": playroom_id}, error=e)
        raise e
    except Exception as e:
        log_route(endpoint=f"/playroom", status=500, data={"playroom_id": playroom_id}, error=e)
        raise HTTPException(status_code=500)