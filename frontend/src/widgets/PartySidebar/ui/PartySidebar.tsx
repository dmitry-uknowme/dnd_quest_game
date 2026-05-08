import { PlayerCard } from "@/entities/Player/ui/PlayerCard";

const mockPlayers = [
  { id: 1, name: "Geralion", role: "Маг", level: 10, hp: 80, maxHp: 100, avatar: "🧙‍♂️" },
  { id: 2, name: "ДимаЛарго", role: "Лучник", level: 8, hp: 45, maxHp: 90, avatar: "🏹" },
  { id: 3, name: "Дядя Фёдор", role: "Плут", level: 12, hp: 100, maxHp: 100, avatar: "🗡️" },
];

export const PartySidebar = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Группа</div>
      {mockPlayers.map((player) => (
        <PlayerCard key={player.id} player={player} />
      ))}
    </div>
  );
};
