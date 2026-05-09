import { Playroom } from "@/entities/playroom";
import apiClient from "../apiClient";
import { PlayroomDetail } from "@/entities/playroom/model/playroom";

const apiGetPlayroom = async (playroomId: string) => {
  const { data } = await apiClient.get<PlayroomDetail>(
    `/api/playroom/${playroomId}`,
  );
  return data;
};

export default apiGetPlayroom;
