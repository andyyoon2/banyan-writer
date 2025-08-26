export interface BanyanDocument {
  id: string;
  title: string;
  createdAt: string;
  modifiedAt: string;
  root: BanyanNode | null;
}

export interface BanyanNode {
  id: string;
  content: string;
  children: BanyanNode[];
}
