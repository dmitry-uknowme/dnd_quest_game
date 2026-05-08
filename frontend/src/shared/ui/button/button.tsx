import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/css";

import styles from "./button.module.scss";
import { ThemeSizes } from "@/shared/model/theme/sizes";

export const buttonVariants = cva(
	styles.btn,
	// "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
	{
		variants: {
			variant: {
				primary: styles.primary,
				dark: styles.dark,
				light: styles.light,
				light_icon: styles.light_icon,
				link_light: styles.linkLight,
			},
			size: {
				[ThemeSizes.md]: "",
				[ThemeSizes.sm]: ThemeSizes.sm,
				[ThemeSizes.lg]: ThemeSizes.lg,
			},
			state: { default: "", hover: styles._hover, active: styles._active, disabled: styles._disabled },
		},
		defaultVariants: {
			variant: "dark",
			size: ThemeSizes.md,
			state: "default",
		},
	}
);

const Button = ({
	className,
	variant = "dark",
	size = ThemeSizes.md,
	state = "default",
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) => {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot="button"
			data-variant={variant}
			data-size={size}
			data-state={state}
			className={cn(buttonVariants({ variant, size, state, className }))}
			{...props}
		/>
	);
};

export default Button;
