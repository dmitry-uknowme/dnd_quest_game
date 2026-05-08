import logging
import asyncio
from typing import Any
from fastapi import WebSocket
from typing import Dict

from utils.websocket_manager import WebsocketManager, ConnectionInfo


class RoomConnection:
    def __init__(self, id):
        self.id = id
        self.manager = WebsocketManager()
        # self.active_players: Dict[str, ConnectionInfo] = {}

    async def connect(self, player_id: str, ws: WebSocket):
        await self.manager.connect(ws, player_id)

    async def disconnect(self, player_id: str):
        await self.manager.disconnect(player_id)

    async def broadcast_message(self, message: dict):
        await self.manager.broadcast_message_json(message)

    # async def broadcast_message(self, message: dict):
    #     await asyncio.gather(*[
    #         self._send_message_with_lock(client.websocket, client.send_lock, message)
    #         for client in self.active_players.values()
    # ])


class PlayroomWebsocketService():
    def __init__(self):
        self.active_players: Dict[str, ConnectionInfo] = {}
        self.rooms: Dict[str, RoomConnection] = {}

    async def connect_player(self, room_id: str, player_id: str, ws: WebSocket):
        if player_id in self.active_players:
            logging.warning(f"Client {player_id} is already connected.")

        if room_id not in self.rooms:
            self.rooms[room_id] = RoomConnection(room_id)
        room = self.rooms[room_id]

        await room.connect(player_id, ws)
        self.active_players[player_id] = room.manager.active_connections[player_id]

        # await self.on_player_connected(room_id, player_id)
        await self.on_room_connection_updated(room_id)

    async def disconnect_player(self, room_id: str, player_id: str):
        if player_id not in self.active_players:
            logging.warning(f"Client {player_id} is not connected.")
            return

        room = self.rooms.get(room_id)
        if not room:
            logging.warning(f"Room {room_id} not found.")
            return
        
        await room.disconnect(player_id)
        del self.active_players[player_id]

        # await self.on_player_disconnected(room_id, player_id)
        await self.on_room_connection_updated(room_id)

    async def on_room_connection_updated(self, room_id: str):
        logging.info(f"Room {room_id} connection changed: rooms -> {self.rooms.keys()} -> active_players -> {self.rooms[room_id].manager.active_connections.keys()}")
        room = self.rooms[room_id]
        await room.broadcast_message({
            "event":"ROOM:CONNECTION_UPDATED",
            "room_id": room_id,
            "active_players": list(self.rooms[room_id].manager.active_connections.keys()),
        })

    # async def on_player_connected(self, room_id: str, player_id: str):
    #     logging.info(f"Player connected: rooms -> {self.rooms.keys()} -> active_players -> {self.rooms[room_id].manager.active_connections.keys()}")
    #     room = self.rooms[room_id]
    #     await room.broadcast_message({
    #         "event":"ROOM:PLAYER_CONNECTED",
    #         "player_id": player_id,
    #         # "token": token,
    #     })

    # async def on_player_disconnected(self, room_id: str, player_id: str):
    #     logging.info(f"Player disconnected: rooms -> {self.rooms.keys()} -> active_players -> {self.rooms[room_id].manager.active_connections.keys()}")
    #     room = self.rooms[room_id]
    #     await room.broadcast_message({
    #         "event":"ROOM:PLAYER_DISCONNECTED",
    #         "player_id": player_id,
    #         # "token": token,
    #     })

    def on_world_created(self):
        pass
    def on_room_started(self):
        pass

playroom_websocket_service = PlayroomWebsocketService()

def get_playroom_websocket_service() -> PlayroomWebsocketService:
    return playroom_websocket_service