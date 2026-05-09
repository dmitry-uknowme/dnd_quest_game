import Logo from "@/assets/images/logo.svg?react";
import TelegramIcon from "@/assets/images/telegram-icon.svg?react";
import {
  AnimatePresence,
  motion,
  useAnimation,
  useInView,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Banner from "../../banner/Banner";
import Button from "../../button/button";
import {
  ContactForm,
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../dialog/dialog";
import styles from "./footer.module.scss";
import { cn } from "@/shared/lib/css";
import { Link } from "react-router-dom";

const navItems = [
  { label: "О нас", route: "/#about" },
  { label: "Кейсы", route: "/cases" },
  { label: "Собственный продукт", route: "/products" },
  { label: "Битрикс", route: "/bitrix-partner" },
  { label: "Контакты", route: "/contacts" },
];

// const bannerVariants = {
// 	initial: {
// 		height: 0,
// 		opacity: 0,
// 		x: "10%", // лёгкий старт справа, можно убрать
// 		overflow: "hidden", // важно!
// 	},
// 	visible: {
// 		height: "auto",
// 		opacity: 1,
// 		x: 0,
// 	},
// 	hidden: {
// 		height: 0,
// 		opacity: 0,
// 		x: "100%", // уходим вправо
// 		transition: {
// 			duration: 0.45,
// 			ease: [0.22, 1, 0.36, 1],
// 		},
// 	},
// };

const bannerVariants = {
  hidden: {
    height: 0,
    opacity: 0,
    x: "-100%",
    overflow: "hidden",
  },
  visible: {
    height: "auto",
    opacity: 1,
    x: 0,
    overflow: "hidden",
  },
};

const Footer = () => {
  const [bannerEnabled, setBannerEnabled] = useState<boolean | undefined>(
    undefined,
  );
  const [bannerVisible, setBannerVisible] = useState<boolean | undefined>(
    undefined,
  );
  const mainBtnRef = useRef(null);
  const isInView = useInView(mainBtnRef, {
    once: false,
    margin: "-80px 0px -120px 0px", // запускаем чуть раньше, чем блок полностью виден
    amount: 0.25,
  });

  const controls = useAnimation();

  useEffect(() => {
    const storage = localStorage.getItem(
      "globalFeaturesDisableSubscribeBanner",
    );
    if (!storage) {
      localStorage.setItem("globalFeaturesDisableSubscribeBanner", "0");
      // setBannerVisible(true);
      setBannerEnabled(true);
    } else {
      // setBannerVisible(!Boolean(parseInt(localStorage.getItem("globalFeaturesDisableSubscribeBanner") as string)));
      setBannerEnabled(
        !Boolean(
          parseInt(
            localStorage.getItem(
              "globalFeaturesDisableSubscribeBanner",
            ) as string,
          ),
        ),
      );
    }
  }, []);

  // useEffect(() => {
  // 	if (isInView && bannerEnabled) {
  // 		console.log("starttt", bannerVisible, isInView);
  // 		setBannerVisible(true);
  // 	}
  // }, [isInView, bannerEnabled]);

  useEffect(() => {
    if (bannerEnabled === false) {
      controls.start("hidden");
      return;
    }

    if (isInView) {
      controls.start("visible");
    }
    // else {
    // 	controls.start("hidden");
    // }
  }, [isInView, bannerEnabled, controls]);

  return (
    <div
      id="contacts"
      className={cn("section px-0! pb-0!", styles.contacts)}
      data-section="contacts"
    >
      <section>
        <div className="container">
          <div className="p-0!">
            <h2>Есть идеи для проекта?</h2>
            <h3 className="mt-5 mb-10 md:block hidden">
              Оставьте свои контакты и мы с вами свяжемся
            </h3>
            <h4 className="mt-5 mb-10 md:hidden block">
              Оставьте свои контакты и мы с вами свяжемся
            </h4>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={"light"} ref={mainBtnRef}>
                  Обсудить проект
                </Button>
              </DialogTrigger>
              <DialogContent>
                <ContactForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <motion.div
          variants={bannerVariants}
          initial="hidden"
          animate={controls}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            overflow: "hidden",
            willChange: "height, opacity, transform", // помогает плавности
          }}
          className="my-5"
        >
          <div className="py-5 md:py-6">
            <Banner
              variant="primary"
              // className="mt-5 md:mt-15"
              onClose={() => {
                setBannerEnabled(false);
                localStorage.setItem(
                  "globalFeaturesDisableSubscribeBanner",
                  "1",
                );
              }}
              content={
                <div className="flex flex-wrap gap-5 items-center justify-between w-full">
                  <h4>Подпишись на телеграмм-канал с новыми кейсами</h4>
                  <a
                    href="https://t.me/viktor_it_life"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="light_icon">
                      <TelegramIcon /> Подписаться
                    </Button>
                  </a>
                </div>
              }
            />
          </div>
        </motion.div>
      </section>
      <footer className="section flex flex-col gap-5 md:pb-10! pb-5! pt-5!">
        <div className="container">
          <div className="w-full flex flex-col md:flex-row flex-wrap md:items-center items-baseline justify-between gap-5 mb-5">
            <Logo />
            <ul className="flex flex-wrap gap-5">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link to={item.route}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4 py-5 border-y border-[var(--border)]">
            <h4>
              <a href="tel:79511534777">+7 951 153-47-77</a>
            </h4>

            <h4>
              <a href="mailto:info@it-up.org">info@it-up.org</a>
            </h4>
          </div>
          <div className="w-full flex md:flex-row flex-col md:items-center justify-between py-5 gap-5">
            <div className="flex md:flex-row flex-col gap-5">
              <p className="sm">
                <a href="/documents/privacy-policy" target="_blank">
                  <span>Политика обработки персональных данных</span>
                </a>
              </p>
              {/* <p className="sm">
								<a href="/documents/privacy-policy" target="_blank">
									<span>Политика конфиденциальности</span>
								</a>
							</p> */}
            </div>
            <p className="sm">
              <span>© 2025 STORY DUNGEONS</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
