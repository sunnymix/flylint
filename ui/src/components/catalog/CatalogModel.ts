
export interface CatalogTree {
  key: string,
  name: string,
  path: string,
  title: string,
  children: CatalogTree[],
};

export type MovePlace = "unknown" | "child" | "next" | "previous";
