import { createSignal, Show } from "solid-js";
import { getDocumentTitle } from "../utils";
import { useBanyanContext } from "./BanyanContext";
import { Button } from "./Button";

export function DocumentTitleControls() {
  const { activeDoc, editDocumentTitle, deleteDocument } = useBanyanContext();
  const title = () => getDocumentTitle(activeDoc());
  const [editing, setEditing] = createSignal(false);
  const [editedTitle, setEditedTitle] = createSignal(title());

  if (!activeDoc()) {
    return null;
  }

  const handleCancel = () => {
    setEditing(false);
    setEditedTitle(title());
  };

  const handleSave = () => {
    editDocumentTitle(editedTitle());
    setEditing(false);
    setEditedTitle(title());
  };

  return (
    <div class="flex flex-row gap-2">
      <Show
        when={editing()}
        fallback={
          <>
            <strong class="font-semibold">{title()}</strong>
            <Button onClick={() => setEditing(!editing())}>Edit</Button>
          </>
        }
      >
        <input
          type="text"
          value={editedTitle()}
          onChange={(event) => setEditedTitle(event.target.value)}
        />
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </Show>

      {/* TODO: Once deleted, the active document needs to be reset. The index resetting isn't working currently. */}
      <Button onClick={() => deleteDocument(activeDoc().id)}>Delete</Button>
    </div>
  );
}
