import type { Element, Root, Text } from "hast";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import type { JSX } from "solid-js";
import { unified } from "unified";

// Uncomment if needed for debugging
// import { inspect } from "unist-util-inspect";

export async function parseMarkdown(content: string): Promise<Root> {
	const processor = unified().use(remarkParse).use(remarkGfm).use(remarkRehype);

	let root = processor.parse(content);
	// @ts-expect-error - remarkRehype transforms mdast to hast
	root = (await processor.run(root)) as Root;
	// console.log(inspect(root));
	// @ts-expect-error - remarkRehype transforms mdast to hast
	return root;
}

export function renderTree(node: Root | Element | Text): JSX.Element {
	if (node.type === "text") {
		return node.value;
	}

	let render: ({ children }) => JSX.Element;

	// Define current node https://github.com/syntax-tree/hast
	if (node.type === "root") {
		render = ({ children }) => <>{children}</>;
	} else {
		// TODO: Might be a better way to map string -> JSX Tag
		switch (node.tagName) {
			case "p":
				render = ({ children }) => <p {...node.properties}>{children}</p>;
				break;
			case "em":
				render = ({ children }) => <em {...node.properties}>{children}</em>;
				break;
			case "strong":
				render = ({ children }) => (
					<strong {...node.properties}>{children}</strong>
				);
				break;
			case "a":
				render = ({ children }) => <a {...node.properties}>{children}</a>;
				break;
			case "ul":
				render = ({ children }) => <ul {...node.properties}>{children}</ul>;
				break;
			case "ol":
				render = ({ children }) => <ol {...node.properties}>{children}</ol>;
				break;
			case "li":
				render = ({ children }) => <li {...node.properties}>{children}</li>;
				break;
			case "h1":
				render = ({ children }) => <h1 {...node.properties}>{children}</h1>;
				break;
			case "h2":
				render = ({ children }) => <h2 {...node.properties}>{children}</h2>;
				break;
			case "h3":
				render = ({ children }) => <h3 {...node.properties}>{children}</h3>;
				break;
			case "h4":
				render = ({ children }) => <h4 {...node.properties}>{children}</h4>;
				break;
			case "h5":
				render = ({ children }) => <h5 {...node.properties}>{children}</h5>;
				break;
			case "h6":
				render = ({ children }) => <h6 {...node.properties}>{children}</h6>;
				break;
			default:
				render = ({ children }) => <div {...node.properties}>{children}</div>;
		}
	}

	const children = (node.children ?? []).map((child) => renderTree(child));
	const result = render({ children });
	return result;
}
