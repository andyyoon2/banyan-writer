// Tests which assert that when its public interface is used, BanyanContext transforms the tree in the expected ways

import { renderHook } from "@solidjs/testing-library";
import { expect, test } from "vitest";
import { type BanyanDocument, createBanyanNode } from "../../data/tree";
import {
	BanyanProvider,
	type BanyanStore,
	useBanyanContext,
} from "../BanyanContext";

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
