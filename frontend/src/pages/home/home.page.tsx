import MainLayout from "@/shared/ui/layout/MainLayout";
import { CreatePlayroomForm } from "@/features/playroom/create-playroom/ui/CreatePlayroomForm";

const HomePage = () => {
  return (
    <MainLayout>
      <div className="h-full flex flex-col items-center justify-center mt-20">
        <CreatePlayroomForm />
      </div>
    </MainLayout>
  );
};

export default HomePage;
