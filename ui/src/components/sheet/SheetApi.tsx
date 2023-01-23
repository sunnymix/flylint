import axios from "axios";
import Constant from "@/components/common/Constant";

// __________ property: __________

export const defaultWidth = 250;
export const defaultHeight = 60;
export const peakWidth = 50;
export const peakHeight = 30;

// __________ interface: __________

export interface Sheet {
  sheet: string,
  colsSize: number,
  rowsSize: number,
  cols: Col[],
  rows: Row[],
  cells: Cell[],
};

export interface Col {
  sheet: string,
  col: number,
  left: number,
  width: number,
  isAdd?: boolean,
};

export interface Row {
  sheet: string,
  row: number,
  top: number,
  height: number,
}

export type CellType = 'cell';

export interface Cell {
  sheet: string,
  type: CellType,
  col: number,
  row: number,
  colSize: number,
  rowSize: number,
  left: number,
  top: number,
  width: number,
  height: number,
  content?: string,
};

export interface SelectedCell {
  sheet: string,
  col: number,
  row: number,
};

export type SheetTarget = 'col' | 'row' | 'cell';

export type SheetAt = 'self' | 'before' | 'after';

export interface SheetUpdate {
  target: SheetTarget,
  col?: number,
  row?: number,
  at?: SheetAt,
  size?: number,
  width?: number,
  height?: number,
};

export interface SheetColsAdd extends SheetUpdate {};

export interface SheetColsDelete extends SheetUpdate {};

export interface SheetColsWidthUpdate extends SheetUpdate {};

export interface SheetRowsAdd extends SheetUpdate {};

export interface SheetRowsDelete extends SheetUpdate {};

export interface SheetRowsHeightUpdate extends SheetUpdate {};

// __________ server api: __________

export const getServerSheet = (sheet: string, cb: (sheet: Sheet|null) => void) => {
  axios.get(`${Constant.API_BASE}/sheet/${sheet}`)
    .then(res => {
      const sheet = res.data?.data as Sheet || null;
      arrangeCols(sheet.cols, true);
      arrangeRows(sheet.rows, true);
      cb(sheet);
    });
};

export const getServerCell = (sheet: string, col: number, row: number, cb: (data: Cell|null) => void) => {
  axios.get(`${Constant.API_BASE}/sheet/cell/${sheet}/${col}/${row}`)
    .then(res => {
      const data = res.data?.data as Cell || null;
      cb(data);
    });
};

export const saveServerCellContent = (sheet: string, col: number, row: number, content: string, cb: (success: boolean) => void) => {
  axios.post(`${Constant.API_BASE}/sheet/cell/${sheet}/${col}/${row}`, {content})
    .then(res => {
      const success = res.data?.success || false;
      cb(success);
    });
};

export const addServerCol = (sheet: string, afterCol: number, size: number, width: number, cb: (success: boolean) => void) => {
  const addColData = {afterCol, size, width};
  axios.post(`${Constant.API_BASE}/sheet/col/${sheet}`, addColData)
    .then(res => {
      const success = res.data?.success || false;
      cb(success);
    });
};

export const addServerRow = (sheet: string, afterRow: number, size: number, height: number, cb: (success: boolean) => void) => {
  const addRowData = {afterRow, size, height};
  axios.post(`${Constant.API_BASE}/sheet/row/${sheet}`, addRowData)
    .then(res => {
      const success = res.data?.success || false;
      cb(success);
    });
};

/* __________ sheet: helper: __________ */

export const calcSheetWidth = (cols: Col[]) => {
  return peakWidth + cols.reduce((sum, item) => sum + item.width, 0);
};

export const calcSheetHeight = (rows: Row[]) => {
  return peakHeight + rows.reduce((sum, item) => sum + item.height, 0);
};

/* __________ addCols: __________ */

export const addCols = (sheet: string, cols: Col[], afterCol: number, size: number, width: number) => {
  if (afterCol < 0 || size < 1 || width < 0) return cols;
  return addColsAfterCol(sheet, cols, afterCol, size, width);
};

export const addColsAfterCol = (sheet: string, cols: Col[], afterCol: number, size: number, width: number) => {
  const newCols: Col[] = [...cols.slice(0, afterCol), ...buildCols(sheet, size, width), ...cols.slice(afterCol)];
  arrangeCols(newCols);
  return newCols;
};

/* __________ addCols: helper: __________ */

export const buildCols = (sheet: string, size: number, width: number) => {
  let col = -1, left = -1000;
  return [...Array(size)].map((v, i) => { return {sheet, width, col, left} });
};

export const arrangeCols = (oldCols: Col[], sortByCol?: boolean) => {
  const cols: Col[] = sortByCol === true ? sortCols(oldCols) : oldCols;
  let col = 1;
  let left = 0;
  for (var i = 1; i <= cols.length; i++) {
    const item = cols[i - 1];
    item.col = col;
    item.left = left;
    col++;
    left += item.width;
  }
};

export const sortCols = (cols: Col[]) => {
  return cols.sort((a, b) => a.col - b.col);
};

/* __________ addRows: __________ */

export const addRows = (sheet: string, rows: Row[], afterRow: number, size: number, height: number) => {
  if (afterRow < 0 || size < 1 || height < 0) return rows;
  return addRowsAfterRow(sheet, rows, afterRow, size, height);
};

export const addRowsAfterRow = (sheet: string, rows: Row[], afterRow: number, size: number, height: number) => {
  const newRows: Row[] = [...rows.slice(0, afterRow), ...buildRows(sheet, size, height), ...rows.slice(afterRow)];
  arrangeRows(newRows);
  return newRows;
};

/* __________ addRows: helper: __________ */

export const buildRows = (sheet: string, size: number, height: number) => {
  let row = -1, top = -1000;
  return [...Array(size)].map((v, i) => { return {sheet, height, row, top} });
};

export const arrangeRows = (oldRows: Row[], sortByRow?: boolean) => {
  const rows: Row[] = sortByRow === true ? sortRows(oldRows) : oldRows;
  let row = 1;
  let top = 0;
  for (var i = 1; i <= rows.length; i++) {
    const item = rows[i - 1];
    item.row = row;
    item.top = top;
    row++;
    top += item.height;
  }
};

export const sortRows = (rows: Row[]) => {
  return rows.sort((a, b) => a.row - b.row);
};

/* __________ export: __________ */

const SheetApi = {
  /* __________ property: __________ */
  defaultWidth,
  defaultHeight,
  peakWidth,
  peakHeight,
  /* __________ server api: __________ */
  getServerSheet,
  getServerCell,
  saveServerCellContent,
  addServerCol,
  addServerRow,
  /* __________ sheet: helper __________ */
  calcSheetWidth,
  calcSheetHeight,
  /* __________ addCols: __________ */
  addCols,
  /* __________ addRows: __________ */
  addRows,
  /* __________ delete: todo __________ */
  makeCols: (sheet: Sheet) => {
    const cols: Col[] = [];
    for (var c = 1; c <= sheet.colsSize; c++) {
      cols.push({
        col: c,
        left: (c - 1) * SheetApi.defaultWidth,
        width: SheetApi.defaultWidth,
      } as Col);
    }
    return cols;
  },

  makeRows: (sheet: Sheet) => {
    const rows: Row[] = [];
    for (var r = 1; r <= sheet.rowsSize; r++) {
      rows.push({
        row: r,
        top: r * SheetApi.defaultHeight,
        height: SheetApi.defaultHeight,
      } as Row);
    }
    return rows;
  },

  makeCells: (sheet: Sheet) => {
    const cells: Cell[] = [];
    for (var r = 1; r <= sheet.rowsSize; r++) {
      for (var c = 1; c <= sheet.colsSize; c++) {
        const left = SheetApi.peakWidth + (c - 1) * SheetApi.defaultWidth;
        const top = SheetApi.defaultHeight + (r - 1) * SheetApi.defaultHeight;
        cells.push({
          sheet: sheet.sheet,
          type: 'cell',
          col: c,
          row: r,
          colSize: 1,
          rowSize: 1,
          left: left,
          top: top,
          width: SheetApi.defaultWidth,
          height: SheetApi.defaultHeight,
        });
      }
    }
    return cells;
  },

};

export default SheetApi;
