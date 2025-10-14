import type { JSXElement } from "solid-js";

interface ButtonProps {
	children: JSXElement;
	class?: string;
	type?: "button" | "submit" | "reset";
	onClick: () => void;
}

export function Button(props: ButtonProps) {
	return (
		<button
			type={props.type || "button"}
			class={`${props.class || ""} border border-primary-300 dark:border-primary-700 rounded px-4 py-1 cursor-pointer`}
			onClick={props.onClick}
		>
			{props.children}
		</button>
	);
}
