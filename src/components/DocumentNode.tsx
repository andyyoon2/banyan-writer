import type { BanyanNode } from "../data/tree";
import { useBanyanContext } from "./BanyanContext";
import { NodeEditor } from "./NodeEditor";

interface DocumentNodeProps {
	node: BanyanNode;
}

export function DocumentNode(props: DocumentNodeProps) {
	const { handleNodeChange } = useBanyanContext();

	const handleInput = (event: InputEvent) => {
		const value = (event.currentTarget as HTMLTextAreaElement).value;
		handleNodeChange(props.node.id, value);
	};

	return (
		<div class="flex flex-col gap-4">
			<p>{props.node.id}</p>

			<NodeEditor content={props.node.content} onInput={handleInput} />

			{props.node.children.map((child) => (
				<DocumentNode node={child} />
			))}

			<button
				type="button"
				class="border border-neutral-300 rounded px-4 py-1 cursor-pointer"
				onClick={handleAddChildNode}
			>
				Add child node
			</button>
		</div>
	);
}
