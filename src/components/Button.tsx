import type { JSXElement } from "solid-js";
import type { JSX } from "solid-js/h/jsx-runtime";

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	children: JSXElement;
	class?: string;
	type?: "button" | "submit" | "reset";
	onClick: () => void;
}

export function Button(props: ButtonProps) {
	return (
		<button
			{...props}
			type={props.type || "button"}
			class={`${props.class || ""} border border-primary-300 dark:border-primary-700 rounded px-4 py-1 cursor-pointer disabled:bg-primary-200 dark:disabled:bg-primary-800 disabled:cursor-not-allowed`}
			onClick={props.onClick}
		>
			{props.children}
		</button>
	);
}
