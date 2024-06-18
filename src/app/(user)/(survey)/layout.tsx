import { FormProvider } from "./FormContext";

export default function SurveyLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <FormProvider>{children}</FormProvider>;
}
