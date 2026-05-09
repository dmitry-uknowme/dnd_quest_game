from typing import TYPE_CHECKING
from sqlalchemy import String, ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid

from .base import Base, TableNameMixin, TimestampMixin

if TYPE_CHECKING:
    from .world import World

class Location(Base, TableNameMixin, TimestampMixin):
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=False)
    type: Mapped[str] = mapped_column(String, nullable=False)

    world_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("worlds.id"),
        nullable=True
    )
    world: Mapped["World"] = relationship(
        "World",
        back_populates="locations"
    )