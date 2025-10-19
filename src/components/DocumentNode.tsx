import type { BanyanNode } from "../data/tree";
import { useBanyanContext } from "./BanyanContext";
import { Button } from "./Button";
import { NodeEditor } from "./NodeEditor";

type Direction = "up" | "down" | "left" | "right";

interface DocumentNodeProps {
	node: BanyanNode;
	onMoveNode: (direction: Direction) => void;
}

export function DocumentNode(props: DocumentNodeProps) {
	const { handleNodeChange, addChildNode, moveNode } = useBanyanContext();

	const handleInput = (event: InputEvent) => {
		const value = (event.currentTarget as HTMLTextAreaElement).value;
		handleNodeChange(props.node.id, value);
	};

	const handleAddChildNode = () => {
		addChildNode(props.node.id);
	};

	const handleMoveChildNode = (direction: Direction, nodeIndex: number) => {
		switch (direction) {
			case "up":
				if (nodeIndex <= 0) {
					return;
				}
				return moveNode({
					sourceParentId: props.node.id,
					sourceIndex: nodeIndex,
					targetParentId: props.node.id,
					targetIndex: nodeIndex - 1,
				});
			case "down":
				if (nodeIndex >= props.node.children.length - 1) {
					return;
				}
				return moveNode({
					sourceParentId: props.node.id,
					sourceIndex: nodeIndex,
					targetParentId: props.node.id,
					targetIndex: nodeIndex + 1,
				});
			case "left":
			case "right":
			default:
				throw new Error("unreachable");
		}
	};

	return (
		<div class="flex gap-4">
			<div class="flex flex-col gap-4">
				<NodeEditor content={props.node.content} onInput={handleInput} />

				<Button onClick={handleAddChildNode}>Add child node</Button>
			</div>

			<div class="flex flex-col gap-4">
				{props.node.children.map((child, index) => (
					<div class="flex">
						<DocumentNode
							node={child}
							onMoveNode={(direction) => handleMoveChildNode(direction, index)}
						/>
						<div class="flex flex-col gap-2">
							<Button
								onClick={() => handleMoveChildNode("up", index)}
								disabled={index <= 0}
							>
								Up
							</Button>
							<Button
								onClick={() => handleMoveChildNode("down", index)}
								disabled={index >= props.node.children.length - 1}
							>
								Down
							</Button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
