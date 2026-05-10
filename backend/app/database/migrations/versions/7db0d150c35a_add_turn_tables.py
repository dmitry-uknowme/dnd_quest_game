"""Add turn tables

Revision ID: 7db0d150c35a
Revises: 5ade86bdbb06
Create Date: 2026-05-10 12:08:36.853508

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '7db0d150c35a'
down_revision: Union[str, Sequence[str], None] = '5ade86bdbb06'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.create_table('master_turns',
        sa.Column(
            'id',
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text('gen_random_uuid()')
        ),
        sa.Column('number', sa.Integer(), nullable=False),
        sa.Column('result_text', sa.String(), nullable=False),
        sa.Column('state_updates', postgresql.JSONB(), nullable=False),

        sa.Column('created_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),

        sa.Column('playroom_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('location_id', postgresql.UUID(as_uuid=True), nullable=False),

        sa.ForeignKeyConstraint(['playroom_id'], ['playrooms.id'], ),
        sa.ForeignKeyConstraint(['location_id'], ['locations.id'], ),
    )

    op.create_table(
        'player_turns',
        sa.Column(
            'id',
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text('gen_random_uuid()')
        ),
        sa.Column('number', sa.Integer(), nullable=False),
        sa.Column('input_text', sa.String(), nullable=False),
        sa.Column('state_updates', postgresql.JSONB(), nullable=False),

        sa.Column('master_turn_id', postgresql.UUID(as_uuid=True), nullable=False),

        sa.Column('created_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),

        sa.ForeignKeyConstraint(['master_turn_id'], ['master_turns.id']),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('player_turns')
    op.drop_table('master_turns')
