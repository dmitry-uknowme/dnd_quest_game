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

@router.post("/")
async def create_playroom(
    body: CreatePlayroomRequestSchema,
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    try:
        playroom = await playroom_service.create_playroom(session, body.title, "123")
        await session.commit()
        return playroom
    except HTTPException as e:
        log_route(endpoint=f"/playroom", status=e.status_code, data=body, error=e)
        raise e
    except Exception as e:
        log_route(endpoint=f"/playroom", status=500, data=body, error=e)
        raise HTTPException(status_code=500)