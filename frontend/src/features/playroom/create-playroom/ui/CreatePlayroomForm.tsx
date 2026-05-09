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
    <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-8 flex flex-col items-center text-center gap-6 shadow-xl h-full justify-center group hover:border-primary/50 transition-all duration-500">
      <GameLoader isLoading={isLoading} text="Создание лобби..." />
      
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform duration-500">
        🎲
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-white tracking-tight">Новое приключение</h3>
        <p className="text-muted-foreground text-sm max-w-[200px] mx-auto">
          Создайте новое лобби и станьте мастером своей истории.
        </p>
      </div>

      <button
        onClick={handleCreatePlayroom}
        disabled={isLoading}
        className="w-full py-4 rounded-xl bg-primary text-white font-bold tracking-wider hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_var(--color-primary)] active:scale-95"
      >
        <span>СОЗДАТЬ ЛОББИ</span>
      </button>
    </div>
  );
};
