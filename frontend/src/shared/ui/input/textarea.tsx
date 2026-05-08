import { useRef } from "react";
import { cn } from "@/shared/lib/css";
import AttachmentIcon from "@/assets/images/attachment-icon.svg?react";
import styles from "./input.module.scss";

type TextareaProps = React.ComponentProps<"textarea"> & {
	onFileChange: (file: FileList) => void;
};

const Textarea = ({ className, onFileChange, ...props }: TextareaProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const fileRef = useRef<HTMLInputElement>(null);

	const expand = () => {
		const containerEl = containerRef.current!;
		const el = containerEl.querySelector("textarea");
		if (!el) return;

		const lineHeight = parseInt(getComputedStyle(el).lineHeight);
		el.style.height = `${lineHeight * 3}px`;
	};

	const collapse = () => {
		const containerEl = containerRef.current!;
		const el = containerEl.querySelector("textarea");
		if (!el) return;
		el.style.height = "auto";
	};
	return (
		<div ref={containerRef} className="relative">
			<input
				className="hidden"
				type="file"
				ref={fileRef}
				onInput={(event) => onFileChange((event.target as HTMLInputElement).files!)}
			/>
			<AttachmentIcon className="absolute top-0 right-0 cursor-pointer" onClick={() => fileRef.current?.click()} />
			<textarea
				data-slot="textarea"
				className={cn(styles.input, className)}
				onFocus={expand}
				onBlur={collapse}
				onInput={expand}
				{...props}
			/>
		</div>
	);
};

export default Textarea;
