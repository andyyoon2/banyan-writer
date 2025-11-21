import { createResource, Show, Suspense } from "solid-js";
import { parseMarkdown, renderTree } from "../lib/markdown";

interface NodeEditorProps {
	content: string;
	onInput: (event: InputEvent) => void;
}

async function renderMarkdownContent(content: string) {
	const root = await parseMarkdown(content);
	return renderTree(root);
}

export const NodeEditor = (props: NodeEditorProps) => {
	const [jsxTree] = createResource(() => props.content, renderMarkdownContent);

	return (
    <div class="flex flex-col gap-4">
      <Show when={jsxTree.error}>Error: {jsxTree.error}</Show>
      <Suspense>
        <div class="[&_ul]:list-disc [&_ol]:list-decimal [&_ul,&_ol]:pl-4 [&_li]:pl-2">
          {jsxTree()}
        </div>
      </Suspense>
      <textarea
        value={props.content}
        onInput={props.onInput}
        class="border border-primary-400 dark:border-primary-600 rounded p-2 focus:outline-none focus:ring-1"
      />
    </div>
  );
};
