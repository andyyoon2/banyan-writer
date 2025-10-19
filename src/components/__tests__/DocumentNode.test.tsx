import { render } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { type BanyanDocument, createBanyanNode } from "../../data/tree";
import {
	BanyanProvider,
	type BanyanStore,
	useBanyanContext,
} from "../BanyanContext";
import { DocumentNode } from "../DocumentNode";

test("renders all node content", () => {
	const root = createBanyanNode();
	root.children.push(createBanyanNode("Child Node 1"));
	root.children.push(createBanyanNode("Child Node 2"));

	const { getByText } = render(() => (
		<DocumentNode node={root} onMoveNode={vi.fn()} />
	));
	expect(getByText("Child Node 1")).toBeDefined();
	expect(getByText("Child Node 2")).toBeDefined();
});

test("updates screen with content edits", async () => {
	// Arrange
	const user = userEvent.setup();
	const root = createBanyanNode("Hello");
	const initialStore = {
		documents: [{ root } as BanyanDocument],
	} satisfies BanyanStore;

	// Need to connect the DocumentNode to the store for reactive updates
	const Wrapper = () => {
		const { activeDoc } = useBanyanContext();
		return <DocumentNode node={activeDoc().root} onMoveNode={vi.fn()} />;
	};

	const { getByText, getByRole } = render(() => (
		<BanyanProvider initialStore={initialStore}>
			<Wrapper />
		</BanyanProvider>
	));

	// Act
	await user.type(getByRole("textbox"), ", world!");

	// Assert
	expect(getByText("Hello, world!")).toBeDefined();
});

// TODO: Improve the testing setup
test.skip("move up moves the node up in the list", async () => {
	// Arrange
	const user = userEvent.setup();
	const root = createBanyanNode("root");
	root.children.push(createBanyanNode("Child Node 1"));
	root.children.push(createBanyanNode("Child Node 2"));
	const initialStore = {
		documents: [{ root } as BanyanDocument],
	} satisfies BanyanStore;

	// Need to connect the DocumentNode to the store for reactive updates
	const Wrapper = () => {
		const { activeDoc } = useBanyanContext();
		return <DocumentNode node={activeDoc().root} onMoveNode={vi.fn()} />;
	};

	const { getByText, getByRole } = render(() => (
		<BanyanProvider initialStore={initialStore}>
			<Wrapper />
		</BanyanProvider>
	));

	// Act
	// await user.type(getByRole("textbox"), ", world!");

	// // Assert
	// expect(getByText("Hello, world!")).toBeDefined();
});
