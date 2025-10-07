import type { BanyanNode } from "./data/tree";

/** Returns ISO date in human-readable format */
export function formatISODate(dateString: string): string {
	const date = new Date(dateString);
	return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

/** Starting from searchRoot, finds the given node, or null if not found. */
export function findNodeById(
	id: string,
	searchRoot: BanyanNode,
): BanyanNode | null {
	if (!searchRoot) {
		return null;
	}
	if (searchRoot.id === id) {
		return searchRoot;
	}
	return searchRoot.children.find((child) => findNodeById(id, child));
}
