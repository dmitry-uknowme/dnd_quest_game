import { Player } from "@/entities/player/model/player";
import { createContext, useEffect, useRef, useState } from "react";

export interface IPlayroomContext {
  ws: WebSocket | null;
  players: Player[];
  roomId: string | null;
  setRoomId: (id: string) => void;
}

export const PlayroomContext = createContext<IPlayroomContext>(
  {} as IPlayroomContext,
);

export const PlayroomContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const token = "player_1" + Math.random().toFixed(3);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!roomId) return;

    wsRef.current = new WebSocket(
      `ws://localhost:5000/playroom/${roomId}/websocket?token=${token}`,
    );
    const ws = wsRef.current;
    ws.onopen = () => {
      console.log("WebSocket connected");
    };
    ws.onmessage = (event) => {
      console.log("Message from server:", event.data);

      try {
        const data = JSON.parse(event.data);
        if (data.event == "ROOM:CONNECTION_UPDATED") {
          setPlayers(
            data.active_players.map((player: string) => ({
              id: player,
              name: player,
              hp: 100,
              maxHp: 100,
              level: 1,
              role: "Маг",
              avatar: "🗡️",
            })),
          );
          console.log("Players:", data.active_players);
        }
      } catch (e) {
        console.log("Raw:", event.data);
      }
    };

    return () => {
      ws.close();
    };
  }, [roomId]);

  return (
    <PlayroomContext.Provider
      value={{ setRoomId, roomId, players, ws: wsRef.current }}
    >
      {children}
    </PlayroomContext.Provider>
  );
};
