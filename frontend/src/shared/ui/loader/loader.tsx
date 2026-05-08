import { cn } from "@/shared/lib/css";
import styles from "./loader.module.scss";

interface LoaderProps {
	spin?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ spin = true }) => {
	return (
		<div className={cn(styles.loader, spin ? styles._spin : "")}>
			<svg viewBox="0 0 50 50">
				<defs>
					<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
						{/* <stop offset="0%" style={{ stopColor: "#8b5cf6", stopOpacity: 1 }} />
						<stop offset="50%" style={{ stopColor: "#a78bfa", stopOpacity: 1 }} />
						<stop offset="100%" style={{ stopColor: "#8b5cf6", stopOpacity: 1 }} /> */}
						<stop offset="0%" style={{ stopColor: "#B350FF", stopOpacity: 1 }} />
						<stop offset="50%" style={{ stopColor: "#8b5cf6", stopOpacity: 1 }} />
						<stop offset="100%" style={{ stopColor: "#B350FF", stopOpacity: 1 }} />
					</linearGradient>
				</defs>
				<circle
					cx="25"
					cy="25"
					r="20"
					fill="none"
					stroke="url(#gradient)"
					strokeWidth="8"
					strokeLinecap="round"
					strokeDasharray="90 200"
				/>
			</svg>
		</div>
	);
};

export default Loader;
