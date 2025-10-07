interface NodeEditorProps {
	content: string;
	onInput: (event: InputEvent) => void;
}

export const NodeEditor = (props: NodeEditorProps) => {
	return (
		<div class="bg-amber-50 w-lg p-2 font-mono">
			{props.content}
			<textarea value={props.content} onInput={props.onInput} />
		</div>
	);
};
