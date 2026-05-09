import Logo from "@/assets/images/logo.svg?react";
import styles from "./navbar.module.scss";
import Button from "../button/button";
import { cn } from "@/shared/lib/css";
import type { RefObject } from "react";
import { Link } from "react-router-dom";
import BurgerIcon from "@/assets/images/burger-icon.svg?react";

const navItems = [
  { label: "О нас", route: "/#about" },
  { label: "Кейсы", route: "/#cases" },
  { label: "Битрикс", route: "/#bitrix-partner" },
  { label: "Контакты", route: "/#contacts" },
];

interface NavbarProps {
  className?: string;
  bordered?: boolean;
  ref: RefObject<HTMLDivElement | null>;
}

const Navbar: React.FC<NavbarProps> = ({
  className,
  ref,
  bordered = false,
}) => {
  return (
    <nav
      className={cn(styles.navbar, className, bordered && styles._bordered)}
      ref={ref}
    >
      <Link to="/#intro">
        <Logo className={styles.logo} />
      </Link>
      <ul className={styles.navbarItems}>
        {navItems.map((item) => (
          <li key={item.label} className={styles.navbarItem}>
            <a href={item.route}>{item.label}</a>
          </li>
        ))}
      </ul>
      <Button variant={"light"} className={styles.contactBtn}>
        Обсудить проект
      </Button>
      <button className={styles.burgerBtn}>
        <BurgerIcon />
      </button>
    </nav>
  );
};

export default Navbar;
