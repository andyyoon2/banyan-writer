import {
  createContext,
  createEffect,
  createSignal,
  JSXElement,
  useContext,
} from "solid-js";
import { createStore, produce } from "solid-js/store";
import { findNodeById } from "../utils";
import { v4 as uuidv4 } from "uuid";
import { BanyanDocument, createBanyanNode } from "../data/tree";

// --------------------------------------------------
// Interfaces and helpers

interface BanyanStore {
  documents: BanyanDocument[];
}

interface BanyanContextType {
  store: BanyanStore;
  activeDoc: () => BanyanDocument | undefined;
  setActiveDocIndex: (index: number) => void;
  addDocument: () => void;
  handleNodeChange: (id: string, content: string) => void;
}

interface BanyanProviderProps {
  children: JSXElement;
}

const LOCAL_STORAGE_KEY = "banyan_documents";

// --------------------------------------------------
// useBanyanContext

const BanyanContext = createContext<BanyanContextType>({
  store: { documents: [] },
  activeDoc: () => undefined,
  setActiveDocIndex: () => {},
  addDocument: () => {},
  handleNodeChange: () => {},
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

  const initialDocuments = localStorage.getItem(LOCAL_STORAGE_KEY)
    ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)!)
    : [];

  const [store, setStore] = createStore<BanyanStore>({
    documents: initialDocuments,
  });
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
    // Main root node is hidden from user, so they can add multiple "roots" in their view of the document.
    // Start them off with a new top-level node.
    newDocument.root.children = [createBanyanNode("Start typing...")];

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

    // Find the node by id, then update its content.
    // Could optimize lookups by passing through indexes
    const editedNode = findNodeById(id, activeDoc().root);
    console.log(editedNode);
    // setStore(
    //   produce((draft) => {
    //     // Assume activeDoc is valid
    //     const editedNode = findNodeById(id, activeDoc().root);
    //   }),
    // );
  };

  // --------------------------------------------------
  // Return context value

  const banyanContextValue = {
    store,
    activeDoc,
    setActiveDocIndex,
    addDocument,
    handleNodeChange,
  } satisfies BanyanContextType;

  return (
    <BanyanContext.Provider value={banyanContextValue}>
      {props.children}
    </BanyanContext.Provider>
  );
};
