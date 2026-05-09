from .create_playroom import router as create_playroom_router
from .get_playroom import router as get_playroom_router
from .playroom_websocket import router as playroom_websocket_router
from fastapi import APIRouter

router = APIRouter()

router.include_router(create_playroom_router)
router.include_router(get_playroom_router)
router.include_router(playroom_websocket_router)