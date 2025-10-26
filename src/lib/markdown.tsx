import type { Element, Node, Root, Text } from "hast";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import type { JSX, JSXElement } from "solid-js";
import { Fragment } from "solid-js/h/jsx-runtime";
import { unified } from "unified";
import { inspect } from "unist-util-inspect";

export function parseMarkdown(content: string): Root {
	const processor = unified().use(remarkParse).use(remarkGfm).use(remarkRehype);

	const root = processor.parse(content) as Root;
	console.log(inspect(root));
	return root;
}

export function renderTree(node: Root | Element | Text): JSX.Element {
	console.log(node);
	if (node.type === "text") {
		return node.value;
	}

	let render: ({ children }) => JSX.Element;

	// Define current node https://github.com/syntax-tree/hast
	if (node.type === "root") {
		render = ({ children }) => <div>{children}</div>;
	} else {
		switch (node.tagName) {
			case "paragraph":
				render = ({ children }) => <p {...node.properties}>{children}</p>;
				break;
			case "emphasis":
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

	const children = node.children.map((child) => renderTree(child));
	return render({ children });
}
