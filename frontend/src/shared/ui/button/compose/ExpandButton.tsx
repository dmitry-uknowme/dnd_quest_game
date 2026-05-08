import ExpandArrowIcon from "@/assets/images/expand-arrow-icon.svg?react";
import Button from "../button";

const ExpandButton: React.FC<React.ComponentProps<"button"> & { className?: string }> = ({ className }) => {
	return (
		<Button variant="link_light" className={className}>
			Подробнее <ExpandArrowIcon />
		</Button>
	);
};

export default ExpandButton;
