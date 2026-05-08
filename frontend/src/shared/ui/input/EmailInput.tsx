import { useFormContext } from "react-hook-form";
import { Input } from "./input";
import { cn } from "@/shared/lib/css";
import styles from "./input.module.scss";

const EmailInput: React.FC<React.ComponentProps<"input">> = ({ name, ...props }) => {
	const { register } = useFormContext();

	return (
		<Input
			className={cn(styles.input)}
			type="email"
			autoComplete="email"
			{...register(name!, {
				required: "Email обязателен",
				pattern: {
					value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
					message: "Некорректный email",
				},
			})}
			{...props}
		/>
	);
};

export default EmailInput;
