import { useEffect, useRef } from "react";
import { TurnDetail } from "@/entities/turn/model/turn";
import { MasterTurnCard } from "./MasterTurnCard";
import { TurnLoader } from "./TurnLoader";
import { ActionInputBar } from "./ActionInputBar";
import { Location } from "@/entities/location";
import { cn } from "@/shared/lib/css";

interface TurnFeedProps {
  turns: TurnDetail[];
  isSubmitting: boolean;
  // Fallback for first location (before any turns)
  initialLocation?: Location | null;
  onSubmitAction: (action: string) => void;
}

export const TurnFeed = ({
  turns,
  isSubmitting,
  initialLocation,
  onSubmitAction,
}: TurnFeedProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new turn arrives or loading starts
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns.length, isSubmitting]);

  const lastTurn = turns[turns.length - 1];

  // Determine answer variants for the input bar:
  // 1. If there are turns — use last turn's choice_variants from state_updates
  // 2. Otherwise — use initial location's answer_variants (first load)
  const activeVariants = lastTurn?.state_updates?.choice_variants?.length
    ? lastTurn.state_updates.choice_variants
    : (initialLocation?.answer_variants ?? []);

  return (
    <div className="flex flex-col h-full w-full min-w-0">
      {/* Feed scroll area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar space-y-6 pb-4 pr-1">
        {/* Empty state */}
        {turns.length === 0 && !isSubmitting && (
          <div className="space-y-4 py-8">
            {initialLocation ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🗺️</span>
                  <h3 className="text-2xl font-bold text-white">
                    {initialLocation.title}
                  </h3>
                </div>
                <p className="text-foreground/80 text-sm leading-relaxed">
                  {initialLocation.description}
                </p>
                <div className="text-xs text-muted-foreground/50 mt-6 uppercase tracking-widest">
                  Выберите действие ниже, чтобы начать
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {activeVariants.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => onSubmitAction(v)}
                      className={cn(
                        "text-left px-4 py-3 rounded-xl border transition-all text-sm",
                        "bg-primary/5 border-primary/20 hover:bg-primary/15 hover:border-primary/40",
                        "text-foreground/80 hover:text-foreground",
                      )}
                    >
                      <span className="text-primary text-[10px] font-bold uppercase tracking-widest block mb-0.5">
                        Действие {i + 1}
                      </span>
                      {v}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-40">
                <div className="text-5xl mb-2">⚔️</div>
                <p className="text-muted-foreground">История ходов пуста</p>
              </div>
            )}
          </div>
        )}

        {/* Turn cards */}
        {turns.map((turn, idx) => (
          <div key={turn.id} className="relative">
            {/* Turn number divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-border/30" />
              <span className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-bold">
                Ход {turn.number}
              </span>
              <div className="h-px flex-1 bg-border/30" />
            </div>

            <MasterTurnCard
              turn={turn}
              isLast={idx === turns.length - 1}
              activeAnswerVariants={activeVariants}
              onChooseAction={!isSubmitting ? onSubmitAction : undefined}
            />
          </div>
        ))}

        {/* Inline loader while AI responds */}
        {isSubmitting && <TurnLoader />}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>

      {/* Action input — always at bottom, no chips (variants shown as big buttons in MasterTurnCard) */}
      <ActionInputBar
        answerVariants={activeVariants}
        isDisabled={isSubmitting}
        onSubmit={onSubmitAction}
      />
    </div>
  );
};
