import { cn } from "@/shared/lib/css";

const chapters = [
  { id: 1, name: "Глава 1: Пролог", active: false },
  { id: 2, name: "Глава 2: Тёмный лес", active: true },
  { id: 3, name: "Глава 3: Древние руины", active: false },
];

export const TimelineSidebar = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">История глав</div>
      <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-border/50">
        {chapters.map((chapter) => (
          <div key={chapter.id} className="relative">
            <div className={cn(
              "absolute -left-[23px] size-3 rounded-full border-2 border-background",
              chapter.active ? "bg-primary shadow-[0_0_8px_var(--color-primary)]" : "bg-muted"
            )} />
            <div className={cn(
              "text-sm font-medium transition-colors",
              chapter.active ? "text-foreground" : "text-muted-foreground hover:text-foreground cursor-pointer"
            )}>
              {chapter.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
