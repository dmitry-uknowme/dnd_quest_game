interface GameLoaderProps {
  isLoading: boolean;
  text?: string;
}

export const GameLoader = ({ isLoading, text = "Формирование мира..." }: GameLoaderProps) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md">
      <div className="flex flex-col items-center gap-8">
        <div className="relative size-20">
          <div className="absolute inset-0 border-4 border-primary/30 rounded-xl animate-[spin_3s_linear_infinite]" />
          <div className="absolute inset-2 border-4 border-primary rounded-lg animate-[spin_2s_linear_infinite_reverse] shadow-[0_0_15px_var(--color-primary)]" />
          <div className="absolute inset-5 bg-primary/50 rounded animate-pulse shadow-[0_0_20px_var(--color-primary)]" />
        </div>
        <div className="text-primary font-bold tracking-[0.3em] text-lg animate-pulse">
          {text}
        </div>
      </div>
    </div>
  );
};
