import { Outlet } from "react-router-dom";
import { MainProvider } from "./provider/main-provider";

const App = () => {
  return (
    <div className="app">
      <MainProvider>
        <Outlet />
      </MainProvider>
    </div>
  );
};

export default App;
