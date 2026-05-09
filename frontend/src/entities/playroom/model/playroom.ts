import { Player } from "@/entities/player";
import { World } from "@/entities/world";

export interface Playroom {
  id: string;
  title: string;
  status: string;
  players: Player[];
}

export interface PlayroomDetail extends Playroom {
  world: World;
}
