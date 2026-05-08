import Button from "@/shared/ui/button/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <div className="app">
      <Outlet />
    </div>
  );
};

export default App;
