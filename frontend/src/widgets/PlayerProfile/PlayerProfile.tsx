import { cn } from "@/shared/lib/css";

const MOCK_PLAYER = {
  id: "1",
  name: "Эльдриан Громовержец",
  role: "Паладин Клятвы Возмездия",
  level: 12,
  hp: 84,
  maxHp: 120,
  avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Eldrian",
  stats: [
    { label: "STR", value: 18, color: "text-red-400" },
    { label: "DEX", value: 12, color: "text-green-400" },
    { label: "CON", value: 16, color: "text-orange-400" },
    { label: "INT", value: 10, color: "text-blue-400" },
    { label: "WIS", value: 14, color: "text-purple-400" },
    { label: "CHA", value: 16, color: "text-pink-400" },
  ],
  inventory: [
    { name: "Святой Мститель", type: "Оружие" },
    { name: "Зелье лечения (бол.)", type: "Расходник" },
    { name: "Кольцо защиты", type: "Аксессуар" },
  ],
};

export const PlayerProfile = () => {
  const hpPercentage = (MOCK_PLAYER.hp / MOCK_PLAYER.maxHp) * 100;

  return (
    <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
      
      <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
        {/* Avatar Section */}
        <div className="relative flex-shrink-0">
          <div className="w-32 h-32 rounded-full border-4 border-primary/30 p-1 relative">
            <img 
              src={MOCK_PLAYER.avatar} 
              alt={MOCK_PLAYER.name}
              className="w-full h-full rounded-full bg-muted object-cover"
            />
            {/* Health Ring Overlay */}
            <svg className="absolute -top-1 -left-1 w-[136px] h-[136px] -rotate-90 pointer-events-none">
              <circle
                cx="68"
                cy="68"
                r="64"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={2 * Math.PI * 64}
                strokeDashoffset={2 * Math.PI * 64 * (1 - hpPercentage / 100)}
                className="text-success transition-all duration-1000 ease-out"
              />
            </svg>
          </div>
          <div className="absolute -bottom-2 right-0 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg border border-white/20">
            Lvl {MOCK_PLAYER.level}
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1 space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">{MOCK_PLAYER.name}</h2>
            <p className="text-primary-foreground/60 font-medium">{MOCK_PLAYER.role}</p>
          </div>

          {/* HP Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-success">Здоровье</span>
              <span className="text-white">{MOCK_PLAYER.hp} / {MOCK_PLAYER.maxHp} HP</span>
            </div>
            <div className="w-full h-3 bg-muted/50 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-success/80 to-success transition-all duration-1000 ease-out shadow-[0_0_10px_var(--color-success)]"
                style={{ width: `${hpPercentage}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {MOCK_PLAYER.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <span className={cn("text-xs font-bold uppercase", stat.color)}>{stat.label}</span>
                <span className="text-lg font-bold text-white">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Section (Side) */}
        <div className="w-full md:w-48 space-y-3">
          <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">Инвентарь</h3>
          <div className="flex flex-col gap-2">
            {MOCK_PLAYER.inventory.map((item) => (
              <div key={item.name} className="p-2 rounded-lg bg-white/5 border border-white/5 flex flex-col hover:border-white/20 transition-all cursor-default">
                <span className="text-xs text-white font-medium truncate">{item.name}</span>
                <span className="text-[10px] text-white/40">{item.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
