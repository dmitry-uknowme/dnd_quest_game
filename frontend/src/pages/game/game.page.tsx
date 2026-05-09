import MainLayout from "@/shared/ui/layout/MainLayout";
import { PartySidebar } from "@/widgets/PartySidebar/ui/PartySidebar";
import { TimelineSidebar } from "@/widgets/TimelineSidebar/ui/TimelineSidebar";
import { GameHeader } from "@/widgets/GameHeader/ui/GameHeader";
import { StoryBoard } from "@/widgets/StoryBoard/ui/StoryBoard";
import { ActionPanel } from "@/widgets/ActionPanel/ui/ActionPanel";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Player } from "@/entities/player/model/player";

const GamePage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const token = "player_1" + Math.random().toFixed(3);
  const [players, setPlayers] = useState<Player[]>([]);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!roomId) return;

    wsRef.current = new WebSocket(
      `ws://localhost:5000/playroom/${roomId}/websocket?token=${token}`,
    );
    const ws = wsRef.current;
    ws.onopen = () => {
      console.log("WebSocket connected in game");
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
    <MainLayout
      leftSidebar={<PartySidebar players={players} />}
      rightSidebar={<TimelineSidebar />}
      header={<GameHeader />}
    >
      <div className="space-y-8">
        <StoryBoard />
        <ActionPanel />
      </div>
    </MainLayout>
  );
};

export default GamePage;
