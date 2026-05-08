import { ReactNode, useEffect } from "react";
import Footer from "./footer/Footer";
import Navbar from "./navbar/Navbar";
import { cn } from "@/shared/lib/css";
import TelegramIconButton from "../button/icon/TelegramIconButton";
import { useLocation, useNavigate } from "react-router-dom";

interface MainLayoutProps {
	children: ReactNode;
	footer?: ReactNode;
	className?: string;
	dataBrand?: string;
	activeNavItem?: string | null;
}

const MainLayout: React.FC<MainLayoutProps> = ({
	children,
	className,
	dataBrand = "ituporg",
	footer,
	activeNavItem,
}) => {
	const { pathname, hash } = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	useEffect(() => {
		// const hashElement = document.querySelector(`${hash}`);
		// if (hash) {
		// 	navigate({ pathname, hash: undefined });
		// }
		// console.log({ hashElement });
		// if (hash && hashElement) {
		// 	hashElement.scrollIntoView();
		// } else {
		window.scrollTo(0, 0);
		// }
	}, []);
	return (
		<div className={cn("app", className)} data-brand={dataBrand ?? undefined} tabIndex={0}>
			<TelegramIconButton className="fixed size12! md:size-15! md:bottom-[92px] bottom-[50px] md:right-[80px] right-4 z-50 text-primary" />
			<Navbar
				className="relative md:fixed container top-0 left-0 md:top-[22px] md:left-[50%] md:translate-x-[-50%] z-50 md:pr-15 md:pl-15"
				activeNavItem={activeNavItem}
			/>
			{children}
			{footer === null ? null : footer ?? <Footer />}
		</div>
	);
};

export default MainLayout;
