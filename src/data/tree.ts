import { v4 as uuidv4 } from 'uuid';

export interface BanyanDocument {
  id: string;
  title: string;
  createdAt: string;
  modifiedAt: string;
  /** root is hidden from the user, so user can have multiple "roots" in their view of the document */
  root: BanyanNode | null;
}

export interface BanyanNode {
  id: string;
  content: string;
  children: BanyanNode[];
}

export function createNode() {
  return {
    id: uuidv4(),
    content: '',
    children: [],
  };
}
