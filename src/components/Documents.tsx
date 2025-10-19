import { formatISODate } from "../utils";
import { useBanyanContext } from "./BanyanContext";
import { Button } from "./Button";
import { DocumentNode } from "./DocumentNode";

export const Documents = () => {
	const { store, activeDoc, setActiveDocIndex, addDocument } =
		useBanyanContext();

	return (
		<>
			<Button onClick={addDocument}>+ New Document</Button>
			{store.documents.map((doc, index) => (
				<Button onClick={() => setActiveDocIndex(index)}>
					<h2>{doc.title}</h2>
					<p>Created: {formatISODate(doc.createdAt)}</p>
					<p>Modified: {formatISODate(doc.updatedAt)}</p>
				</Button>
			))}

			<div class="flex flex-col gap-4">
				<strong class="font-semibold">{activeDoc()?.title}</strong>

				{activeDoc()?.root && (
					<DocumentNode
						node={activeDoc().root}
						parentId={null}
						parentIndex={null}
						nodeAndSiblingIds={[activeDoc().root.id]}
					/>
				)}

				<pre class="whitespace-pre-wrap">
					{JSON.stringify(activeDoc(), null, 2)}
				</pre>
			</div>
		</>
	);
};
