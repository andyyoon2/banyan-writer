import type { BanyanNode } from "../data/tree";
import { useBanyanContext } from "./BanyanContext";
import { Button } from "./Button";
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

				<Button onClick={handleAddChildNode}>Add child node</Button>
			</div>

			<div class="flex flex-col gap-4">
				{props.node.children.map((child) => (
					<DocumentNode node={child} />
				))}
			</div>
		</div>
	);
}
