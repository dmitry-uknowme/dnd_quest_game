import MainLayout from "@/shared/ui/layout/MainLayout";
import { CreatePlayroomForm } from "@/features/playroom/create-playroom/ui/CreatePlayroomForm";
import { PlayerProfile } from "@/widgets/PlayerProfile";
import { RecentGames } from "@/widgets/RecentGames";

const HomePage = () => {
  return (
    <MainLayout leftSidebar={null} rightSidebar={null}>
      <div className="flex flex-col gap-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Top: Large Profile Hero */}
        <section className="w-full">
          <PlayerProfile />
        </section>

        {/* Bottom: Two columns */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="h-full">
            <CreatePlayroomForm />
          </div>
          <div className="h-full">
            <RecentGames />
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default HomePage;
