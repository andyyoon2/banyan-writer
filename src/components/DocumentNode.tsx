import type { JSXElement } from "solid-js";
import type { BanyanNode } from "../data/tree";
import { useBanyanContext } from "./BanyanContext";
import { Button } from "./Button";
import { NodeEditor } from "./NodeEditor";

type Direction = "up" | "down" | "left" | "right";

interface DocumentNodeProps {
	node: BanyanNode;
	parentId: string | null;
	parentIndex: number | null;
	nodeAndSiblingIds: string[];
	children?: JSXElement;
}

export function DocumentNode(props: DocumentNodeProps) {
	const { handleNodeChange, addChildNode, deleteNode, moveNode } =
		useBanyanContext();

	const handleInput = (event: InputEvent) => {
		const value = (event.currentTarget as HTMLTextAreaElement).value;
		handleNodeChange(props.node.id, value);
	};

	const handleAddChildNode = () => {
		addChildNode(props.node.id);
	};

	const handleDeleteChildNode = (index: number) => {
		deleteNode({ parentId: props.node.id, index });
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
				if (!props.parentId || props.parentIndex === null) {
					return;
				}
				return moveNode({
					sourceParentId: props.node.id,
					sourceIndex: nodeIndex,
					targetParentId: props.parentId,
					targetIndex: props.parentIndex + 1,
				});
			// Wrap in a block to prevent the `indexWithinParent` var being accessible to other switch clauses
			// Thanks biome!
			case "right": {
				if (props.node.children.length <= 1) {
					return;
				}
				// Move the given child node to be a child of its previous sibling.
				// If node is the first sibling, then move to its next sibling instead.
				if (nodeIndex === 0) {
					return moveNode({
						sourceParentId: props.node.id,
						sourceIndex: nodeIndex,
						targetParentId: props.node.children[nodeIndex + 1].id,
						targetIndex: 0,
					});
				}
				return moveNode({
					sourceParentId: props.node.id,
					sourceIndex: nodeIndex,
					targetParentId: props.node.children[nodeIndex - 1].id,
					targetIndex: 0,
				});
			}
			default:
				throw new Error("unreachable");
		}
	};

	return (
		<div class="flex items-start gap-4">
			<div class="flex flex-col shrink-0 gap-4 bg-primary-300 dark:bg-primary-700 w-lg p-4 rounded">
				<NodeEditor content={props.node.content} onInput={handleInput} />
				<div class="flex gap-2">
					{props.children}
					<Button onClick={handleAddChildNode}>+ New child</Button>
				</div>
			</div>

			<div class="flex flex-col gap-4">
				{props.node.children.map((child, index) => (
					<DocumentNode
						node={child}
						parentId={props.node.id}
						parentIndex={index}
						nodeAndSiblingIds={props.node.children.map((child) => child.id)}
					>
						<Button
							onClick={() => handleMoveChildNode("up", index)}
							disabled={index <= 0}
						>
							↑
						</Button>
						<Button
							onClick={() => handleMoveChildNode("down", index)}
							disabled={index >= props.node.children.length - 1}
						>
							↓
						</Button>
						<Button
							onClick={() => handleMoveChildNode("left", index)}
							disabled={props.parentIndex === null}
						>
							←
						</Button>
						<Button
							onClick={() => handleMoveChildNode("right", index)}
							disabled={props.node.children.length <= 1}
						>
							→
						</Button>
						<Button onClick={() => handleDeleteChildNode(index)}>Delete</Button>
					</DocumentNode>
				))}
			</div>
		</div>
	);
}
