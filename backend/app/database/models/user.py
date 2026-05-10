from typing import List
from typing import TYPE_CHECKING
from sqlalchemy import String, ForeignKey, Float, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid

from .base import Base, TableNameMixin, TimestampMixin

if TYPE_CHECKING:
    from .playroom import Playroom
    from .player_turn import PlayerTurn

class User(Base, TableNameMixin, TimestampMixin):
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=True)
    username: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(String, nullable=False)
    refresh_token: Mapped[str] = mapped_column(String, nullable=True)

    playrooms: Mapped[List["Playroom"]] = relationship(
        "Playroom",
        back_populates="leader"
    )

    player_turns: Mapped[List["PlayerTurn"]] = relationship(
        "PlayerTurn",
        back_populates="player"
    )
    