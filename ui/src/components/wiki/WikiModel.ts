
export interface BasicWiki {
  id: string,
  type: WikiType,
  name: string,
  path: string,
  pathIndex: number,
  title: string,
  created: string,
  updated: string,
};

export interface DetailWiki {
  id: string,
  type: WikiType,
  name: string,
  path: string,
  pathIndex: number,
  title: string,
  content: string,
  created: string,
  updated: string,
};

export type WikiMode = "wiki" | "catalog";

export type WikiType = 'wiki' | 'sheet' | 'cell';
