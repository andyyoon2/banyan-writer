import { BanyanNode } from '../data/tree';

interface DocumentNodeProps {
  node: BanyanNode;
}

export function DocumentNode(props: DocumentNodeProps) {
  return (
    <div>
      {props.node.content}
      {props.node.children.map((child) => (
        <DocumentNode node={child} />
      ))}
    </div>
  );
}
