import apiStartPlayroom from "@/shared/api/playroom/apiStartPlayroom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const useStartPlayroom = (playroomId: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isPending, mutate, error } = useMutation({
    mutationFn: () => apiStartPlayroom(playroomId),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ["playroom", playroomId],
      });
      navigate(`/playrooms/${playroomId}/game`);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        // toast.error(error?.message);
      }
    },
  });

  return {
    start: (playroomId: string) => mutate(),
    isPending,
    error,
  };
};

export default useStartPlayroom;
