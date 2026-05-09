import TelegramIcon from "@/assets/images/telegram-icon.svg?react";
import styles from "../button.module.scss";
import { cn } from "@/shared/lib/css";

const TelegramIconButton: React.FC<
  React.ComponentProps<"button"> & { className?: string }
> = ({ className }) => {
  return (
    <a
      className={cn(styles.telegram, className)}
      href="https://t.me"
      target="_blank"
    >
      <TelegramIcon />
    </a>
  );
};

export default TelegramIconButton;
