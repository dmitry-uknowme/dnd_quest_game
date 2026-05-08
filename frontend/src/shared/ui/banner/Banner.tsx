import { cva } from "class-variance-authority";
import styles from "./banner.module.scss";
import { cn } from "@/shared/lib/css";
import CloseIcon from "@/assets/images/close-icon.svg?react";

interface BannerProps {
	variant: "primary";
	content: React.ReactNode;
	onClose?: () => void;
	className?: string;
}

export const bannerVariants = cva(styles.banner, {
	variants: {
		variant: {
			primary: styles.primary,
		},
	},
	defaultVariants: {
		variant: "primary",
	},
});

const Banner: React.FC<BannerProps> = ({ variant = "primary", content, onClose, className }) => {
	return (
		<div className={cn(bannerVariants({ variant }), className)}>
			<div className="container flex flex-nowrap items-center w-full gap-5">
				<div className={styles.content}>
					{content}
					<button
						className={cn(styles.closeBtn, "md:hidden flex")}
						onClick={() => {
							onClose?.();
							console.log("close");
						}}
					>
						<CloseIcon />
					</button>
				</div>
				<button
					className={cn(styles.closeBtn, "hidden md:flex")}
					onClick={() => {
						onClose?.();
						console.log("close");
					}}
				>
					<CloseIcon />
				</button>
			</div>
		</div>
	);
};

export default Banner;
