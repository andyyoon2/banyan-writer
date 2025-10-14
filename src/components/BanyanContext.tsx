import {
	createContext,
	createEffect,
	createSignal,
	type JSXElement,
	useContext,
} from "solid-js";
import { createStore, produce } from "solid-js/store";
import { v4 as uuidv4 } from "uuid";
import { type BanyanDocument, createBanyanNode } from "../data/tree";
import { findNodeById } from "../utils";

// --------------------------------------------------
// Interfaces and helpers

export interface BanyanStore {
	documents: BanyanDocument[];
}

interface BanyanContextType {
	store: BanyanStore;
	activeDoc: () => BanyanDocument | null;
	setActiveDocIndex: (index: number) => void;
	addDocument: () => void;
	addChildNode: (parentId: string, content?: string) => void;
	handleNodeChange: (id: string, content: string) => void;
	moveNode: (props: {
		sourceParentId: string;
		sourceIndex: number;
		targetParentId: string;
		targetIndex: number;
	}) => void;
}

interface BanyanProviderProps {
	children: JSXElement;
	// Initialize the store. By default, the provider reads the value from localStorage.
	initialStore?: BanyanStore;
}

const LOCAL_STORAGE_KEY = "banyan_documents";

// --------------------------------------------------
// useBanyanContext

const BanyanContext = createContext<BanyanContextType>({
	store: { documents: [] },
	activeDoc: () => null,
	setActiveDocIndex: () => {},
	addDocument: () => {},
	addChildNode: () => {},
	handleNodeChange: () => {},
	moveNode: () => {},
});

export const useBanyanContext = () => {
	const context = useContext(BanyanContext);
	if (!context) {
		throw new Error("useBanyanContext must be used within a BanyanProvider");
	}
	return context;
};

// --------------------------------------------------
// PROVIDER

export const BanyanProvider = (props: BanyanProviderProps) => {
	// --------------------------------------------------
	// Setup store with local storage syncing

	let initialStore = props.initialStore;
	if (!initialStore) {
		let initialDocuments: BanyanDocument[];
		try {
			initialDocuments = localStorage.getItem(LOCAL_STORAGE_KEY)
				? // biome-ignore lint/style/noNonNullAssertion: We know it exists
					JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)!)
				: [];
		} catch (_error) {
			initialDocuments = [];
		}

		initialStore = { documents: initialDocuments };
	}

	const [store, setStore] = createStore<BanyanStore>(initialStore);
	const [activeDocIndex, setActiveDocIndex] = createSignal(0);
	const activeDoc = () =>
		store.documents.length ? store.documents[activeDocIndex()] : null;

	createEffect(() => {
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store.documents));
	});

	// --------------------------------------------------
	// Event handlers

	const addDocument = () => {
		const newDocument: BanyanDocument = {
			id: uuidv4(),
			title: "New Document",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			root: createBanyanNode(),
		};

		setStore(
			produce((draft) => {
				draft.documents.push(newDocument);
			}),
		);
	};

	const handleNodeChange = (id: string, content: string) => {
		if (!store.documents.length) {
			return;
		}

		// Grab the active document, then use produce to update it
		setStore(
			"documents",
			activeDocIndex(),
			produce((activeDoc) => {
				// Could optimize lookups by passing through indexes
				const editedNode = findNodeById(id, activeDoc.root);
				// TODO: Test for error
				editedNode.content = content;
				activeDoc.updatedAt = new Date().toISOString();
			}),
		);
	};

	const addChildNode = (parentId: string, content?: string) => {
		if (!store.documents.length) {
			return;
		}

		// Grab the active document, then use produce to update it
		setStore(
			"documents",
			activeDocIndex(),
			produce((activeDoc) => {
				const parent = findNodeById(parentId, activeDoc.root);
				if (!parent) {
					throw new Error("Invalid parent id.");
				}
				const child = createBanyanNode(content);
				parent.children.push(child);
			}),
		);
	};

	/** Move a child node from the source parent to the target parent, inserting it at the given index. */
	const moveNode = ({
		sourceParentId,
		sourceIndex,
		targetParentId,
		targetIndex,
	}: {
		sourceParentId: string;
		sourceIndex: number;
		targetParentId: string;
		targetIndex: number;
	}) => {
		if (
			!sourceParentId ||
			sourceIndex < 0 ||
			!targetParentId ||
			targetIndex < 0 ||
			!store.documents.length
		) {
			return;
		}

		// Grab the active document, then use produce to update it
		setStore(
			"documents",
			activeDocIndex(),
			produce((activeDoc) => {
				const sourceParent = findNodeById(sourceParentId, activeDoc.root);
				if (!sourceParent) {
					throw new Error("Invalid sourceParentId.");
				}
				const targetParent = findNodeById(targetParentId, activeDoc.root);
				if (!targetParent) {
					throw new Error("Invalid targetParentId.");
				}
				if (sourceIndex > sourceParent.children.length) {
					throw new Error("sourceIndex out of bounds.");
				}
				if (targetIndex > targetParent.children.length) {
					throw new Error("targetIndex out of bounds.");
				}

				// Remove node from source parent and add it to target parent
				const [sourceNode] = sourceParent.children.splice(sourceIndex, 1);
				targetParent.children.splice(targetIndex, 0, sourceNode);
			}),
		);
	};

	// --------------------------------------------------
	// Return context value

	const banyanContextValue = {
		store,
		activeDoc,
		setActiveDocIndex,
		addDocument,
		addChildNode,
		handleNodeChange,
		moveNode,
	} satisfies BanyanContextType;

	return (
		<BanyanContext.Provider value={banyanContextValue}>
			{props.children}
		</BanyanContext.Provider>
	);
};
