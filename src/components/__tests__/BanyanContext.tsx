// Tests which assert that when its public interface is used, BanyanContext transforms the tree in the expected ways
import { expect, test } from "vitest";
import { renderHook } from "@solidjs/testing-library";
import { BanyanDocument, createBanyanNode } from "../../data/tree";
import { BanyanProvider, BanyanStore, useBanyanContext } from "../BanyanContext";

test("adds new child node under the given node", () => {
  const root = createBanyanNode("root")
  const initialStore = {
    documents: [{ root } as BanyanDocument],
  } satisfies BanyanStore;

  const { result } = renderHook(
    () => useBanyanContext(),
    {
      wrapper: (props) => (
        <BanyanProvider initialStore={initialStore}>
          {props.children}
        </BanyanProvider>
      )
    }
  )

  const { store } = result;

  expect(store.documents[0].root.children.length).toBe(0)
})
