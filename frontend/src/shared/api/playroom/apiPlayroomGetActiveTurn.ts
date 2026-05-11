import apiClient from "../apiClient";
import { TurnDetail } from "@/entities/turn/model/turn";

const apiPlayroomGetActiveTurn = async (playroomId: string) => {
  const { data } = await apiClient.get<TurnDetail>(
    `/api/playrooms/${playroomId}/active-turn`,
  );
  return data;
};

export default apiPlayroomGetActiveTurn;
