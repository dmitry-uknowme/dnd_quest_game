import apiClient from "../apiClient";

export interface PlayroomMakeTurnPayload {
  playroom_id: string;
  input_text: string;
}

const apiPlayroomMakeTurn = async (payload: PlayroomMakeTurnPayload) => {
  const { data } = await apiClient.post(
    `/api/playrooms/${payload.playroom_id}/make-turn`,
    {
      input_text: payload.input_text,
    },
  );
  return data;
};

export default apiPlayroomMakeTurn;
