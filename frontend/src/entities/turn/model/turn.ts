export interface TurnDetail {
  id: string;
  number: number;
  result_text: string;
  state_updates: {
    transition: {
      should_transition: boolean;
    };
    memory_seed: string;
    stat_changes: string[];
    turn_summary: string;
    npc_reactions: string[];
    choice_variants: string[];
    location_changes: string[];
    inventory_changes: string[];
  };
  playroom_id: string;
  location_id: string;
  player_turns: {
    id: string;
    number: number;
    input_text: string;
    state_updates: string;
    player: {
      id: string;
      username: string;
      email: null;
    };
  }[];
}
