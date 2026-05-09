from fastapi import APIRouter

from api.world import create_world
from api.world.location import world_create_location
from api.playroom import router as playroom_router

api_router = APIRouter()

api_router.include_router(create_world.router, tags=["Create world"])
api_router.include_router(world_create_location.router, tags=["Create location for world"])
api_router.include_router(playroom_router, prefix="/playroom", tags=["Playroom"])