import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "@/pages/home/home.page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [{ path: "/", Component: HomePage }],
  },
]);

export default router;
