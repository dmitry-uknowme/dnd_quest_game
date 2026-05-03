from contextlib import asynccontextmanager
import json
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from .api.router import api_router
from .config import config_dict
from .utils.setup_logging import setup_logging
from .database.db_helper import db_helper
from .database.models import Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with db_helper.engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    setup_logging()
    yield

app = FastAPI(lifespan=lifespan, title=config_dict.PROJECT_NAME, root_path="/api")
app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
