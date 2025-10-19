import { createEffect } from "solid-js";
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
		<div class="flex gap-4">
			{/* Debug */}
			{/*<pre class="whitespace-pre-wrap text-sm w-80">
				I am node {props.node.id}
				<br />
				Me and my siblings {JSON.stringify(props.nodeAndSiblingIds)}
				<br />
				My children{" "}
				{JSON.stringify(props.node.children.map((child) => child.id))}
			</pre>*/}

			<div class="flex flex-col gap-4">
				<NodeEditor content={props.node.content} onInput={handleInput} />

				<Button onClick={handleAddChildNode}>Add child node</Button>
			</div>

			<div class="flex flex-col gap-4">
				{props.node.children.map((child, index) => (
					<div class="flex">
						<DocumentNode
							node={child}
							parentId={props.node.id}
							parentIndex={index}
							nodeAndSiblingIds={props.node.children.map((child) => child.id)}
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
							<Button
								onClick={() => handleMoveChildNode("left", index)}
								disabled={props.parentIndex === null}
							>
								Left
							</Button>
							<Button
								onClick={() => handleMoveChildNode("right", index)}
								disabled={props.node.children.length <= 1}
							>
								Right
							</Button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
