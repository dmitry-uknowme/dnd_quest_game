FROM python:3.10-slim

ENV HF_HOME="/huggingface"
ENV TZ=Europe/Moscow
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=0 \
    POETRY_HOME="/etc/poetry" \
    POETRY_CACHE_DIR="/tmp/poetry_cache" \
    POETRY_VERSION=1.7.0 \
    PYTHONPATH=/usr/src/backend/app
ENV ALEMBIC_CONFIG=app/alembic.ini

# COPY .env ./usr/src/backend/app/.env
# COPY ./.env ./app/.env

WORKDIR /usr/src/backend

# RUN pip install torch==2.5.1 --index-url https://download.pytorch.org/whl/cpu

COPY ./requirements.txt .

RUN pip install -r requirements.txt


CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]