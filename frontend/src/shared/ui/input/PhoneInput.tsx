import { MaskedInput, createDefaultMaskGenerator } from "react-hook-mask";
import { cn } from "@/shared/lib/css";
import styles from "./input.module.scss";

const ruMaskGenerator = createDefaultMaskGenerator("+7 999 999-99-99");

type PhoneInputProps = {
	value?: string;
	onChange: (value: string) => void;
} & React.ComponentProps<"input">;

const PhoneInput: React.FC<PhoneInputProps> = (props) => {
	return (
		<MaskedInput
			className={cn(styles.input)}
			maskGenerator={ruMaskGenerator}
			placeholder="+7 999 999-99-99"
			value={props.value ?? ""}
			{...props}
		/>
	);
};

export default PhoneInput;
