// Tests which assert that when its public interface is used, BanyanContext transforms the tree in the expected ways

import { renderHook } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";
import { type BanyanDocument, createBanyanNode } from "../../data/tree";
import {
	BanyanProvider,
	type BanyanStore,
	useBanyanContext,
} from "../BanyanContext";

describe("addChildNode", () => {
	test("adds new child node under the given node", () => {
		const root = createBanyanNode("root");
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

		const { store, addChildNode } = result;
		expect(store.documents[0].root.children.length).toBe(0);

		addChildNode(root.id);
		expect(store.documents[0].root.children.length).toBe(1);
	});

	test("errors if given invalid parent ID", () => {
		const root = createBanyanNode("root");
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

		const { addChildNode } = result;
		expect(() => addChildNode("invalid")).toThrowError();
	});
});

describe("handleNodeChange", () => {
	test("updates node content", () => {
		const root = createBanyanNode("root");
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

		// TODO: I shouldn't be testing by indexing documents. Should expose a getter from the context and use that.
		const { store, handleNodeChange } = result;
		expect(store.documents[0].root.content).toEqual("root");
		handleNodeChange(root.id, "new content");
		expect(store.documents[0].root.content).toEqual("new content");
	});

	test("updates a node's content without affecting its parents", () => {
		const root = createBanyanNode("parent content");
		const child = createBanyanNode("child content");
		root.children.push(child);

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

		const { store, handleNodeChange } = result;
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
