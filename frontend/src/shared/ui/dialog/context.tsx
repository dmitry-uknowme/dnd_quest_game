import { createContext, ReactNode, useContext, useState } from "react";


export interface IDialogContext {
	open: boolean
	onOpenChange: ((open: boolean) => void)
}

export const DialogContext = createContext<IDialogContext | null>(null);

export const DialogContextProvider = ({ defaultValue, children }: { children: ReactNode, defaultValue: Partial<IDialogContext> }) => {
	const [open, setOpen] = useState(false)
	return <DialogContext.Provider value={{ open: defaultValue?.open ?? open, onOpenChange: defaultValue?.onOpenChange ?? setOpen }}>{children}</DialogContext.Provider>
}

export const useDialogContext = () => {
	const ctx = useContext(DialogContext);
	if (!ctx) throw new Error("useDialogContext must be used within <Dialogr>");
	return ctx;
};