import { TurnDetail } from "@/entities/turn/model/turn";
import { cn } from "@/shared/lib/css";

interface MasterTurnCardProps {
  turn: TurnDetail;
  isLast?: boolean;
  activeAnswerVariants?: string[];
  onChooseAction?: (action: string) => void;
}

const DICE_EMOJI = "⚔️";

export const MasterTurnCard = ({
  turn,
  isLast = false,
  activeAnswerVariants,
  onChooseAction,
}: MasterTurnCardProps) => {
  // choice_variants can come from state_updates or from the schema-level field
  const variants = isLast
    ? (activeAnswerVariants ?? turn.state_updates?.choice_variants ?? [])
    : [];

  return (
    <div className="space-y-4">
      {/* Player turns */}
      {turn.player_turns.map((pt) => (
        <div key={pt.id} className="flex items-start gap-3">
          <div className="size-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-sm font-bold text-primary shrink-0 mt-1">
            {pt.player.username?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
            <div className="text-[10px] font-bold text-primary/70 uppercase tracking-widest mb-1">
              {pt.player.username}
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">
              {pt.input_text}
            </p>
          </div>
        </div>
      ))}

      {/* Master response */}
      {turn.result_text && (
        <div className="flex items-start gap-3 flex-row-reverse">
          <div className="size-8 rounded-full bg-purple-900/60 border border-purple-500/40 flex items-center justify-center text-sm shrink-0 mt-1">
            🎲
          </div>
          <div className="flex-1 max-w-[88%]">
            {/* Master narrative */}
            <div className="bg-card/60 border border-white/10 rounded-2xl rounded-tr-sm px-5 py-4 backdrop-blur-sm">
              <div className="text-[10px] font-bold text-purple-400/80 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <span>⚔️</span>
                <span>Мастер</span>
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {turn.result_text}
              </p>
            </div>

            {/* Dice roll decoration */}
            <div className="mt-2 flex items-center gap-2 px-2">
              <div className="text-white/20 text-xs flex items-center gap-2">
                <span className="font-mono">🎲 d20</span>
                <div className="h-px flex-1 bg-white/10 min-w-[40px]" />
              </div>
            </div>

            {/* Answer variants — only for last turn */}
            {isLast && variants.length > 0 && onChooseAction && (
              <div className="mt-4 space-y-2">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                  Варианты действий
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {variants.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => onChooseAction(v)}
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
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
