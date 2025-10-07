import { formatISODate } from "../utils";
import { useBanyanContext } from "./BanyanContext";
import { DocumentNode } from "./DocumentNode";

export const Documents = () => {
	const { store, activeDoc, setActiveDocIndex, addDocument } =
		useBanyanContext();

	return (
		<>
			<button onClick={addDocument}>+ New Document</button>
			<pre class="whitespace-pre-wrap">
				Documents: {JSON.stringify(store.documents)}
			</pre>
			{store.documents.map((doc, index) => (
				<article onClick={() => setActiveDocIndex(index)}>
					<h2>{doc.title}</h2>
					<p>Created: {formatISODate(doc.createdAt)}</p>
					<p>Modified: {formatISODate(doc.updatedAt)}</p>
				</article>
			))}

			{activeDoc()?.root?.children.map((child) => (
				<DocumentNode node={child} />
			))}
		</>
	);
};
