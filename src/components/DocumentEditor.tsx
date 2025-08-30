import { createSignal } from 'solid-js';
import { BanyanDocument } from '../data/tree';
import { DocumentNode } from './DocumentNode';

interface DocumentEditorProps {
  document: BanyanDocument;
}

export const DocumentEditor = (props: DocumentEditorProps) => {
  const [content, setContent] = createSignal('');

  return (
    <div>
      {props.document.root.children.map((node) => (
        <DocumentNode node={node} />
      ))}
    </div>
  );
};
