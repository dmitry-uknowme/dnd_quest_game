interface PlayerCardProps {
  player: {
    id: number;
    name: string;
    role: string;
    level: number;
    hp: number;
    maxHp: number;
    avatar: string;
  };
}

export const PlayerCard = ({ player }: PlayerCardProps) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
      <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-xl">
        {player.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <div className="font-bold truncate text-sm">{player.name}</div>
          <div className="text-[10px] bg-primary/20 px-1.5 rounded text-primary-300">ур. {player.level}</div>
        </div>
        <div className="text-[11px] text-muted-foreground mb-1.5">{player.role}</div>
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-success transition-all duration-500" 
            style={{ width: `${(player.hp / player.maxHp) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
