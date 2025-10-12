import type { BanyanNode } from "../data/tree";
import { useBanyanContext } from "./BanyanContext";
import { NodeEditor } from "./NodeEditor";

interface DocumentNodeProps {
	node: BanyanNode;
}

export function DocumentNode(props: DocumentNodeProps) {
	const { handleNodeChange, addChildNode } = useBanyanContext();

	const handleInput = (event: InputEvent) => {
		const value = (event.currentTarget as HTMLTextAreaElement).value;
		handleNodeChange(props.node.id, value);
	};

	const handleAddChildNode = () => {
		addChildNode(props.node.id);
	};

	return (
		<div class="flex gap-4">
			<div class="flex flex-col gap-4">
				<NodeEditor content={props.node.content} onInput={handleInput} />

				<button
					type="button"
					class="border border-primary-300 dark:border-primary-700 rounded px-4 py-1 cursor-pointer"
					onClick={handleAddChildNode}
				>
					Add child node
				</button>
			</div>

			<div class="flex flex-col gap-4">
				{props.node.children.map((child) => (
					<DocumentNode node={child} />
				))}
			</div>
		</div>
	);
}
