import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/css";

interface ActionInputBarProps {
  answerVariants: string[];
  isDisabled?: boolean;
  onSubmit: (action: string) => void;
}

export const ActionInputBar = ({
  answerVariants,
  isDisabled = false,
  onSubmit,
}: ActionInputBarProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isDisabled) return;
    onSubmit(trimmed);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  console.log({ answerVariants });

  return (
    <div
      className={cn(
        "border-t border-border/50 pt-4 space-y-3 transition-opacity",
        isDisabled && "opacity-50 pointer-events-none",
      )}
    >
      {/* Quick action chips */}
      {/* {answerVariants.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {answerVariants.map((v, i) => (
            <button
              key={i}
              className="flex md:flex-basis-40 flex-col items-start gap-1 p-4 rounded-xl bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-all hover:scale-[1.02] text-left text-foreground/80 hover:text-foreground"
              onClick={() => onSubmit(v)}
            >
              <span className="text-primary text-[10px] font-bold uppercase tracking-widest">
                Действие {i + 1}
              </span>
              <span className="font-medium">{v}</span>
            </button>
          ))}
        </div>
      )} */}
      {/* Text input */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isDisabled}
            placeholder={
              isDisabled
                ? "Ожидаем ответа мастера..."
                : "Напишите свой вариант действия..."
            }
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-white placeholder:text-muted-foreground/50"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={isDisabled || !inputValue.trim()}
          className="px-5 py-3 rounded-xl bg-primary text-white hover:opacity-90 transition-opacity disabled:opacity-40 font-medium text-sm flex items-center gap-2"
        >
          <span>Ход</span>
          <svg
            className="size-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 12h14m-7-7l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
