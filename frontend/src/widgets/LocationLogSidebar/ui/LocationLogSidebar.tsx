import { TurnDetail } from "@/entities/turn/model/turn";
import { cn } from "@/shared/lib/css";

interface LocationLogSidebarProps {
  turns: TurnDetail[];
  currentLocationTitle?: string;
}

export const LocationLogSidebar = ({
  turns,
  currentLocationTitle,
}: LocationLogSidebarProps) => {
  // Build unique location history from turns (in chronological order)
  const seenIds = new Set<string>();
  const locationHistory: { id: string; title?: string; turnNumber: number }[] = [];

  turns.forEach((turn) => {
    if (!seenIds.has(turn.location_id)) {
      seenIds.add(turn.location_id);
      locationHistory.push({
        id: turn.location_id,
        // We don't get title from turn directly — use generic fallback
        title: undefined,
        turnNumber: turn.number,
      });
    }
  });

  // If no turns yet, show just current location
  const isEmpty = locationHistory.length === 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
        История локаций
      </div>

      {isEmpty && currentLocationTitle && (
        <div className="relative pl-6">
          <div className="absolute left-[11px] top-0 bottom-0 w-px bg-border/30" />
          <div className="relative">
            <div className="absolute -left-[23px] size-3 rounded-full border-2 border-background bg-primary shadow-[0_0_8px_var(--color-primary)]" />
            <div className="text-sm font-medium text-foreground">
              {currentLocationTitle}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">Текущая</div>
          </div>
        </div>
      )}

      {!isEmpty && (
        <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-border/30">
          {locationHistory.map((loc, idx) => {
            const isLast = idx === locationHistory.length - 1;
            return (
              <div key={loc.id} className="relative">
                <div
                  className={cn(
                    "absolute -left-[23px] size-3 rounded-full border-2 border-background",
                    isLast
                      ? "bg-primary shadow-[0_0_8px_var(--color-primary)]"
                      : "bg-muted",
                  )}
                />
                <div
                  className={cn(
                    "text-sm font-medium",
                    isLast ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {currentLocationTitle && isLast
                    ? currentLocationTitle
                    : `Локация ${idx + 1}`}
                </div>
                <div className="text-xs text-muted-foreground/50 mt-0.5">
                  Ход {loc.turnNumber}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
