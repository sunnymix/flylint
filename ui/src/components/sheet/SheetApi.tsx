import axios from "axios";
import Constant from "@/components/common/Constant";
import { isArrEmpty } from "../common/Ts";

// __________ property: __________

export const defaultWidth = 200;
export const defaultHeight = 30;
export const peakWidth = 50;
export const peakHeight = 30;

// __________ interface: __________

export interface Size {width: number, height: number};
export const Size0 = {width: 0, height: 0} as Size;

export interface Pos {left: number, top: number};
export const Pos0 = {left: 0, top: 0} as Pos;

export interface Rect {left: number, top: number, width: number, height: number};
export const Rect0 = {left: -1000, top: -1000, width: 0, height: 0} as Rect;

export interface Sheet {
  sheet: string,
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

/* __________ interface: cursor __________ */

export interface CursorData {
  left: number,
  top: number,
}

export type SheetTarget = 'col' | 'row' | 'cell';

export type SheetAt = 'self' | 'before' | 'after';

export interface SheetUpdate {
  sheet: string,
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
      const serverSheet = res.data?.data as Sheet || null;
      if (!serverSheet) cb(null);
      const sheet = serverSheet.sheet;
      const cols = arrangeCols(serverSheet.cols, true);
      const rows = arrangeRows(serverSheet.rows, true);
      const cells = arrangeCells(sheet, cols, rows, serverSheet.cells);
      const newSheet = {sheet, cols, rows, cells};
      // console.log(`SheetApi: getServerSheet: sheet: `, newSheet);
      cb(newSheet);
    });
};

export const fetchSheet = (sheet: string) => {
  return new Promise((resolve, reject) => {
    axios.get(`${Constant.API_BASE}/sheet/${sheet}`)
      .then(res => {
        const serverSheet = res.data?.data as Sheet || null;
        if (!serverSheet) reject('SERVER ERROR');
        const sheet = serverSheet.sheet;
        const cols = arrangeCols(serverSheet.cols, true);
        const rows = arrangeRows(serverSheet.rows, true);
        const cells = arrangeCells(sheet, cols, rows, serverSheet.cells);
        const newSheet = {sheet, cols, rows, cells};
        resolve(newSheet);
      });
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

export const postCellContent = (sheet: string, col: number, row: number, content: string) => {
  return new Promise((resolve, reject) => {
    axios.post(`${Constant.API_BASE}/sheet/cell/${sheet}/${col}/${row}`, {content})
      .then(res => {
        const success = res.data?.success || false;
        success ? resolve(true) : reject('SERVER ERROR');
      });
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

export const postCols = (sheet: string, afterCol: number, size: number, width: number) => {
  return new Promise<boolean>((resolve, reject) => {
    const addColData = {afterCol, size, width};
    axios.post(`${Constant.API_BASE}/sheet/col/${sheet}`, addColData)
      .then(res => {
        const success = res.data?.success || false;
        success ? resolve(true) : reject('SERVER ERROR');
      });
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

export const postRows = (sheet: string, afterRow: number, size: number, height: number) => {
  return new Promise<boolean>((resolve, reject) => {
    const addRowData = {afterRow, size, height};
    axios.post(`${Constant.API_BASE}/sheet/row/${sheet}`, addRowData)
      .then(res => {
        const success = res.data?.success || false;
        success ? resolve(true) : reject('SERVER ERROR');
      });
  });
};

/* __________ sheet: helper: __________ */

export const calcSheetWidth = (cols: Col[], excludePeak?: boolean) => {
  return (excludePeak === true ? 0 : peakWidth) + cols.reduce((sum, item) => sum + item.width, 0);
};

export const calcSheetHeight = (rows: Row[], excludePeak?: boolean) => {
  return (excludePeak === true ? 0 : peakHeight) + rows.reduce((sum, item) => sum + item.height, 0);
};

/* __________ cell: helper: __________ */

export const calcCellRect = (col: number, row: number, cols: Col[], rows: Row[]) => {
  const zero = {left: 0, top: 0, width: 0, height: 0};
  if (col < 1 || row < 1 || !cols.length || !rows.length) return zero;
  const colInfo = cols.find((it) => it.col == col);
  if (!colInfo) return zero;
  const rowInfo = rows.find((it) => it.row == row);
  if (!rowInfo) return zero;
  const left = colInfo.left;
  const top = rowInfo.top;
  const width = colInfo.width;
  const height = rowInfo.height;
  return {left, top, width, height};
};

export const isSameCell = (c1: Cell|null|undefined, c2: Cell|null|undefined) => {
  if (!c1 && !c2) return true;
  if (!c1 || !c2) return false;
  return c1.col == c2.col &&
    c1.row == c2.row &&
    c1.colSize == c2.colSize &&
    c1.rowSize == c2.rowSize;
};

export const arrangeCells = (sheet: string, cols: Col[], rows: Row[], cells: Cell[]): Cell[] => {
  const newCells: Cell[] = [];
  if (!cols || !rows) return newCells;
  if (isArrEmpty(cols) || isArrEmpty(rows)) return newCells;
  cols.forEach((col: Col) => {
    rows.forEach((row: Row) => {
      const serverCell = findCell(col.col, row.row, cells);
      const cell = serverCell ? fillCell(col, row, serverCell) : buildCell(sheet, col, row);
      newCells.push(cell);
    })
  });
  return newCells;
};

export const findCell = (col: number, row: number, cells: Cell[]): Cell|null => {
  if (col < 1 || row < 1 || isArrEmpty(cells)) return null;
  return cells.find((cell: Cell) => cell.col == col && cell.row == row) || null;
};

export const fillCell = (col: Col, row: Row, cell: Cell): Cell => {
  const newCell = {
    ...cell,
    left: col.left,
    width: col.width,
    top: row.top,
    height: row.height,
  } as Cell;
  return newCell;
};

export const buildCell = (sheet: string, col: Col, row: Row): Cell => {
  const newCell = {
    sheet,
    col: col.col,
    row: row.row,
    left: col.left,
    width: col.width,
    top: row.top,
    height: row.height,
  } as Cell;
  return newCell;
};

/* __________ addCols: __________ */

export const addCols = (sheet: string, cols: Col[], e: SheetColsAdd): Col[] => {
  const {col, size, width} = e;
  if (!col || col < 0 || !size || size < 1 || !width || width < 0) return cols;
  return addColsAfterCol(sheet, cols, col, size, width);
};

export const addColsAfterCol = (sheet: string, cols: Col[], afterCol: number, size: number, width: number) => {
  const newCols: Col[] = [...cols.slice(0, afterCol), ...buildCols(sheet, size, width), ...cols.slice(afterCol)];
  return arrangeCols(newCols);
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
  return cols;
};

export const sortCols = (cols: Col[]) => {
  return cols.sort((a, b) => a.col - b.col);
};

/* __________ addRows: __________ */

export const addRows = (sheet: string, rows: Row[], e: SheetRowsAdd) => {
  const {row, size, height} = e;
  if (!row || row < 0 || !size || size < 1 || !height || height < 0) return rows;
  return addRowsAfterRow(sheet, rows, row, size, height);
};

export const addRowsAfterRow = (sheet: string, rows: Row[], afterRow: number, size: number, height: number) => {
  const newRows: Row[] = [...rows.slice(0, afterRow), ...buildRows(sheet, size, height), ...rows.slice(afterRow)];
  return arrangeRows(newRows);
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
  return rows;
};

export const sortRows = (rows: Row[]) => {
  return rows.sort((a, b) => a.row - b.row);
};

/* __________ calc: cursor: cur cell __________ */

export const getCellByCursor = (cursor: CursorData, cols: Col[], rows: Row[]) => {
  if (cursor.left < 0 || cursor.top < 0) return null;
  if (!cols || !cols.length || !rows || !rows.length) return null;
  const colInfo = getColByLeft(cursor.left, cols);
  if (!colInfo) return null;
  const rowInfo = getRowByTop(cursor.top, rows);
  if (!rowInfo) return null;
  return {
    sheet: colInfo.sheet,
    type: 'cell',
    col: colInfo.col,
    row: rowInfo.row,
    colSize: 1,
    rowSize: 1,
    left: colInfo.left,
    top: rowInfo.top,
    width: colInfo.width,
    height: rowInfo.height,
  } as Cell;
};

export const getColByLeft = (left: number, cols: Col[]) => {
  if (!cols || !cols.length) return null;
  if (left < 0) return null;
  const colInfo = cols.find((item: Col) => left >= item.left && left <= (item.left + item.width));
  if (!colInfo) return null;
  return colInfo;
};

export const getRowByTop = (top: number, rows: Row[]) => {
  if (!rows || !rows.length) return null;
  if (top < 0) return null;
  const rowInfo = rows.find((item: Row) => top >= item.top && top <= (item.top + item.height));
  if (!rowInfo) return null;
  return rowInfo;
};

/* __________ export: __________ */

const SheetApi = {
  /* __________ property: __________ */
  defaultWidth,
  defaultHeight,
  peakWidth,
  peakHeight,
  /* __________ server api: __________ */
  fetchSheet,
  postCellContent,
  postCols,
  postRows,
  // deperacate:
  getServerSheet,
  getServerCell,
  saveServerCellContent,
  addServerCol,
  addServerRow,
  /* __________ sheet: helper __________ */
  calcSheetWidth,
  calcSheetHeight,
  /* cell: helper */
  calcCellRect,
  /* __________ addCols: __________ */
  addCols,
  /* __________ addRows: __________ */
  addRows,
  /* __________ cell: __________ */
  getCellByCursor,
  isSameCell,
  arrangeCells,
  /* __________  __________ */
};

export default SheetApi;
