import { formatISODate } from "../utils";
import { useBanyanContext } from "./BanyanContext";
import { DocumentNode } from "./DocumentNode";

export const Documents = () => {
	const { store, activeDoc, setActiveDocIndex, addDocument } =
		useBanyanContext();

	return (
		<>
			<button type="button" onClick={addDocument}>
				+ New Document
			</button>
			{store.documents.map((doc, index) => (
				<button type="button" onClick={() => setActiveDocIndex(index)}>
					<h2>{doc.title}</h2>
					<p>Created: {formatISODate(doc.createdAt)}</p>
					<p>Modified: {formatISODate(doc.updatedAt)}</p>
				</button>
			))}

			<div class="flex flex-col gap-4">
				<strong class="font-semibold">{activeDoc()?.title}</strong>

				<pre class="whitespace-pre-wrap">
					{JSON.stringify(activeDoc(), null, 2)}
				</pre>

				{activeDoc()?.root && <DocumentNode node={activeDoc().root} />}

				{/*{activeDoc()?.root?.children.map((child) => (
					<DocumentNode node={child} />
				))}*/}
			</div>
		</>
	);
};
