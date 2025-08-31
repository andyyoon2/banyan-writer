import { createSignal } from "solid-js";
import { DocumentNode } from "./DocumentNode";

interface NodeEditorProps {
  content: string;
}

export const NodeEditor = (props: NodeEditorProps) => {
  return (
    <div class="bg-amber-50 w-lg p-2 font-mono">
      {props.content}
      <textarea value={props.content} />
    </div>
  );
};
