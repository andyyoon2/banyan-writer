import { v4 as uuidv4 } from "uuid";

export interface BanyanDocument {
	id: string;
	title: string;
	createdAt: string;
	updatedAt: string;
	root: BanyanNode;
}

export interface BanyanNode {
	id: string;
	content: string;
	children: BanyanNode[];
}

export function createBanyanNode(content?: string): BanyanNode {
	return {
		id: uuidv4(),
		content: content ?? "",
		children: [],
	};
}

export function createBanyanDocument(props?: {
	root?: BanyanNode;
	title?: string;
}): BanyanDocument {
	const root = props?.root ?? createBanyanNode();
	const title = props?.title ?? "";
	return {
		id: uuidv4(),
		title,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		root,
	};
}
