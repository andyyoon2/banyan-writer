import { expect, test } from "vitest";
import { render } from "@solidjs/testing-library";
import { DocumentNode } from "../DocumentNode";
import { createBanyanNode } from "../../data/tree";

test("renders all node content", () => {
  const root = createBanyanNode();
  root.children.push(createBanyanNode("Child Node 1"));
  root.children.push(createBanyanNode("Child Node 2"));

  const { getByText } = render(() => <DocumentNode node={root} />);
  expect(getByText("Child Node 1")).toBeDefined();
  expect(getByText("Child Node 2")).toBeDefined();
});
