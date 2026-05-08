import { Link, useLocation } from "react-router-dom";
import Button from "../../button/button";
import TelegramIconButton from "../../button/icon/TelegramIconButton";
import { ContactForm, Dialog, DialogContent, DialogTrigger } from "../../dialog/dialog";
import styles from "./sidebar.module.scss";
import { cn } from "@/shared/lib/css";

const navItems = [
	{ label: "О нас", route: "/#about" },
	{ label: "Кейсы", route: "/cases" },
	{ label: "Собственный продукт", route: "/products" },
	{ label: "Битрикс", route: "/bitrix-partner" },
	{ label: "Контакты", route: "/contacts" },
];

const Sidebar = () => {
	const { pathname } = useLocation();
	const isActive = (route: string) => (pathname === route) || (pathname.startsWith(route) && route !== "/");
	return (
		<div className={styles.sidebar}>
			<ul className={styles.navItems}>
				{navItems.map((item) => (
					<li key={item.label} className={cn(styles.navItem, isActive(item.route) && styles._active)}>
						<Link to={item.route}>
							<h3>{item.label}</h3>
						</Link>
					</li>
				))}
			</ul>
			<Dialog>
				<DialogTrigger asChild>
					<Button variant={"light"} className="md:w-[60%] mx-auto">
						Обсудить проект
					</Button>
				</DialogTrigger>
				<DialogContent>
					<ContactForm />
				</DialogContent>
			</Dialog>
			<div className={styles.contacts}>
				<div className="flex flex-col gap-2">
					<a href="tel:79511534777">
						<p>+7 951 153-47-77</p>
					</a>
					<a href="mailto:info@it-up.org">
						<p>info@it-up.org</p>
					</a>
				</div>
				<TelegramIconButton className="size-12! md:size-15!" />
			</div>
		</div>
	);
};

export default Sidebar;
