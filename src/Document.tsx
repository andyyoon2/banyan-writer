import { createSignal } from "solid-js";

interface DocumentProps {}

export const Document = (props: DocumentProps) => {
  const [content, setContent] = createSignal('');

  return (

  );
}
