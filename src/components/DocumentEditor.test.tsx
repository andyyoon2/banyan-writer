import { expect, test } from "vitest";
import { render } from "@solidjs/testing-library";
import { DocumentEditor } from "./DocumentEditor";
import { BanyanDocument, createBanyanNode } from "../data/tree";

const getMockDocument = (): BanyanDocument => ({
  id: "1",
  title: "Test Document",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  root: createBanyanNode(),
});

test("renders all node content", () => {
  const document = getMockDocument();
  document.root.children.push(createBanyanNode("Child Node 1"));
  document.root.children.push(createBanyanNode("Child Node 2"));

  const { getByText } = render(() => <DocumentEditor document={document} />);
  expect(getByText("Child Node 1")).toBeDefined();
  expect(getByText("Child Node 2")).toBeDefined();
});
