import { getDocumentTitle } from "../utils";
import { useBanyanContext } from "./BanyanContext";
import { Button } from "./Button";

export function DocumentTitleControls() {
	const { activeDoc, deleteDocument } = useBanyanContext();

	if (!activeDoc()) {
		return null;
	}

	return (
		<div class="flex flex-row gap-2">
			<strong class="font-semibold">{getDocumentTitle(activeDoc())}</strong>
			{/* TODO: Once deleted, the active document needs to be reset. The index resetting isn't working currently. */}
			<Button onClick={() => deleteDocument(activeDoc().id)}>Delete</Button>
		</div>
	);
}
