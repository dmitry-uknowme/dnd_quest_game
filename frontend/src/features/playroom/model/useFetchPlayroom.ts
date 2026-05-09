import apiGetPlayroom from "@/shared/api/playroom/apiGetPlayroom";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const useFetchPlayroom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const {
    data: playroomData,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["playroom", roomId],
    queryFn: async () => {
      const response = await apiGetPlayroom(roomId!);
      return response;
    },
    enabled: !!roomId,
  });

  const notFoundError =
    error && (error as AxiosError)?.response?.status === 404;

  return { playroomData, isFetching, error, notFoundError };
};

export default useFetchPlayroom;
