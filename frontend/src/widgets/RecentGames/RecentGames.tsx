import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiGetPlayrooms from "@/shared/api/playroom/apiGetPlayrooms";
import { PlayroomDetail } from "@/entities/playroom/model/playroom";
import { cn } from "@/shared/lib/css";

export const RecentGames = () => {
  const [games, setGames] = useState<PlayroomDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await apiGetPlayrooms();
        setGames(data);
      } catch (error) {
        console.error("Failed to fetch games", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGames();
  }, []);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "STATUS_ACTIVE": return { label: "Ожидание", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" };
      case "STATUS_STARTED": return { label: "Идёт игра", color: "bg-success/20 text-success border-success/30" };
      default: return { label: status, color: "bg-muted text-muted-foreground border-border" };
    }
  };

  return (
    <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-6 flex flex-col h-full shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white tracking-tight">Ваши приключения</h3>
        <span className="text-xs font-bold text-white/40 uppercase tracking-widest">{games.length} Всего</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 max-h-[400px]">
        {isLoading ? (
          // Simple Skeleton
          [1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-white/5 border border-white/5 rounded-xl h-24" />
          ))
        ) : games.length > 0 ? (
          games.map((game) => {
            const status = getStatusLabel(game.status);
            return (
              <Link
                key={game.id}
                to={`/playrooms/${game.id}`}
                className="group block p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-white group-hover:text-primary transition-colors">{game.title || `Лобби #${game.id.slice(0, 4)}`}</h4>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase", status.color)}>
                    {status.label}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span className="flex items-center gap-1">
                    🌍 {game.world?.title || "Неизвестный мир"}
                  </span>
                  <span className="flex items-center gap-1">
                    👥 {game.players?.length || 0} игроков
                  </span>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 opacity-40">
            <span className="text-4xl">🏜️</span>
            <p className="text-sm">Пока нет активных приключений.<br/>Создайте новое!</p>
          </div>
        )}
      </div>
    </div>
  );
};
