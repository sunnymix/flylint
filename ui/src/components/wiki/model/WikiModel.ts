
export interface BasicWiki {
  id: string,
  name: string,
  path: string,
  pathIndex: number,
  title: string,
  created: string,
  updated: string,
};

export interface DetailWiki {
  id: string,
  name: string,
  path: string,
  pathIndex: number,
  title: string,
  content: string,
  created: string,
  updated: string,
};

export type WikiMode = "wiki" | "catalog";
