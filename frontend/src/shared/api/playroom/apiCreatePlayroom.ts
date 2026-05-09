import { Playroom } from "@/entities/playroom";
import apiClient from "../apiClient";

const apiCreatePlayroom = async () => {
  const { data } = await apiClient.post<Playroom>("/api/playrooms", {
    title: "New World",
  });
  return data;
};

export default apiCreatePlayroom;
