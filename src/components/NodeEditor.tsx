import { createEffect } from "solid-js";
import { parseMarkdown, renderTree } from "../lib/markdown";

interface NodeEditorProps {
	content: string;
	onInput: (event: InputEvent) => void;
}

export const NodeEditor = (props: NodeEditorProps) => {
	// createEffect(() => {
	// 	const root = parseMarkdown(props.content);
	// 	// renderTree(root)
	// })

	return (
		<div class="bg-primary-300 dark:bg-primary-700 w-lg p-4 font-mono flex flex-col gap-4">
			{renderTree(parseMarkdown(props.content))}
			<textarea value={props.content} onInput={props.onInput} />
			{/* <div>{props.content}</div> */}
		</div>
	);
};
