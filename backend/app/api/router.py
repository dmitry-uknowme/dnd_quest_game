from fastapi import APIRouter

from api.world import create_world
from api.location import create_location_router
from api.playroom import router as playroom_router

api_router = APIRouter()

api_router.include_router(create_world.router, tags=["Create world"])
api_router.include_router(create_location_router, tags=["Location"])
api_router.include_router(playroom_router, tags=["Playroom"])