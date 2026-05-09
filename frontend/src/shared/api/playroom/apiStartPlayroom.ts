import apiClient from "../apiClient";
import { PlayroomDetail } from "@/entities/playroom/model/playroom";

const apiStartPlayroom = async (playroomId: string) => {
  const { data } = await apiClient.post<PlayroomDetail>(
    `/playrooms/${playroomId}/start`,
  );
  return data;
};

export default apiStartPlayroom;
