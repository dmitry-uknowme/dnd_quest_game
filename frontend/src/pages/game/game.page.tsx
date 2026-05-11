import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import MainLayout from "@/shared/ui/layout/MainLayout";
import { PartySidebar } from "@/widgets/PartySidebar/ui/PartySidebar";
import { GameHeader } from "@/widgets/GameHeader/ui/GameHeader";
import { TurnFeed } from "@/widgets/TurnFeed/ui/TurnFeed";
import { LocationLogSidebar } from "@/widgets/LocationLogSidebar/ui/LocationLogSidebar";

import { useContext, useEffect } from "react";
import { PlayroomContext } from "@/shared/model/playroom-context/playroom-context";
import useFetchPlayroom from "@/features/playroom/model/useFetchPlayroom";
import useFetchTurns from "@/features/playroom/model/useFetchTurns";
import apiPlayroomMakeTurn from "@/shared/api/playroom/apiPlayroomMakeTurn";

const GamePage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { players, setRoomId } = useContext(PlayroomContext);
  const queryClient = useQueryClient();

  const { playroomData } = useFetchPlayroom();
  const { turns, refetch: refetchTurns } = useFetchTurns();

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (playroomData) {
      setRoomId(playroomData.id);
    }
  }, [playroomData]);

  const handleSubmitAction = async (action: string) => {
    if (!playroomData?.id || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await apiPlayroomMakeTurn({
        playroom_id: playroomData.id,
        input_text: action,
      });

      // Refetch turns + playroom to get updated state
      await Promise.all([
        refetchTurns(),
        queryClient.invalidateQueries({ queryKey: ["playroom", roomId] }),
      ]);
    } catch (err) {
      console.error("Make turn failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout
      leftSidebar={<PartySidebar players={players} />}
      rightSidebar={
        <LocationLogSidebar
          turns={turns}
          currentLocationTitle={playroomData?.active_location?.title}
        />
      }
      header={<GameHeader />}
    >
      <TurnFeed
        turns={turns}
        isSubmitting={isSubmitting}
        initialLocation={playroomData?.active_location}
        onSubmitAction={handleSubmitAction}
      />
    </MainLayout>
  );
};

export default GamePage;
