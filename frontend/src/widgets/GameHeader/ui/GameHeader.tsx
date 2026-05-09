export const GameHeader = () => {
  return (
    <>
      <div className="font-bold text-primary tracking-wider">
        STORY DUNGEONS
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm bg-white/5 px-3 py-1 rounded-full border border-white/10">
          <span className="text-yellow-500">🪙</span>
          <span className="font-mono">1100</span>
        </div>
        <button className="text-xs font-medium px-4 py-1.5 rounded-md bg-primary text-white hover:opacity-90 transition-opacity">
          Сводка партии
        </button>
      </div>
    </>
  );
};
