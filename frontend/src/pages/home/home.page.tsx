import MainLayout from "@/shared/ui/layout/MainLayout";
import { PartySidebar } from "@/widgets/PartySidebar/ui/PartySidebar";
import { TimelineSidebar } from "@/widgets/TimelineSidebar/ui/TimelineSidebar";
import { GameHeader } from "@/widgets/GameHeader/ui/GameHeader";
import { StoryBoard } from "@/widgets/StoryBoard/ui/StoryBoard";
import { ActionPanel } from "@/widgets/ActionPanel/ui/ActionPanel";

const HomePage = () => {
  return (
    <MainLayout
      leftSidebar={<PartySidebar />}
      rightSidebar={<TimelineSidebar />}
      header={<GameHeader />}
    >
      <div className="space-y-8">
        <StoryBoard />
        <ActionPanel />
      </div>
    </MainLayout>
  );
};

export default HomePage;
