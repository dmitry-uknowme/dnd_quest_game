from sqlalchemy import String, ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid

from .base import Base, TableNameMixin, TimestampMixin
from .constants import STATUS_ACTIVE

class Agent(Base, TableNameMixin, TimestampMixin):
    # id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String, nullable=True)
    # type: Mapped[str] = mapped_column(String)
    title: Mapped[str] = mapped_column(String, nullable=True)
    temperature: Mapped[float] = mapped_column(Float, nullable=True, default=0.5)
    prompt: Mapped[str] = mapped_column(String)
    # model: Mapped[str] = mapped_column(AIModelsEnum, nullable=True, default=AIModels.GPT_4O)
    description: Mapped[str | None] = mapped_column(String, nullable=True)
    response_format: Mapped[dict] = mapped_column(JSONB, nullable=True)
    # tags: Mapped[list[str]] = mapped_column(ARRAY(String), nullable=False, default=lambda: ["ARIEL", "ARIEL_WATCH_APP"])

    