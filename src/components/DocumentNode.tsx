import { BanyanNode } from "../data/tree";
import { NodeEditor } from "./NodeEditor";

interface DocumentNodeProps {
  node: BanyanNode;
}

export function DocumentNode(props: DocumentNodeProps) {
  return (
    <div>
      <NodeEditor content={props.node.content} />
      {props.node.children.map((child) => (
        <DocumentNode node={child} />
      ))}
    </div>
  );
}
