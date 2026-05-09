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

@router.get("/playrooms")
async def get_playrooms(
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    try:
        playrooms = await playroom_service.get_all_playrooms(session)
        return playrooms
    except HTTPException as e:
        log_route(endpoint=f"/playroom", status=e.status_code, data={}, error=e)
        raise e
    except Exception as e:
        log_route(endpoint=f"/playroom", status=500, data={}, error=e)
        raise HTTPException(status_code=500)