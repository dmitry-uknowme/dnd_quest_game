import apiCreateWorld from "@/shared/api/world/apiCreateWorld";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const useCreateWorld = (playroomId: string) => {
  const queryClient = useQueryClient();

  const { isPending, mutate, error } = useMutation({
    mutationFn: apiCreateWorld,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["playroom", playroomId],
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        // toast.error(error?.message);
      }
    },
  });

  return {
    create: (title: string) => mutate({ title, playroom_id: playroomId }),
    isPending,
    error,
  };
};

export default useCreateWorld;
