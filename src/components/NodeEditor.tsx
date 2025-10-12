interface NodeEditorProps {
	content: string;
	onInput: (event: InputEvent) => void;
}

export const NodeEditor = (props: NodeEditorProps) => {
	return (
		<div class="bg-primary-300 dark:bg-primary-700 w-lg p-4 font-mono flex gap-4">
			<textarea value={props.content} onInput={props.onInput} />
			<div>{props.content}</div>
		</div>
	);
};
