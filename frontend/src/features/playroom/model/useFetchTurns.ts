import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import apiGetPlayroomTurns from "@/shared/api/playroom/apiPlayroomGetTurns";

const useFetchTurns = () => {
  const { roomId } = useParams<{ roomId: string }>();

  const { data: turns = [], isFetching, refetch } = useQuery({
    queryKey: ["playroom-turns", roomId],
    queryFn: async () => {
      const response = await apiGetPlayroomTurns(roomId!);
      // API returns desc order, reverse for chronological display
      return [...response].reverse();
    },
    enabled: !!roomId,
  });

  return { turns, isFetching, refetch };
};

export default useFetchTurns;
