import { BanyanNode } from "../data/tree";
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
    <div>
      <NodeEditor content={props.node.content} onInput={handleInput} />
      {props.node.children.map((child) => (
        <DocumentNode node={child} />
      ))}
    </div>
  );
}
