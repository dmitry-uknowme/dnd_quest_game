import useFetchPlayroom from "@/features/playroom/model/useFetchPlayroom";
import useStartPlayroom from "@/features/playroom/model/useStartPlayroom";
import { CreateWorldForm } from "@/features/world/create-world/ui/CreateWorldForm";
import { PlayroomContext } from "@/shared/model/playroom-context/playroom-context";
import MainLayout from "@/shared/ui/layout/MainLayout";
import { GameLoader } from "@/shared/ui/loader/GameLoader";
import { GameHeader } from "@/widgets/GameHeader/ui/GameHeader";
import { PartySidebar } from "@/widgets/PartySidebar/ui/PartySidebar";
import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const PlayroomPage = () => {
  const navigate = useNavigate();

  const { players, setRoomId } = useContext(PlayroomContext);

  const { playroomData, isFetching } = useFetchPlayroom();
  const startPlayroom = useStartPlayroom(playroomData?.id!);

  useEffect(() => {
    if (playroomData) {
      setRoomId(playroomData.id);
    }
  }, [playroomData]);

  useEffect(() => {
    if (playroomData && playroomData.status === "STATUS_STARTED")
      navigate(`/playrooms/${playroomData.id}/game`);
  }, [playroomData]);

  return (
    <MainLayout
      leftSidebar={<PartySidebar players={players} />}
      header={<GameHeader />}
    >
      <GameLoader isLoading={startPlayroom.isPending} text="Запуск игры..." />
      <div className="flex flex-col items-center justify-center space-y-12 mt-8">
        {!!(playroomData?.world && !isFetching) ? (
          <>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="text-6xl animate-bounce">🌍</div>
              <h2 className="text-2xl font-bold text-success">
                Мир успешно создан!
              </h2>
              <p className="text-base">{playroomData.world.title}</p>
              <p className="text-base">{playroomData.world.description}</p>
              <p className="text-base">
                Ваша цель: {playroomData.world.global_goal}
              </p>
              <p className="text-muted-foreground">
                Ожидайте запуска игры лидером группы.
              </p>
            </div>

            <div className="pt-8 border-t border-border/50 w-full flex justify-center">
              <button
                onClick={() => startPlayroom.start(playroomData.id)}
                className="px-8 py-4 rounded-xl bg-success text-white font-bold tracking-wider hover:bg-success/80 transition-colors shadow-[0_0_20px_var(--color-success)]"
              >
                ЗАПУСТИТЬ ИГРУ ⚔️
              </button>
            </div>
          </>
        ) : (
          !!playroomData && <CreateWorldForm playroom={playroomData} />
        )}
      </div>
    </MainLayout>
  );
};

export default PlayroomPage;
