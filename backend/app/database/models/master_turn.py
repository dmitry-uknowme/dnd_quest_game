from typing import List
from typing import TYPE_CHECKING
from sqlalchemy import String, ForeignKey, Float, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid

from .base import Base, TableNameMixin, TimestampMixin

if TYPE_CHECKING:
    from .location import Location
    from .playroom import Playroom
    from .player_turn import PlayerTurn

class MasterTurn(Base, TableNameMixin, TimestampMixin):
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    number: Mapped[int] = mapped_column(Integer, nullable=False)
    result_text: Mapped[str] = mapped_column(String, nullable=True)
    state_updates: Mapped[dict] = mapped_column(JSONB, nullable=True)
    
    playroom_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("playrooms.id"),
        nullable=False
    )
    playroom: Mapped["Playroom"] = relationship(
        "Playroom",
        back_populates="master_turns"
    )

    location_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("locations.id"),
        nullable=False
    )
    location: Mapped["Location"] = relationship(
        "Location",
        back_populates="master_turns"
    )

    player_turns: Mapped[List["PlayerTurn"]] = relationship(
        "PlayerTurn",
        back_populates="master_turn"
    )

    answer_variants: Mapped[List[str]] = mapped_column(JSONB, nullable=True, default=list)
    