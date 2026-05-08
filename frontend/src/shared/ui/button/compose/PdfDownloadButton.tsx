import PdfIcon from "@/assets/images/pdf-icon.svg?react";
import { cn } from "@/shared/lib/css";
import styles from "../button.module.scss";
import Button from "../button";

const PdfDownloadButton: React.FC<React.ComponentProps<"button"> & { className?: string }> = ({ className }) => {
	return (
		<a href="https://it-up.org/cases_it_up.pdf" target="_blank">
			<Button variant="link_light" className={className}>
				<PdfIcon /> Скачать презентацию
			</Button>
		</a>
		// <a className={cn(styles.pdfDownload, className)} href="https://it-up.org/cases_it_up.pdf" target="_blank">
		// 	<PdfIcon /> Скачать презентацию
		// </a>
		// <motion.button className={cn(styles.expand, className)} whileHover="hover" initial="initial">
		// 	Подробнее
		// 	<motion.span
		// 		variants={{
		// 			initial: { x: 0 },
		// 			hover: {
		// 				x: [0, 5, 0],
		// 				transition: {
		// 					duration: 0.6,
		// 					ease: "easeInOut",
		// 					repeat: Infinity,
		// 				},
		// 			},
		// 		}}
		// 	>
		// 		<ExpandArrowIcon />
		// 	</motion.span>
		// </motion.button>
		// <button className={cn(styles.expand, className)}>
		//   Подробнее <ExpandArrowIcon />
		// </button>
	);
};

export default PdfDownloadButton;
