import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "framer-motion";

import { cn } from "@/shared/lib/css";
import styles from "./tabs.module.scss";

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
	return <TabsPrimitive.Root data-slot="tabs" className={cn("flex flex-col gap-2", className)} {...props} />;
}

let globalLastClipPath = "inset(0 100% 0 0 round 40px)";

function TabsList({
	className,
	variant,
	animateClip,
	children,
	...props
}: React.ComponentProps<typeof TabsPrimitive.List> & { variant?: "button_light" | "button_primary", animateClip?: boolean }) {
	const containerRef = React.useRef<HTMLDivElement>(null);
	const [clipPathTarget, setClipPathTarget] = React.useState(globalLastClipPath);

	React.useEffect(() => {
		const container = containerRef.current;
		if (!container || !animateClip) return;

		const updateClip = () => {
			const mainList = container.parentElement?.querySelector('[data-slot="tabs-list-main"]');
			if (!mainList) return;
			const activeTabEl = mainList.querySelector('[data-state="active"]') as HTMLElement;

			if (activeTabEl) {
				const { offsetLeft, offsetWidth } = activeTabEl;
				const clipLeft = offsetLeft;
				const clipRight = offsetLeft + offsetWidth;

				const rightInset = 100 - (clipRight / container.offsetWidth) * 100;
				const leftInset = (clipLeft / container.offsetWidth) * 100;

				// Clamp values to prevent negative insets
				const safeRight = Math.max(0, rightInset);
				const safeLeft = Math.max(0, leftInset);

				const nextClipPathTarget = `inset(0 ${safeRight}% 0 ${safeLeft}% round 40px)`;
				setClipPathTarget(nextClipPathTarget);
				globalLastClipPath = nextClipPathTarget;
			} else {
				setClipPathTarget(`inset(0 100% 0 0 round 40px)`);
			}
		};

		const observer = new MutationObserver(updateClip);
		const mainList = container.parentElement?.querySelector('[data-slot="tabs-list-main"]');
		if (mainList) {
			observer.observe(mainList, { attributes: true, subtree: true, attributeFilter: ["data-state"] });
		}
		window.addEventListener("resize", updateClip);

		const timer = setTimeout(updateClip, 10);

		return () => {
			observer.disconnect();
			window.removeEventListener("resize", updateClip);
			clearTimeout(timer);
		};
	}, [animateClip]);

	if (animateClip) {
		return (
			<div className="relative w-max">
				<TabsPrimitive.List
					data-slot="tabs-list-main"
					className={cn(styles.tabs, styles._clip_path_main, className)}
					{...props}
				>
					{children}
				</TabsPrimitive.List>

				<motion.div
					aria-hidden
					className="absolute inset-0 pointer-events-none"
					ref={containerRef as any}
					initial={false}
					animate={{ clipPath: clipPathTarget }}
					transition={{ type: "spring", stiffness: 450, damping: 35, mass: 1, duration: 0.5 }}
					style={{
						background: "var(--primary)",
						borderRadius: "40px",
						zIndex: -1,
					}}
				>
					<TabsPrimitive.List className={cn(styles.tabs, styles._clip_path_overlay, className)} tabIndex={-1}>
						{React.Children.map(children, (child) => {
							if (React.isValidElement<{ className?: string }>(child)) {
								return React.cloneElement(child, {
									tabIndex: -1,
									className: cn(child.props.className, styles._overlay_tab),
								} as any);
							}
							return child;
						})}
					</TabsPrimitive.List>
				</motion.div>
			</div>
		);
	}

	return (
		<TabsPrimitive.List
			data-slot="tabs-list"
			className={cn(
				styles.tabs,
				variant === "button_light" ? styles._button_light : "",
				variant === "button_primary" ? styles._button_primary : "",
				className,
			)}
			{...props}
		>
			{children}
		</TabsPrimitive.List>
	);
}

function TabsTrigger({
	className,
	variant,
	animateClip,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & { variant?: "button_light" | "button_primary", animateClip?: boolean }) {
	return (
		<TabsPrimitive.Trigger
			data-slot="tabs-trigger"
			className={cn(
				styles.tab,
				variant === "button_light" ? styles._button_light : "",
				variant === "button_primary" ? styles._button_primary : "",
				animateClip ? styles._clip_path : "",
				className,
			)}
			{...props}
		/>
	);
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
	return <TabsPrimitive.Content data-slot="tabs-content" className={cn("flex-1 outline-none", className)} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
