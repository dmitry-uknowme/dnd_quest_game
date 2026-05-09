from .create_location import router as create_location_router
from fastapi import APIRouter

router = APIRouter()

router.include_router(create_location_router)