export const TurnLoader = () => {
  return (
    <div className="flex items-start gap-3 flex-row-reverse">
      <div className="size-8 rounded-full bg-purple-900/60 border border-purple-500/40 flex items-center justify-center text-sm shrink-0 mt-1">
        🎲
      </div>
      <div className="bg-card/60 border border-white/10 rounded-2xl rounded-tr-sm px-5 py-4 backdrop-blur-sm max-w-[88%]">
        <div className="text-[10px] font-bold text-purple-400/80 uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <span>⚔️</span>
          <span>Мастер обдумывает ход...</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Animated d20 */}
          <div className="relative size-10 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-primary/30 rounded-xl animate-[spin_3s_linear_infinite]" />
            <div className="absolute inset-1 border-2 border-primary/60 rounded-lg animate-[spin_2s_linear_infinite_reverse]" />
            <span className="text-base z-10 animate-pulse">🎲</span>
          </div>
          {/* Pulsing dots */}
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="size-2 rounded-full bg-primary/60"
                style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground italic">
            Генерация ответа...
          </span>
        </div>
      </div>
    </div>
  );
};
