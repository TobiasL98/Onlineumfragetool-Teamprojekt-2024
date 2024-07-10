import { forwardRef } from "react";

export const SurveyError = forwardRef<HTMLDivElement, { text: string }>(
	(props, ref) => {
		return (
			<div
				className="hint ml-5 mt-1 opacity-75"
				style={{ color: "red", display: "none" }}
				ref={ref}
			>
				{props.text}
			</div>
		);
	},
);

SurveyError.displayName = "SurveyError";
