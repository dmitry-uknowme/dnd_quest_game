import { ReactNode, useEffect } from "react";
import { cn } from "@/shared/lib/css";
import { useLocation } from "react-router-dom";

interface MainLayoutProps {
  children: ReactNode;
  leftSidebar?: ReactNode;
  rightSidebar?: ReactNode;
  header?: ReactNode;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  leftSidebar,
  rightSidebar,
  header,
  className,
}) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div
      className={cn(
        "grid grid-cols-[280px_1fr_280px] grid-rows-[auto_1fr] h-screen bg-background text-foreground overflow-hidden",
        className,
      )}
    >
      {/* Header Slot */}
      <header className="col-span-3 h-14 border-b border-border/50 bg-card/40 backdrop-blur-md z-50 flex items-center px-6 justify-between">
        {header || (
          <div className="font-bold text-primary tracking-wider">
            STORY DUNGEONS
          </div>
        )}
      </header>

      {/* Left Sidebar Slot */}
      <aside className="w-[280px] border-r border-border/50 bg-card/40 backdrop-blur-md overflow-y-auto p-4 flex flex-col gap-6 custom-scrollbar">
        {leftSidebar}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative p-6 custom-scrollbar bg-[radial-gradient(circle_at_center,rgba(179,80,255,0.05)_0%,transparent_70%)]">
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>

      {/* Right Sidebar Slot */}
      <aside className="w-[280px] border-l border-border/50 bg-card/40 backdrop-blur-md overflow-y-auto p-4 flex flex-col gap-6 custom-scrollbar">
        {rightSidebar}
      </aside>
    </div>
  );
};

export default MainLayout;
