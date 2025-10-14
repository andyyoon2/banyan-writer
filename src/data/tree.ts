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
