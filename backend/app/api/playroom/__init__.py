from .create_playroom import router as create_playroom_router
from .get_playroom import router as get_playroom_router
from .get_playrooms import router as get_playrooms_router
from .start_playroom import router as start_playroom_router
from .playroom_get_active_turn import router as playroom_get_active_turn_router
from .playroom_get_turns import router as playroom_get_turns_router
from .playroom_make_turn import router as playroom_make_turn_router
from .playroom_websocket import router as playroom_websocket_router
from fastapi import APIRouter

router = APIRouter()

router.include_router(create_playroom_router)
router.include_router(get_playroom_router)
router.include_router(get_playrooms_router)
router.include_router(start_playroom_router)
router.include_router(playroom_get_active_turn_router)
router.include_router(playroom_get_turns_router)
router.include_router(playroom_make_turn_router)
router.include_router(playroom_websocket_router)

