import { IOwnProduct, productTagsTranslated } from "@/entities/product";
import { cn } from "@/shared/lib/css";

import MainLayout from "./MainLayout";
import styles from "./layout.module.scss";
import Button from "../button/button";

interface ProductLandingLayoutProps {
	product: IOwnProduct;
	children: React.ReactNode;
}

const ProductLandingLayout: React.FC<ProductLandingLayoutProps> = ({ product, children }) => {
	const { title, tags, days_free_included, external_product_url, image_source } = product;
	return (
		<MainLayout className={styles.productLanding}>
			<div className={styles.header}>
				<div className="container mx-auto">
					<div className="flex flex-wrap md:gap-10 gap-5 mb-6">
						<span className={cn("sm", styles.tag)}>Собственный продукт</span>
						{tags.map((tag) => (
							<span key={tag} className={cn("sm", styles.tag)}>
								{productTagsTranslated[tag] ?? ""}
							</span>
						))}
					</div>
					<div className="flex flex-col gap-5">
						<div className="flex md:flex-nowrap flex-wrap gap-5 items-center">
							<img className="size-25" src={image_source ?? ""} alt={title} />
							<h1>{title}</h1>
						</div>
						<div className="flex items-center flex-wrap gap-5 md:pl-29">
							<a href={external_product_url ?? ""} target="_blank">
								<Button variant={"light"}>Купить в маркетплейсе</Button>
							</a>
							{/* <Button variant={"link_light"}>Доступна пробная версия {days_free_included} дня</Button> */}
							<span className="text-primary font-semibold">Доступна пробная версия {days_free_included} дня</span>
						</div>
					</div>
				</div>
			</div>
			<div className="bg-light">{children}</div>
		</MainLayout>
	);
};

export default ProductLandingLayout;
