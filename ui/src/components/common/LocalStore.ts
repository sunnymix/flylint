import { SelectedCell } from "../sheet/SheetApi";
import Arr from "./Arr";

// TODO: 
// - 高阶函数重构重复代码

const LocalStore = {

  // Localstorage Wrap:

  set(key: string, data: string) {
    window.localStorage.setItem(key, data);
  },

  setObj(key: string, data: any) {
    LocalStore.set(key, JSON.stringify(data));
  },

  get(key: string) {
    return window.localStorage.getItem(key);
  },

  getObj(key: string) {
    const str = LocalStore.get(key);
    if (typeof str != 'string') return null;
    if (str.length < 1) return null;
    if (str[0] != '{' && str[0] != '[') return null;
    var obj = null;
    try {
      obj = JSON.parse(str);
    } catch (error) {}
    return obj;
  },

  setArray(key: string, data: any[]|null) {
    LocalStore.set(key, JSON.stringify(data));
  },

  appendArray(key: string, data: any[]) {
    const localArr = LocalStore.getArray(key);
    LocalStore.setArray(key, Arr.concat(localArr, data))
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

  appendCatalogExpandKeys(keys: string[]) {
    LocalStore.appendArray(this.CATALOG_EXPANDED_KEYS, keys);
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

  // __________ sheet: selectedCells __________

  SHEET_SELECTED_CELL: 'sheet.selected.cell.',

  setSheetSelectedCell(cells: SelectedCell) {
    LocalStore.set(LocalStore.SHEET_SELECTED_CELL + cells.sheet, JSON.stringify(cells));
  },

  getSheetSelectedCell(sheet: string) {
    return LocalStore.getObj(LocalStore.SHEET_SELECTED_CELL + sheet) as SelectedCell;
  },

};

export default LocalStore;
