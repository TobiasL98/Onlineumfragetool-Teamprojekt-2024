import { FormProvider } from "../FormContext";

export default function Layout({ children }: { children: React.ReactNode }) {
	return <FormProvider>{children}</FormProvider>;
}
