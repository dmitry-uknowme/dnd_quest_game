import asyncio
from collections import defaultdict
import json
import logging
from typing import Any, Dict, TypedDict
import uuid
from fastapi import HTTPException, WebSocket
from fastapi.websockets import WebSocketState
from httpx import AsyncClient



class ConnectionInfo:
    # logger = logging.getLogger()
    # logger.setLevel(logging.INFO)
    def __init__(self, websocket: WebSocket):
        self.websocket = websocket
        self.data: Dict[str, Any] = {}
        self.send_lock = asyncio.Lock()  # Глобальная блокировка отправки данных
        


class WebsocketManager:
    def __init__(self):
        self.active_connections: Dict[str, ConnectionInfo] = {}
        self.connection_lock = asyncio.Lock()  # Глобальная блокировка подключения
        self.invalid_tokens: set[tuple[str, str]] = set()  # Кеш для невалидных пар (client_id, token)

    async def connect(self, websocket: WebSocket, client_id: str, token: str = None):
        async with self.connection_lock:  # Гарантируем, что соединения обрабатываются последовательно
            if client_id in self.active_connections:
                logging.warning(f"Client {client_id} is already connected.")
            # if not token or not await self.validate_auth_token(client_id, token):
            #     logging.warning(f"Client not validated: client_id -> {client_id}")
            #     await websocket.close(code=1008, reason="Unauthorized")
            #     return None  # Выход без вызова `accept()`

            await websocket.accept()
            self.active_connections[client_id] = ConnectionInfo(websocket)
            logging.info(f"Client connected: client_id -> {client_id}")
            return client_id

    async def disconnect(self, client_id: str):
        async with self.connection_lock:  # Блокируем процесс отключения
            if client_id in self.active_connections:
                websocket = self.active_connections[client_id].websocket
                del self.active_connections[client_id]
                if websocket.client_state == WebSocketState.CONNECTED:
                    await websocket.close(code=1000, reason="Disconnected by server")
                logging.info(f"Client disconnected: {client_id}")

    def set_connection_data(self, client_id: str, key: str, value: Any):
        if client_id not in self.active_connections:
            return
        self.active_connections[client_id].data[key] = value

    def get_connection_data(self, client_id: str, key: str) -> Any:
        if client_id not in self.active_connections:
            return None
        return self.active_connections[client_id].data.get(key)

    async def send_message_json(self, client_id: str, message: dict):
        if client_id in self.active_connections:
            websocket = self.active_connections[client_id].websocket
            if websocket.client_state == WebSocketState.CONNECTED:
                async with self.active_connections[client_id].send_lock:
                    await websocket.send_json(message)
                    # decoded_message = json.loads(message)
                    # pretty_message = json.dumps(decoded_message, ensure_ascii=False)
                    logging.info(f"Message sent to client: client_id -> {client_id} message -> {message}")

    async def send_message_bytes(self, client_id: str, message: bytes):
        if client_id in self.active_connections:
            websocket = self.active_connections[client_id].websocket
            if websocket.client_state == WebSocketState.CONNECTED:
                async with self.active_connections[client_id].send_lock:
                    await self.active_connections[client_id].websocket.send_bytes(message)
                    # logging.info(f"Message bytes sent to client: client_id -> {client_id}")

    async def broadcast_message_json(self, message: dict):
        logging.info(f"Broadcasting message to {len(self.active_connections.keys())} clients: message -> {message}")
        await asyncio.gather(*[
            self._send_message_with_lock(client.websocket, client.send_lock, message)
            for client in self.active_connections.values()
        ])

    async def _send_message_with_lock(self, websocket: WebSocket, lock: asyncio.Lock, message: dict):
        async with lock:
            await websocket.send_json(message)

    def get_websocket(self, client_id: str) -> WebSocket:
        if client_id in self.active_connections:
            return self.active_connections[client_id].websocket
        return None

    async def validate_auth_token(self, client_id: str, token: str) -> bool:
        MAIN_BACKEND_URL = "https://ariel.gptkids.online"
        return True
        # # Если такая пара уже проверялась и была невалидной, сразу возвращаем False
        # if (client_id, token) in self.invalid_tokens:
        #     logging.warning(f"Skipping validation, known invalid token for client_id -> {client_id}")
        #     return False

        # async with AsyncClient(verify=False) as client:
        #     try:
        #         data = {"token": token}
        #         response = await client.post(
        #             f"{MAIN_BACKEND_URL}/api/user_device/auth/check",
        #             headers={"Content-Type": "application/json"},
        #             json=data,
        #         )
        #         response.raise_for_status()
        #         response = response.json()
        #         user = response.get("user")
        #         user_client_id = user.get("imei")

        #         is_valid = user_client_id == client_id or user_client_id.strip() == f"+{client_id.strip()}"

        #         if not is_valid:
        #             self.invalid_tokens.add((client_id, token))
        #             logging.warning(f"Cached invalid token for client_id -> {client_id}")

        #         return is_valid

        #     except Exception as e:
        #         logging.error(f"Validate auth token error: {str(e)}")
        #         return False