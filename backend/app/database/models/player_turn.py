from typing import TYPE_CHECKING
from sqlalchemy import String, ForeignKey, Float, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid

from .base import Base, TableNameMixin, TimestampMixin

if TYPE_CHECKING:
    from .master_turn import MasterTurn
    from .user import User

class PlayerTurn(Base, TableNameMixin, TimestampMixin):
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    number: Mapped[int] = mapped_column(Integer, nullable=True)
    input_text: Mapped[str] = mapped_column(String, nullable=False)
    state_updates: Mapped[dict] = mapped_column(JSONB, nullable=True)

    player_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False
    )
    player: Mapped["User"] = relationship(
        "User",
        back_populates="player_turns"
    )
    
    master_turn_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("master_turns.id"),
        nullable=False
    )
    master_turn: Mapped["MasterTurn"] = relationship(
        "MasterTurn",
        back_populates="player_turns"
    )
    