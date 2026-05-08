export const ActionPanel = () => {
  return (
    <div className="pt-8 border-t border-border/50 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <button className="flex flex-col items-start gap-1 p-4 rounded-xl bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-all hover:scale-[1.02] text-left">
          <span className="text-primary text-[10px] font-bold uppercase tracking-widest">Действие 1</span>
          <span className="font-medium">Заказать еще эля и послушать слухи</span>
        </button>
        <button className="flex flex-col items-start gap-1 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:scale-[1.02] text-left">
          <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Действие 2</span>
          <span className="font-medium">Подойти к солдатам и спросить про Валлен</span>
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="Напишите свой вариант действия..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-white"
          />
          <button className="absolute right-2 top-1.5 p-1.5 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-medium text-sm">
          <span>🎒</span>
          <span>Инвентарь</span>
        </button>
      </div>
    </div>
  );
};
