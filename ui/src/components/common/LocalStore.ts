
import Arr from "./Arr";

// TODO: 
// - 高阶函数重构重复代码

const LocalStore = {

  // Localstorage Wrap:

  set(key: string, data: string) {
    window.localStorage.setItem(key, data);
  },

  get(key: string) {
    return window.localStorage.getItem(key);
  },

  setArray(key: string, data: any[]) {
    LocalStore.set(key, JSON.stringify(data));
  },

  getArray(key: string) {
    return JSON.parse(LocalStore.get(key) || "[]") || [];
  },

  remove(key: string) {
    window.localStorage.removeItem(key);
  },


  // Catalog Expand Keys:

  CATALOG_EXPANDED_KEYS: "catalog.expandedKeys",

  setCatalogExpandKeys(keys: string[]) {
    LocalStore.setArray(LocalStore.CATALOG_EXPANDED_KEYS, keys);
  },

  getCatalogExpandKeys() {
    return LocalStore.getArray(LocalStore.CATALOG_EXPANDED_KEYS);
  },

  removeCatalogExpandKeys() {
    LocalStore.remove(LocalStore.CATALOG_EXPANDED_KEYS);
  },


  // Catalog Selected Keys:

  CATALOG_SELECTED_KEYS: "catalog.selectedKeys",

  setCatalogSelectedKeys(keys: string[]) {
    LocalStore.setArray(LocalStore.CATALOG_SELECTED_KEYS, keys);
  },

  getCatalogSelectKeys() {
    return LocalStore.getArray(LocalStore.CATALOG_SELECTED_KEYS);
  },

  removeCatalogSelectedKeys(removeKeys: string[]) {
    const localKeys = LocalStore.getArray(LocalStore.CATALOG_SELECTED_KEYS);

    if (!Arr.includeArr(localKeys, removeKeys)) {
      return;
    }

    LocalStore.remove(LocalStore.CATALOG_SELECTED_KEYS);
  },

};

export default LocalStore;
