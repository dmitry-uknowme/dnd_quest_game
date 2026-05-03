FROM python:3.10-slim

WORKDIR /usr/src/chromadb

RUN apt-get update && apt-get install -y curl

RUN mkdir -p /usr/src/chromadb/storage \
    && chmod -R 777 /usr/src/chromadb/storage

ENV \
    CHROMA_SERVER_AUTHN_PROVIDER="chromadb.auth.null.NullAuthServer" \
    CHROMA_SERVER_CORS_ALLOW_ORIGINS='["*"]'

RUN pip install chromadb[server]

CMD ["chroma", "run", "--host", "0.0.0.0", "--path", "./storage", "--port", "8000"]
