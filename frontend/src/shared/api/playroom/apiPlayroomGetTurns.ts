import apiClient from "../apiClient";
import { TurnDetail } from "@/entities/turn/model/turn";

const apiGetPlayroomTurns = async (playroomId: string) => {
  const { data } = await apiClient.get<TurnDetail[]>(
    `/api/playrooms/${playroomId}/turns`,
  );
  return data;
};

export default apiGetPlayroomTurns;
