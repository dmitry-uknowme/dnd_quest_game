import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/shared/lib/css";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../button/button";
import { Input } from "../input/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../form";
import { useForm } from "react-hook-form";
import { Checkbox } from "../checkbox";
import { DialogContextProvider, useDialogContext } from "./context";
import CloseIcon from "@/assets/images/close-bold-icon.svg?react";
import PhoneInput from "../input/PhoneInput";
import EmailInput from "../input/EmailInput";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Textarea from "../input/textarea";
import { Link } from "react-router-dom";
import Logo from '@/assets/images/logo.svg?react'

interface DialogSidePanelProps {
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
	className?: string;
}

export function DialogSidePanel({ open, onClose, children, className }: DialogSidePanelProps) {
	const hasOpened = React.useRef(false);
	// Глубина сцены — сдвигаем основной контент
	React.useEffect(() => {
		const app = document.getElementById(".app") as HTMLDivElement;
		if (!app) return;

		// const app = document.body

		if (open) {
			hasOpened.current = true;
			document.body.style.overflow = "hidden";

			app.animate(
				{
					transform: ["translateX(0) scale(1)", "translateX(-40px) scale(1)"],
				},
				{
					duration: 350,
					easing: "cubic-bezier(0.4,0,0.2,1)",
					fill: "forwards",
				}
			);
		} else if (hasOpened.current) {
			app.animate(
				{
					transform: ["translateX(-40px) scale(0.98)", "translateX(0) scale(1)"],
				},
				{
					duration: 300,
					easing: "cubic-bezier(0.4,0,0.2,1)",
					fill: "forwards",
				}
			);

			app.focus();

			setTimeout(() => {
				app.style.overflow = "";
			}, 300);
		}
	}, [open]);

	return (
		<AnimatePresence>
			{open && (
				<>
					<DialogOverlay asChild>
						<motion.div
							className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.25 }}
							onClick={onClose}
						/>
					</DialogOverlay>

					{/* Fullscreen panel */}
					<DialogContent>
						<motion.aside
							className={cn("fixed inset-0 z-50 bg-background flex flex-col", className)}
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							transition={{
								duration: 0.45,
								ease: [0.4, 0, 0.2, 1],
							}}
						>
							{/* Close */}
							<button onClick={onClose} className="absolute top-6 right-6 opacity-70 hover:opacity-100 transition">
								<XIcon className="size-6" />
							</button>

							{children}
						</motion.aside>
					</DialogContent>
				</>
			)}
		</AnimatePresence>
	);
}

const container = {
	hidden: {},
	show: {
		transition: {
			staggerChildren: 0.06,
		},
	},
};

const item = {
	hidden: { opacity: 0, y: 14 },
	show: { opacity: 1, y: 0 },
};

// schema.ts

export const contactFormSchema = z.object({
	name: z.string({ message: "Обязательно для заполнения" }).min(1, { message: "Имя обязательно для заполнения" }),
	phone: z
		.string()
		.min(10, { message: "Некорректный номер" })
		.regex(/^\+?\d[\d\s()-]{9,}$/, { message: "Некорректный номер" }),
	email: z.string().email({ message: "Некорректный email" }),
	checkbox: z.boolean().refine((val) => val === true, {
		message: "Необходимо согласие на обработку данных",
	}),
});
export type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactForm() {
	const form = useForm<ContactFormValues>({
		resolver: zodResolver(contactFormSchema),
		defaultValues: {
			name: "",
			phone: "",
			email: "",
			checkbox: false,
		},
	});

	const onSubmit = (data: ContactFormValues) => {
		console.log("Отправка:", data);
	};
	return (
		<motion.div
			className="flex flex-col justify-center items-center gap-6 pt-14"
			variants={container}
			initial="hidden"
			animate="show"
		>
			<motion.div variants={item}>
				{/* <DialogTitle asChild>	<h2 className="text-center">Обсудить проект</h2></DialogTitle> */}
				<h2 className="text-center">Обсудить проект</h2>
				<p className="mt-5 text-center">Расскажите о вашем проекте</p>
			</motion.div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-full md:w-[80%] lg:w-[80%] 2xl:w-[80%] flex flex-col gap-10 mt-10"
				>
					<motion.div variants={item}>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input placeholder="Как к вам обращаться" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</motion.div>
					<motion.div variants={item}>
						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<PhoneInput placeholder="Номер телефона" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</motion.div>
					<motion.div variants={item}>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<EmailInput placeholder="Email" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</motion.div>
					<motion.div variants={item}>
						<FormField
							control={form.control}
							name="details"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										{/* <Input placeholder="Email" {...field} /> */}
										<Textarea placeholder="Детали проекта" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</motion.div>
					<motion.div variants={item} className="w-full md:mt-20 mt-5 flex flex-col items-center gap-5">
						<FormField
							control={form.control}
							name="checkbox"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center gap-2 mb-2">
									<FormControl>
										<Checkbox {...field} />
									</FormControl>
									<FormLabel className="inline">
										Согласен на{" "}
										{/* <Link to="/policy-document">
											<span className="text-primary">обработку персональных данных</span>
										</Link> */}
										<span><a className="text-primary" href="/documents/privacy-policy" target="_blank">
											обработку персональных данных
										</a></span>
									</FormLabel>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button variant={"light"} className="w-full">
							Отправить
						</Button>
					</motion.div>
				</form>
			</Form>
		</motion.div>
	);
}

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
	return (
		<DialogContextProvider defaultValue={{ open: props.open, onOpenChange: props.onOpenChange }}>
			<DialogPrimitive.Root data-slot="dialog" {...props} />
		</DialogContextProvider>
	);
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
	const { onOpenChange } = useDialogContext();

	const onOpen = () => onOpenChange(true);

	return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} onClick={onOpen} />;
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
	return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
	return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
	return (
		<DialogPrimitive.Overlay
			data-slot="dialog-overlay"
			className={cn(
				"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
				className
			)}
			{...props}
		/>
	);
}

function DialogContent({
	className,
	children,
	showLogo = false,
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
	showLogo?: boolean;
}) {
	const { open, onOpenChange } = useDialogContext();

	const onClose = () => onOpenChange(false);

	return (
		<AnimatePresence>
			{open && (
				<DialogPortal forceMount>
					<DialogOverlay />
					<DialogPrimitive.Content asChild>
						<motion.aside
							className={cn("fixed inset-0 z-50 bg-background flex flex-col", className)}
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							transition={{
								duration: 0.45,
								ease: [0.4, 0, 0.2, 1],
							}}
						>

							<div className="container mx-auto h-screen flex flex-col overflow-hidden">
								<div className="flex justify-between items-center w-full">
									{showLogo && <Link to="/">
										<Logo className="lg:hidden block w-17 h-8" /></Link>}
									<button
										onClick={onClose}
										className={cn("lg:absolute relative", "lg:top-8 lg:right-8 top-0 right-0", !showLogo && "absolute top-4 right-4", "transition cursor-pointer")}
									>
										<CloseIcon />
									</button>
								</div>{children}
							</div>


						</motion.aside>
					</DialogPrimitive.Content>
				</DialogPortal>
			)}
		</AnimatePresence>
	);
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="dialog-header"
			className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
			{...props}
		/>
	);
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="dialog-footer"
			className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
			{...props}
		/>
	);
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
	return (
		<DialogPrimitive.Title
			data-slot="dialog-title"
			className={cn("text-lg leading-none font-semibold", className)}
			{...props}
		/>
	);
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
	return (
		<DialogPrimitive.Description
			data-slot="dialog-description"
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	);
}

export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
};
