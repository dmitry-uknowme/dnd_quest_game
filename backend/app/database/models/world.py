from typing import TYPE_CHECKING
from sqlalchemy import String, ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid

from .base import Base, TableNameMixin, TimestampMixin

if TYPE_CHECKING:
    from .world import World
    from .location import Location
    from .playroom import Playroom

class World(Base, TableNameMixin, TimestampMixin):
    # id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=False)
    genre: Mapped[str] = mapped_column(String, nullable=False)
    tone: Mapped[str] = mapped_column(String, nullable=False)
    global_goal: Mapped[str] = mapped_column(String, nullable=False)
    conflict_core: Mapped[str] = mapped_column(String, nullable=False)
    memory_seed: Mapped[str] = mapped_column(String, nullable=False)
    power_limits: Mapped[str] = mapped_column(String, nullable=False)
    world_rules: Mapped[str] = mapped_column(String, nullable=False)
    world_constraints: Mapped[str] = mapped_column(String, nullable=False)

    playrooms: Mapped[list["Playroom"]] = relationship(
        "Playroom",
        back_populates="world"
    )

    locations: Mapped[list["Location"]] = relationship(
        "Location",
        back_populates="world"
    )