import Logo from "@/assets/images/logo.svg?react";
import styles from "./navbar.module.scss";
import { cn } from "@/shared/lib/css";
import type { RefObject } from "react";
import BurgerIcon from "@/assets/images/burger-icon.svg?react";
import Button from "../../button/button";
import { ContactForm, Dialog, DialogContent, DialogTrigger } from "../../dialog/dialog";
import Sidebar from "../sidebar/Sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "../../tabs/tabs";

const navItems = [
	{ label: "О нас", route: "/#about" },
	// { label: "О нас", route: "/" },
	{ label: "Кейсы", route: "/cases" },
	{ label: "Собственный продукт", route: "/products" },
	{ label: "Битрикс", route: "/bitrix-partner" },
	{ label: "Контакты", route: "/contacts" },
];

interface NavbarProps {
	className?: string;
	bordered?: boolean;
	ref?: RefObject<HTMLDivElement | null>;
	activeNavItem?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className, ref, bordered = false, activeNavItem }) => {
	const { pathname, hash } = useLocation();
	const navigate = useNavigate();
	const activeRoute = activeNavItem ? activeNavItem : (pathname + hash);

	const isActive = (route: string) => activeRoute === route || (activeRoute.startsWith(route) && route !== "/");

	const activeValue = navItems.find((item) => isActive(item.route))?.route || "";

	return (
		<nav className={cn(styles.navbar, className, bordered && styles._bordered)} data-brand="ituporg" ref={ref}>
			<a href={"/#intro"}>
				<Logo className={styles.logo} aria-label="ItUp" role="img" />
			</a>
			<Tabs
				value={activeValue}
				onValueChange={(val) => navigate(val)}
				className={styles.navbarItems}
			>
				<TabsList animateClip className={styles.navbarItems}>
					{navItems.map((item) => (
						<TabsTrigger animateClip key={item.route} value={item.route} asChild>
							<Link className={styles.navbarItem} to={item.route}>
								{item.label}
							</Link>
						</TabsTrigger>
					))}
				</TabsList>
			</Tabs>

			<div className="flex gap-4">
				<Dialog>
					<DialogTrigger asChild>
						<Button variant={"light"} className={cn(styles.contactBtn, "hidden md:block")}>
							Обсудить проект
						</Button>
					</DialogTrigger>
					<DialogContent>
						<ContactForm />
					</DialogContent>
				</Dialog>

				<Dialog>
					<DialogTrigger asChild>
						<button className={styles.burgerBtn}>
							<BurgerIcon />
						</button>
					</DialogTrigger>
					<DialogContent showLogo>
						<Sidebar />
					</DialogContent>
				</Dialog>
			</div>
		</nav>
	);
};

export default Navbar;
