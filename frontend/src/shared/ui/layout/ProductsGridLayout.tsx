import { act, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MainLayout from "./MainLayout";
import Loader from "../loader/loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs/tabs";
import { cn } from "@/shared/lib/css";
import useMatchBreakpoint, { BREAKPOINTS } from "@/shared/lib/hooks/useMatchBreakpoint";
import { useQuery } from "@tanstack/react-query";
import { IProduct } from "@/entities/product/model/types";
import PdfDownloadButton from "../button/compose/PdfDownloadButton";
import Button from "../button/button";
import { ChevronDown } from "lucide-react";
import ProductCard from "@/entities/product/ui/ProductCard";
import { CaseCard } from "@/entities/case";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ScrollArea } from "../scroll-area";

interface ProductsGridLayoutProps<TData extends IProduct> {
	title: string;
	filterTags: { value: string; label: string }[];
	fetchData: (tag: string) => Promise<TData[]>;
	dataKey: string;
	productType: "ownProduct" | "case";
	productsDescription: React.ReactNode;
}

const PRODUCTS_PER_PAGE = 6;

const getGridProductsCoordinates = (gridWidth: number, productExample: HTMLDivElement, products: IProduct[]) => {
	let leftHeight = 160;
	let rightHeight = 0;

	const productsCoordinates: { product: IProduct; x: number; y: number }[] = [];
	const productStyles = getComputedStyle(productExample);
	const productWidth = parseFloat(productStyles.width);
	const productHeight = parseFloat(productStyles.height);

	const xGap = gridWidth - productWidth * 2;
	const yGap = xGap;
	const rightColumnStart = productWidth + xGap;

	products.forEach((product, index) => {
		if (index % 2 !== 0) {
			productsCoordinates.push({
				product,
				x: 0,
				y: Math.min(leftHeight, rightHeight),
			});
			leftHeight += productHeight + yGap;
		} else {
			productsCoordinates.push({
				product,
				x: rightColumnStart,
				y: Math.min(leftHeight, rightHeight),
			});
			rightHeight += productHeight + yGap;
		}
	});

	return { coordinates: productsCoordinates, gridHeight: Math.max(leftHeight, rightHeight) };
};

const ProductsGridLayout = <TData extends IProduct>({
	title,
	filterTags,
	productType,
	productsDescription,
	dataKey,
	fetchData,
}: ProductsGridLayoutProps<TData>) => {
	const productExampleRef = useRef<HTMLDivElement>(null);
	const gridRef = useRef<HTMLDivElement>(null);
	const [activeTab, setActiveTab] = useState(filterTags[0].value);
	const [productsCoordinates, setProductsCoordinates] = useState<{
		coordinates: { product: IProduct; x: number; y: number }[];
		gridHeight: number;
	}>({ coordinates: [], gridHeight: 0 });

	const [allProducts, setAllProducts] = useState<IProduct[] | null>(null);
	const [displayedProducts, setDisplayedProducts] = useState<IProduct[] | null>(null);

	const [page, setPage] = useState(1);
	const isMobile = useMatchBreakpoint(BREAKPOINTS.mobile);
	const isDesktop = useMatchBreakpoint(BREAKPOINTS.desktop);

	const { data, isFetching } = useQuery({
		queryKey: [dataKey, page],
		queryFn: async () => {
			const data = await fetchData("all");
			return data;
		},
		// enabled:
		// 	!allProducts?.length ||
		// 	activeTab === "all" ||
		// 	!allProducts.filter((product) => product.tags.includes(activeTab)).length,
	});

	useEffect(() => {
		if (!data?.length) {
			return;
		}

		if (activeTab === "all") {
			setAllProducts(data);
		} else {
			setAllProducts((prev) => {
				if (prev?.length) {
					return [...prev.filter((product) => !data.some((item) => item.name === product.name)), ...data];
				}
				return data;
			});
		}

		const displayedProducts = data?.length
			? data
					.filter((product) => activeTab === "all" || product.tags.includes(activeTab))
					.slice(0, PRODUCTS_PER_PAGE * page)
			: [];
		setDisplayedProducts(displayedProducts);
	}, [data, activeTab]);

	// const canLoadMore = displayedCases.length < data?.length;
	const canLoadMore = false;

	const params = useParams();
	const location = useLocation();
	const navigate = useNavigate();
	const tag = params.tag;

	const onChangeActiveTab = (value: string) => {
		setActiveTab(value);
		const initialRoute = location.pathname.split("/")?.length >= 1 ? location.pathname.split("/")[1] : "";
		if (value !== "all") {
			navigate(`/${initialRoute}/${value}`, { replace: true });
		} else {
			navigate(`/${initialRoute}`, { replace: true });
		}
	};

	useEffect(() => {
		if (!isDesktop) return;
		if (typeof window === "undefined" || !productExampleRef.current || !gridRef.current) return;
		if (allProducts) {
			// const displayed = data.slice(0, PRODUCTS_PER_PAGE * page);

			const displayedProducts = allProducts?.length
				? allProducts
						.filter((product) => activeTab === "all" || product.tags.includes(activeTab))
						.slice(0, PRODUCTS_PER_PAGE * page)
				: [];
			setDisplayedProducts(displayedProducts);
			const result = getGridProductsCoordinates(
				gridRef.current.clientWidth,
				productExampleRef.current,
				displayedProducts
			);
			setProductsCoordinates((prev) => {
				// if (JSON.stringify(prev.coordinates) === JSON.stringify(result.coordinates) && prev.coordinates.length) {
				// 	return prev;
				// }
				return result;
			});
		}
	}, [allProducts, page, activeTab, isDesktop]);

	useEffect(() => {
		if (typeof window === "undefined") return;

		const handleResize = () => {
			requestAnimationFrame(() => {
				if (gridRef.current && productExampleRef.current) {
					const displayedProducts = allProducts?.length
						? allProducts.filter((product) => product.tags.includes(activeTab)).slice(0, PRODUCTS_PER_PAGE * page)
						: [];
					setDisplayedProducts(displayedProducts);
					const result = getGridProductsCoordinates(
						gridRef.current.clientWidth,
						productExampleRef.current,
						displayedProducts
					);
					setProductsCoordinates((prev) => {
						// if (JSON.stringify(prev.coordinates) === JSON.stringify(result.coordinates) && prev.coordinates.length) {
						// 	return prev;
						// }
						return result;
					});
				}
			});
		};

		if (isDesktop) {
			window.addEventListener("resize", handleResize);
		} else {
			window.removeEventListener("resize", handleResize);
		}

		return () => window.removeEventListener("resize", handleResize);
	}, [data, page, activeTab, isDesktop]);

	useEffect(() => {
		if (tag) {
			setActiveTab(tag);
		}
	}, [tag]);

	console.log({ displayedProducts, productsCoordinates });

	return (
		<MainLayout>
			<section id="productsGrid" className="section pb-4!">
				<div className="container min-h-screen flex flex-col">
					<h2 className="shrink-0">{title}</h2>
					<Tabs value={activeTab} onValueChange={onChangeActiveTab} className="flex flex-col">
						{isMobile ? (
							<ScrollArea orientation="horizontal">
								<TabsList className="my-5 shrink-0 sticky top-0 z-20 bg-background md:flex-wrap flex-nowrap lg:pb-0 pb-0 overflow-hidden">
									{filterTags.map((tag) => (
										<TabsTrigger key={tag.value} value={tag.value}>
											{tag.label}
										</TabsTrigger>
									))}
								</TabsList>
							</ScrollArea>
						) : (
							<TabsList className="my-5 shrink-0 sticky top-0 z-20 bg-background md:flex-wrap flex-nowrap md:overflow-x-hidden lg:pb-0 pb-2 overflow-x-auto">
								{filterTags.map((tag) => (
									<TabsTrigger key={tag.value} value={tag.value}>
										{tag.label}
									</TabsTrigger>
								))}
							</TabsList>
						)}

						{allProducts?.length ? (
							<div ref={productExampleRef} className="absolute z-[-10]">
								{productType === "ownProduct" ? (
									<ProductCard product={allProducts[0]} onTagClick={onChangeActiveTab} />
								) : productType === "case" ? (
									<CaseCard caseCard={allProducts[0]} variant={"casesGrid"} onTagClick={onChangeActiveTab} />
								) : null}
							</div>
						) : null}

						<div className="flex-1 min-h-0">
							{filterTags.map((tag) => (
								<TabsContent key={tag.value} value={tag.value}>
									<div
										ref={gridRef}
										className="relative"
										style={{ minHeight: isMobile ? "auto" : `${productsCoordinates.gridHeight || 500}px` }}
									>
										<AnimatePresence mode="wait">
											{isFetching ? (
												<motion.div
													key="loader"
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													exit={{ opacity: 0 }}
													className="absolute inset-0 flex justify-center items-start pt-20"
												>
													<Loader />
												</motion.div>
											) : (
												<motion.div
													key="grid"
													layout
													className={cn("flex flex-wrap justify-between gap-10 lg:pt-40 relative")}
													style={{ height: !isDesktop ? "auto" : `${productsCoordinates.gridHeight}px` }}
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													transition={{ duration: 0.3 }}
												>
													<div className="flex flex-col gap-5 relative lg:absolute top-0 left-0 md:w-full lg:w-[30rem] xl:w-[36rem]">
														{productsDescription}
													</div>
													<AnimatePresence>
														{!isDesktop && displayedProducts?.length
															? displayedProducts.map((productItem, index) => (
																	<motion.div
																		key={productItem.image_source}
																		initial={{ opacity: 0, y: 10 }}
																		animate={{ opacity: 1, y: 0 }}
																		exit={{ opacity: 0, y: -10 }}
																		layout
																		style={{
																			position: "relative",
																			top:
																				isDesktop && displayedProducts.length > 1 && index % 2 !== 0 ? "-10rem" : "0",
																		}}
																	>
																		{index === 0 && isDesktop ? (
																			<div className="flex flex-col gap-5 relative lg:absolute md:top-[-10rem] left-0">
																				{productsDescription}
																			</div>
																		) : null}

																		{productType === "ownProduct" ? (
																			<ProductCard product={productItem} onTagClick={onChangeActiveTab} />
																		) : productType === "case" ? (
																			<CaseCard
																				caseCard={productItem}
																				variant={"default"}
																				onTagClick={onChangeActiveTab}
																			/>
																		) : null}
																	</motion.div>
															  ))
															: isDesktop && productsCoordinates.coordinates?.length
															? productsCoordinates?.coordinates?.map((coordinate, index) => (
																	<motion.div
																		key={coordinate.product?.name || index}
																		className="absolute"
																		style={{
																			top: `${coordinate.y}px`,
																			left: `${coordinate.x}px`,
																		}}
																		initial={{ opacity: 0, y: 50 }}
																		animate={{ opacity: 1, y: 0 }}
																		transition={{
																			duration: 0.6,
																			ease: [0.22, 1, 0.36, 1], // easeOutQuint
																			delay: index * 0.05,
																		}}
																	>
																		{productType === "ownProduct" ? (
																			<ProductCard product={coordinate.product} onTagClick={onChangeActiveTab} />
																		) : productType === "case" ? (
																			<CaseCard
																				caseCard={coordinate.product}
																				variant={"casesGrid"}
																				onTagClick={onChangeActiveTab}
																			/>
																		) : null}
																	</motion.div>
															  ))
															: null}
													</AnimatePresence>
												</motion.div>
											)}
										</AnimatePresence>
									</div>
									{!isFetching && canLoadMore && (
										<div
											className={cn(
												"flex justify-center mt-8",
												displayedProducts.length / 2 !== 0 ? "justify-start" : "justify-end"
											)}
										>
											<Button
												variant={"primary"}
												className="h-8! rounded-sm!"
												onClick={() => setPage((state) => state + 1)}
											>
												Показать еще <ChevronDown />
											</Button>
										</div>
									)}
								</TabsContent>
							))}
						</div>
					</Tabs>
				</div>
			</section>
		</MainLayout>
	);
};

export default ProductsGridLayout;
