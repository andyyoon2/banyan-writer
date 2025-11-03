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
      class={`${
        props.class || ""
      } border border-primary-400 dark:border-primary-600 rounded px-4 py-1 cursor-pointer bg-primary-200 dark:bg-primary-800 disabled:bg-primary-300 dark:disabled:bg-primary-700 disabled:cursor-not-allowed`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
