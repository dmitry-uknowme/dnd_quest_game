import { Player } from "@/entities/player";
import { World } from "@/entities/world";
import { Location } from "@/entities/location";

export interface Playroom {
  id: string;
  title: string;
  status: "STATUS_ACTIVE" | "STATUS_STARTED";
  players: Player[];
}

export interface PlayroomDetail extends Playroom {
  world: World;
  active_location: Location | null;
}
