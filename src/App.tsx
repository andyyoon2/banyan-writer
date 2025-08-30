import { createEffect, createSignal, type Component } from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import { BanyanDocument } from './data/tree';
import { v4 as uuidv4 } from 'uuid';
import { formatISODate } from './utils';

const LOCAL_STORAGE_KEY = 'banyan_documents';
interface BanyanStore {
  documents: BanyanDocument[];
}

const App: Component = () => {
  const initialDocuments = localStorage.getItem(LOCAL_STORAGE_KEY)
    ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)!)
    : [];

  const [store, setStore] = createStore<BanyanStore>({
    documents: initialDocuments,
  });
  const [activeDocIndex, setActiveDocIndex] = createSignal(0);
  const activeDoc = store.documents[activeDocIndex()];

  createEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store.documents));
  });

  const addDocument = () => {
    const newDocument: BanyanDocument = {
      id: uuidv4(),
      title: 'New Document',
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      root: null,
    };
    setStore(
      produce((draft) => {
        draft.documents.push(newDocument);
      })
    );
  };

  return (
    <>
      <p class='text-4xl text-green-700 text-center py-20'>Hello tailwind!</p>
      <button onClick={addDocument}>+ New Document</button>
      <pre>Documents: {JSON.stringify(store.documents)}</pre>
      {store.documents.map((doc) => (
        <article>
          <h2>{doc.title}</h2>
          <p>Created: {formatISODate(doc.createdAt)}</p>
          <p>Modified: {formatISODate(doc.modifiedAt)}</p>
        </article>
      ))}

      <p>Root: {activeDoc.root.content}</p>
    </>
  );
};

export default App;
