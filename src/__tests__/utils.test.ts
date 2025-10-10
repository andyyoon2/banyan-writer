import { describe, expect, test } from "vitest";
import { createBanyanNode } from "../data/tree";
import { findNodeById } from "../utils";

describe("findNodeById", () => {
	test("finds the correct grandchild node", () => {
		const root = createBanyanNode("root");
		const child = createBanyanNode("child");
		const grandchild = createBanyanNode("grandchild");
		root.children.push(child);
		child.children.push(grandchild);
		expect(findNodeById(grandchild.id, root)).toBe(grandchild);
	});
});
