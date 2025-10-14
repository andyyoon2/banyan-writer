// Tests which assert that when its public interface is used, BanyanContext transforms the tree in the expected ways

import { renderHook } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";
import {
	type BanyanDocument,
	type BanyanNode,
	createBanyanNode,
} from "../../data/tree";
import {
	type BanyanContextType,
	BanyanProvider,
	type BanyanStore,
	useBanyanContext,
} from "../BanyanContext";

/**
 * Create the banyan context with the given root as the first document.
 * @returns The resulting BanyanContext
 */
function setupBanyanContext(root: BanyanNode): BanyanContextType {
	const initialStore = {
		documents: [{ root } as BanyanDocument],
	} satisfies BanyanStore;

	const { result } = renderHook(() => useBanyanContext(), {
		wrapper: (props) => (
			<BanyanProvider initialStore={initialStore}>
				{props.children}
			</BanyanProvider>
		),
	});
	return result;
}

describe("addChildNode", () => {
	test("adds new child node under the given node", () => {
		const root = createBanyanNode("root");
		const { store, addChildNode } = setupBanyanContext(root);
		expect(store.documents[0].root.children.length).toBe(0);

		addChildNode(root.id);
		expect(store.documents[0].root.children.length).toBe(1);
	});

	test("errors if given invalid parent ID", () => {
		const root = createBanyanNode("root");
		const { addChildNode } = setupBanyanContext(root);

		expect(() => addChildNode("invalid")).toThrowError();
	});
});

describe("handleNodeChange", () => {
	test("updates node content", () => {
		const root = createBanyanNode("root");
		const { store, handleNodeChange } = setupBanyanContext(root);
		// TODO: I shouldn't be testing by indexing documents. Should expose a getter from the context and use that.
		expect(store.documents[0].root.content).toEqual("root");
		handleNodeChange(root.id, "new content");
		expect(store.documents[0].root.content).toEqual("new content");
	});

	test("updates a node's content without affecting its parents", () => {
		const root = createBanyanNode("parent content");
		const child = createBanyanNode("child content");
		root.children.push(child);

		const { store, handleNodeChange } = setupBanyanContext(root);
		expect(store.documents[0].root.children[0].content).toEqual(
			"child content",
		);

		handleNodeChange(child.id, "new child content");
		expect(store.documents[0].root.children[0].content).toEqual(
			"new child content",
		);
		expect(store.documents[0].root.content).toEqual("parent content");
	});
});

describe("moveNode", () => {
	test("handles invalid input", () => {
		const root = createBanyanNode("root");
		const child1 = createBanyanNode("child1");
		const child2 = createBanyanNode("child2");
		root.children.push(child1);
		root.children.push(child2);

		const { store, moveNode } = setupBanyanContext(root);

		const assertNoChange = () => {
			expect(store.documents[0].root).toEqual(root);
			expect(store.documents[0].root.children[0]).toEqual(child1);
			expect(store.documents[0].root.children[1]).toEqual(child2);
		};

		// Empty/invalid inputs should be no-op
		moveNode({
			sourceParentId: "",
			sourceIndex: 0,
			targetParentId: root.id,
			targetIndex: 0,
		});
		assertNoChange();
		moveNode({
			sourceParentId: root.id,
			sourceIndex: 0,
			targetParentId: "",
			targetIndex: 0,
		});
		assertNoChange();
		moveNode({
			sourceParentId: root.id,
			sourceIndex: -1,
			targetParentId: root.id,
			targetIndex: 0,
		});
		assertNoChange();
		moveNode({
			sourceParentId: root.id,
			sourceIndex: 0,
			targetParentId: root.id,
			targetIndex: -1,
		});
		assertNoChange();

		// Node not found should throw
		expect(() =>
			moveNode({
				sourceParentId: "invalid id",
				sourceIndex: 0,
				targetParentId: root.id,
				targetIndex: 0,
			}),
		).toThrow();
		expect(() =>
			moveNode({
				sourceParentId: root.id,
				sourceIndex: 0,
				targetParentId: "invalid id",
				targetIndex: 0,
			}),
		).toThrow();

		// Index out of bounds should throw
		expect(() =>
			moveNode({
				sourceParentId: root.id,
				sourceIndex: root.children.length + 1,
				targetParentId: root.id,
				targetIndex: 0,
			}),
		).toThrow();
		expect(() =>
			moveNode({
				sourceParentId: root.id,
				sourceIndex: 0,
				targetParentId: root.id,
				targetIndex: root.children.length + 1,
			}),
		).toThrow();
	});

	test("moves given node to specified index among siblings", () => {
		const root = createBanyanNode("root");
		const child1 = createBanyanNode("child1");
		const child2 = createBanyanNode("child2");
		root.children.push(child1);
		root.children.push(child2);

		const { store, moveNode } = setupBanyanContext(root);

		// Move first child to index 1
		moveNode({
			sourceParentId: root.id,
			sourceIndex: 0,
			targetParentId: root.id,
			targetIndex: 1,
		});
		expect(store.documents[0].root.children[0]).toEqual(child2);
		expect(store.documents[0].root.children[1]).toEqual(child1);

		// Move index 0 to index 0 (idempotent - nothing should happen)
		moveNode({
			sourceParentId: root.id,
			sourceIndex: 0,
			targetParentId: root.id,
			targetIndex: 0,
		});
		expect(store.documents[0].root.children[0]).toEqual(child2);
		expect(store.documents[0].root.children[1]).toEqual(child1);
	});

	test("moves given node to specified index in new parent", () => {
		const root = createBanyanNode("root");
		const child1 = createBanyanNode("child1");
		const child2 = createBanyanNode("child2");
		const grandchild = createBanyanNode("grandchild");
		child1.children.push(grandchild);
		root.children.push(child1);
		root.children.push(child2);

		const { store, moveNode } = setupBanyanContext(root);

		// Move grandchild from child1 to child2
		moveNode({
			sourceParentId: child1.id,
			sourceIndex: 0,
			targetParentId: child2.id,
			targetIndex: 0,
		});
		expect(store.documents[0].root.children[0].children.length).toBe(0);
		expect(store.documents[0].root.children[1].children.length).toBe(1);
		expect(store.documents[0].root.children[1].children[0]).toEqual(grandchild);
	});

	test("when moving a node, all its children are preserved", () => {
		const root = createBanyanNode("root");
		const child1 = createBanyanNode("child1");
		const child2 = createBanyanNode("child2");
		const grandchild1 = createBanyanNode("grandchild1");
		child1.children.push(grandchild1);
		root.children.push(child1);
		root.children.push(child2);

		const { store, moveNode } = setupBanyanContext(root);

		// Move the child with the grandchild
		moveNode({
			sourceParentId: root.id,
			sourceIndex: 0,
			targetParentId: root.id,
			targetIndex: 1,
		});
		expect(store.documents[0].root.children[1]).toEqual(child1);
		expect(store.documents[0].root.children[1].children[0]).toEqual(
			grandchild1,
		);
	});
});
