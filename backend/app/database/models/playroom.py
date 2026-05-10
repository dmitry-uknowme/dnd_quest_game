from typing import List
from typing import TYPE_CHECKING
from sqlalchemy import String, ForeignKey, Float, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid

from .base import Base, TableNameMixin, TimestampMixin
from .constants import STATUS_ACTIVE

if TYPE_CHECKING:
    from .world import World
    from .location import Location
    from .user import User
    from .master_turn import MasterTurn

class Playroom(Base, TableNameMixin, TimestampMixin):
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    title: Mapped[str] = mapped_column(String, nullable=False)
    status: Mapped[str] = mapped_column(String, nullable=False, default=STATUS_ACTIVE)
    active_turn_number: Mapped[int] = mapped_column(Integer, nullable=True, default=1)

    leader_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True
    )
    leader: Mapped["User"] = relationship(
        "User",
        back_populates="playrooms"
    )
        
    world_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("worlds.id"),
        nullable=True
    )
    world: Mapped["World"] = relationship(
        "World",
        back_populates="playrooms"
    )

    active_location_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("locations.id"),
        nullable=True
    )
    active_location: Mapped["Location"] = relationship(
        "Location",
        foreign_keys=[active_location_id]
    )

    turns: Mapped[List["MasterTurn"]] = relationship(
        "MasterTurn",
        back_populates="playroom"
    )

    players: Mapped[List["User"]] = relationship(
        "User",
        back_populates="playrooms"
    )