import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiCreatePlayroom from "@/shared/api/playroom/apiCreatePlayroom";
import { GameLoader } from "@/shared/ui/loader/GameLoader";

export const CreatePlayroomForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreatePlayroom = async () => {
    setIsLoading(true);
    try {
      const playroom = await apiCreatePlayroom();
      navigate(`/playrooms/${playroom.id}`);
    } catch (error) {
      console.error("Failed to create playroom", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <GameLoader isLoading={isLoading} text="Создание лобби..." />
      <div className="text-center space-y-4 max-w-xl">
        <h1 className="text-5xl font-bold tracking-wider text-white drop-shadow-lg">STORY DUNGEONS</h1>
        <p className="text-muted-foreground text-lg">
          Начните новое приключение. Создайте лобби и пригласите друзей.
        </p>
      </div>
      <button
        onClick={handleCreatePlayroom}
        disabled={isLoading}
        className="px-8 py-4 rounded-xl bg-primary text-white font-bold tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_20px_var(--color-primary)]"
      >
        <span>СОЗДАТЬ ЛОББИ</span>
        <span>🎲</span>
      </button>
    </div>
  );
};
