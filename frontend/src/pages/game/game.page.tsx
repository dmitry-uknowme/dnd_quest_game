import MainLayout from "@/shared/ui/layout/MainLayout";
import { PartySidebar } from "@/widgets/PartySidebar/ui/PartySidebar";
import { TimelineSidebar } from "@/widgets/TimelineSidebar/ui/TimelineSidebar";
import { GameHeader } from "@/widgets/GameHeader/ui/GameHeader";
import { StoryBoard } from "@/widgets/StoryBoard/ui/StoryBoard";
import { ActionPanel } from "@/widgets/ActionPanel/ui/ActionPanel";
import { useContext, useEffect } from "react";
import { PlayroomContext } from "@/shared/model/playroom-context/playroom-context";
import useFetchPlayroom from "@/features/playroom/model/useFetchPlayroom";

const GamePage = () => {
  const { players, setRoomId } = useContext(PlayroomContext);

  const { playroomData, isFetching } = useFetchPlayroom();

  useEffect(() => {
    if (playroomData) {
      setRoomId(playroomData.id);
    }
  }, [playroomData]);

  return (
    <MainLayout
      leftSidebar={<PartySidebar players={players} />}
      rightSidebar={<TimelineSidebar />}
      header={<GameHeader />}
    >
      <div className="space-y-8">
        {!!(playroomData?.world && playroomData?.active_location) && (
          <>
            <StoryBoard
              world={playroomData.world}
              location={playroomData.active_location}
            />
            <ActionPanel location={playroomData.active_location} />
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default GamePage;
