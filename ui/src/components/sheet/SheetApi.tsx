import axios from "axios";
import Constant from "@/components/common/Constant";

// __________ property: __________

export const defaultWidth = 200;
export const defaultHeight = 30;
export const peakWidth = 50;
export const peakHeight = defaultHeight;

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

// __________ api: __________

export const getSheet = (sheet: string, cb: (sheet: Sheet|null) => void) => {
  axios.get(`${Constant.API_BASE}/sheet/${sheet}`)
    .then(res => {
      const sheet = res.data?.data as Sheet || null;
      cb(sheet);
    });
};

export const getCell = (sheet: string, col: number, row: number, cb: (data: Cell|null) => void) => {
  axios.get(`${Constant.API_BASE}/sheet/cell/${sheet}/${col}/${row}`)
    .then(res => {
      const data = res.data?.data as Cell || null;
      cb(data);
    });
};

export const saveCellContent = (sheet: string, col: number, row: number, content: string, cb: (success: boolean) => void) => {
  axios.post(`${Constant.API_BASE}/sheet/cell/${sheet}/${col}/${row}`, {content})
    .then(res => {
      const success = res.data?.success || false;
      cb(success);
    });
};

/* __________ addCols: __________ */

export const addCols = (sheet: string, cols: Col[], e: SheetColsAdd) => {
  console.log(`SheetApi: sheet: ${sheet}: addCols: ${JSON.stringify(e)}`);
  if (!e.at || (e.at != 'before' && e.at != 'after')) return cols;
  if (!e.size || e.size < 1) return cols;
  return addColsByCol(sheet, cols, e.col || 0, e.at, e.size);
};

export const addColsByCol = (sheet: string, cols: Col[], byCol: number, at: SheetAt, size: number) => {
  if (at == 'before') return addColsBeforeCol(sheet, cols, byCol, size);
  if (at == 'after') return addColsAfterCol(sheet, cols, byCol, size);
  return cols;
};

export const addColsBeforeCol = (sheet: string, cols: Col[], byCol: number, size: number) => {
  const newCols: Col[] = [...cols.slice(0, byCol), ...buildCols(sheet, size), ...cols.slice(byCol)];
  arrangeCols(newCols);
  return newCols;
};

export const addColsAfterCol = (sheet: string, cols: Col[], byCol: number, size: number) => {
  return addColsBeforeCol(sheet, cols, byCol + 1, size);
};

/* __________ addCols: helper: __________ */

export const buildCols = (sheet: string, size: number) => {
  let col = -1, left = -1000;
  const width = defaultWidth;
  return [...Array(size)].map((v, i) => { return {sheet, width, col, left} });
};

export const arrangeCols = (cols: Col[]) => {
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

/* __________ addRows: __________ */

export const addRows = (sheet: string, rows: Row[], e: SheetRowsAdd) => {
  console.log(`SheetApi: sheet: ${sheet}: addRows: ${JSON.stringify(rows)}`);
  if (!e.at || (e.at != 'before' && e.at != 'after')) return rows;
  if (!e.size || e.size < 1) return rows;
  return addRowsByRow(sheet, rows, e.row || 0, e.at, e.size);
};

export const addRowsByRow = (sheet: string, rows: Row[], byRow: number, at: SheetAt, size: number) => {
  if (at == 'before') return addRowsBeforeRow(sheet, rows, byRow, size);
  if (at == 'after') return addRowsAfterRow(sheet, rows, byRow, size);
  return rows;
};

export const addRowsBeforeRow = (sheet: string, rows: Row[], byRow: number, size: number) => {
  const newRows: Row[] = [...rows.slice(0, byRow), ...buildRows(sheet, size), ...rows.slice(byRow)];
  arrangeRows(newRows);
  return newRows;
};

export const addRowsAfterRow = (sheet: string, rows: Row[], byRow: number, size: number) => {
  return addRowsBeforeRow(sheet, rows, byRow + 1, size);
};

/* __________ addRows: helper: __________ */

export const buildRows = (sheet: string, size: number) => {
  let row = -1, top = -1000;
  const height = defaultHeight;
  return [...Array(size)].map((v, i) => { return {sheet, height, row, top} });
};

export const arrangeRows = (rows: Row[]) => {
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

/* __________ export: __________ */

const SheetApi = {
  // __________ property: __________
  defaultWidth,
  defaultHeight,
  peakWidth,
  peakHeight,
  // __________ api: __________
  getSheet,
  getCell,
  saveCellContent,
  /* __________ addCols: __________ */
  addCols,
  /* __________ addRows: __________ */
  addRows,
  // __________ delete: todo __________
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
