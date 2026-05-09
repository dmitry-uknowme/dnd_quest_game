import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "@/pages/home/home.page";
import PlayroomPage from "@/pages/playroom/playroom.page";
import GamePage from "@/pages/game/game.page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", Component: HomePage },
      { path: "/playrooms/:roomId", Component: PlayroomPage },
      { path: "/playrooms/:roomId/game", Component: GamePage },
    ],
  },
]);

export default router;
