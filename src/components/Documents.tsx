import { Show } from "solid-js";
import { formatISODate, getDocumentTitle } from "../utils";
import { useBanyanContext } from "./BanyanContext";
import { Button } from "./Button";
import { DocumentNode } from "./DocumentNode";
import { DocumentTitleControls } from "./DocumentTitleControls";

export const Documents = () => {
	const { store, activeDoc, setActiveDocIndex, addDocument } =
		useBanyanContext();

	return (
		<>
			<Button onClick={addDocument}>+ New Document</Button>
			{store.documents.map((doc, index) => (
				<Button onClick={() => setActiveDocIndex(index)}>
					<h2>{getDocumentTitle(doc)}</h2>
					<p>Created: {formatISODate(doc.createdAt)}</p>
					<p>Modified: {formatISODate(doc.updatedAt)}</p>
				</Button>
			))}

			<div class="flex flex-col gap-4">
				<DocumentTitleControls />

				<Show when={activeDoc()}>
					<DocumentNode
						node={activeDoc().root}
						parentId={null}
						parentIndex={null}
						nodeAndSiblingIds={[activeDoc().root.id]}
					/>
				</Show>
			</div>
		</>
	);
};
