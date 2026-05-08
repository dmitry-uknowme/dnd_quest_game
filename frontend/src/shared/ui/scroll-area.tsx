import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "@/shared/lib/css";
import { Portal } from "@radix-ui/react-portal";
import { createPortal } from "react-dom";

export interface ScrollAreaProps extends React.ComponentProps<typeof ScrollAreaPrimitive.Root> {
	className?: string;
	children: React.ReactNode;
	viewportClassName?: string;
	orientation: "vertical" | "horizontal" | "both";
	scrollBarPortalRef?: HTMLElement;
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
	({ className, viewportClassName, orientation = "vertical", children, scrollBarPortalRef, ...props }, ref) => {
		const overflowClassName = "overflow-hidden";
		const viewportRef = React.useRef<HTMLDivElement | null>(null);

		// expose внутренний viewport наружу через ref
		React.useImperativeHandle(ref, () => viewportRef.current as HTMLDivElement, []);

		const renderScrollbar =
			orientation === "both" ? (
				<>
					<ScrollBar orientation={"horizontal"} />
					<ScrollBar orientation={"vertical"} />
				</>
			) : (
				<ScrollBar orientation={orientation} />
			);

		return (
			<ScrollAreaPrimitive.Root
				data-slot="scroll-area"
				className={cn("relative", overflowClassName, className)}
				{...props}
			>
				<ScrollAreaPrimitive.Viewport
					ref={viewportRef}
					data-slot="scroll-area-viewport"
					className={cn(
						"scroll-area-viewport focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1 min-h-0 min-w-0",
						viewportClassName
					)}
				>
					{children}
				</ScrollAreaPrimitive.Viewport>

				{scrollBarPortalRef ? createPortal(renderScrollbar, document.body) : renderScrollbar}

				<ScrollAreaPrimitive.Corner />
			</ScrollAreaPrimitive.Root>
		);
	}
);
const ScrollBar = ({
	className,
	orientation = "vertical",
	...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) => {
	return (
		<ScrollAreaPrimitive.ScrollAreaScrollbar
			data-slot="scroll-area-scrollbar"
			orientation={orientation}
			className={cn(
				"flex touch-none p-px transition-colors select-none",
				orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent",
				orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent",
				className
			)}
			{...props}
		>
			<ScrollAreaPrimitive.ScrollAreaThumb
				data-slot="scroll-area-thumb"
				className="bg-border relative flex-1 rounded-full"
			/>
		</ScrollAreaPrimitive.ScrollAreaScrollbar>
	);
};

export { ScrollArea, ScrollBar };
