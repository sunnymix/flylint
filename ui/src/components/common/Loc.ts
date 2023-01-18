
const Loc = {

  getPath: () => {
    return window.location.pathname;
  },

  WIKI_PATH: '/wiki/',

  getWikiName: () => {
    const path = Loc.getPath();
    if (!path && path.length < 1) return null;
    const wikiIndex = path.indexOf(Loc.WIKI_PATH);
    if (wikiIndex < 0) return null;
    const name = path.substring(wikiIndex + Loc.WIKI_PATH.length);
    if (!name && name.length < 1) return null;
    return name;
  },

};

export default Loc;
