import { Playroom } from "@/entities/playroom";
import { World } from "@/entities/world";
import { GameLoader } from "@/shared/ui/loader/GameLoader";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import useCreateWorld from "../../model/useCreateWorld";

interface CreateWorldFormProps {
  playroom: Playroom;
  // playroomId: string;
  isLeader?: boolean;
}

export const CreateWorldForm = ({
  playroom,
  isLeader = true,
}: CreateWorldFormProps) => {
  const [description, setDescription] = useState("");
  const [createdWorld, setCreatedWorld] = useState<World | null>(null);

  const queryClient = useQueryClient();

  const createWorld = useCreateWorld(playroom.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !isLeader) return;

    createWorld.create(description);
    // try {
    //   const data = await apiCreateWorld({
    //     playroom_id: playroom.id,
    //     title: description,
    //   });
    //   // setCreatedWorld(data);
    // } catch (error) {
    //   console.error("Failed to create world", error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  // useQuery({
  //   queryKey: ["playroom", playroomId],
  //   queryFn: async () => {
  //     const data = await apiGetPlayroom(playroomId);
  //     return data;
  //   },
  // });

  const isLoading = createWorld.isPending;

  return (
    <>
      <GameLoader isLoading={isLoading} text="Генерация мира..." />
      <div className="flex flex-col items-center justify-center space-y-8 w-full">
        <div className="text-center space-y-4 max-w-2xl">
          <h2 className="text-4xl font-bold tracking-wider text-white drop-shadow-lg">
            ОПИСАНИЕ МИРА
          </h2>
          <p className="text-muted-foreground">
            Задайте начальную завязку. Мастер-ИИ построит первую локацию на
            основе этого текста.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={
              isLeader
                ? "Мы оказались в темном лесу, где деревья шепчут имена забытых королей..."
                : "Только лидер может задавать описание мира..."
            }
            disabled={!isLeader || isLoading}
            className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-6 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none text-white disabled:opacity-50 disabled:cursor-not-allowed"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!isLeader || isLoading || !description.trim()}
              className="px-8 py-3 rounded-xl bg-primary text-white font-bold tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span>СГЕНЕРИРОВАТЬ МИР</span>
              <span>✨</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
