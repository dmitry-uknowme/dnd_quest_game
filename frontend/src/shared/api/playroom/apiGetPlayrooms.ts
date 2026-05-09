import apiClient from "../apiClient";
import { PlayroomDetail } from "@/entities/playroom/model/playroom";

const apiGetPlayrooms = async () => {
  const { data } = await apiClient.get<PlayroomDetail[]>(`/api/playrooms`);
  return data;
};

export default apiGetPlayrooms;
