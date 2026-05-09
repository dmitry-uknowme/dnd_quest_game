import { World } from "@/entities/world";
import apiClient from "../apiClient";

export interface ApiCreateWorldPayload {
  playroom_id: string;
  title: string;
}

const apiCreateWorld = async (payload: ApiCreateWorldPayload) => {
  const { data } = await apiClient.post<World>(
    `/api/playrooms/${payload.playroom_id}/world`,
    payload,
  );
  return data;
};

export default apiCreateWorld;
