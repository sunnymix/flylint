import axios from "axios";
import Constant from "@/components/common/Constant";

export const defaultWidth = 200;
export const defaultHeight = 30;
export const peakWidth = 50;
export const peakHeight = defaultHeight;

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

// __________ addCols: __________

export const addCols = (sheet: string, cols: Col[], e: SheetColsAdd) => {
  console.log(`SheetApi: addCols: ${JSON.stringify(e)}`);
  // by peak:
  if (!e.col && !e.row) return addColsByPeak(sheet, cols, e.at, e.size);
  // todo
  return cols;
};

export const addColsByPeak = (sheet: string, cols: Col[], at?: SheetAt, size?: number) => {
  if (!at || (at != 'before' && at != 'after')) return cols;
  if (!size || size < 1) return cols;
  if (at == 'before') return addColsBeforeAll(sheet, cols, size);
  if (at == 'after') return addColsAfterAll(sheet, cols, size);
  return cols;
};

export const addColsBeforeAll = (sheet: string, cols: Col[], size: number) => {
  const newCols: Col[] = [];
  let col = 1;
  let left = 0;
  for (var i = 1; i <= size; i++) {
    const width = defaultWidth;
    const newCol = {sheet, col, left, width} as Col;
    newCols.push(newCol);
    left += width;
    col++;
  }
  for (var i = 1; i <= cols.length; i++) {
    const mutateCol = {...cols[i - 1], left, col};
    newCols.push(mutateCol);
    left += mutateCol.width;
    col++;
  }
  return newCols;
};

export const addColsAfterAll = (sheet: string, cols: Col[], size: number) => {
  const newCols: Col[] = [...cols];
  let col = cols.length == 0 ? 1 : cols.length + 1;
  let left = cols.length == 0 ? 0 : cols[cols.length - 1].left + cols[cols.length - 1].width;
  for (var i = 1; i <= size; i++) {
    const width = defaultWidth;
    const newCol = {sheet, col, left, width} as Col;
    newCols.push(newCol);
    left += width;
    col++;
  }
  return newCols;
};


const SheetApi = {

  defaultWidth,
  defaultHeight,
  peakWidth,
  peakHeight,

  // __________ api __________

  getSheet: (sheet: string, cb: (sheet: Sheet|null) => void) => {
    axios.get(`${Constant.API_BASE}/sheet/${sheet}`)
      .then(res => {
        const sheet = res.data?.data as Sheet || null;
        cb(sheet);
      });
  },

  getCell: (sheet: string, col: number, row: number, cb: (data: Cell|null) => void) => {
    axios.get(`${Constant.API_BASE}/sheet/cell/${sheet}/${col}/${row}`)
      .then(res => {
        const data = res.data?.data as Cell || null;
        cb(data);
      });
  },

  saveCellContent: (sheet: string, col: number, row: number, content: string, cb: (success: boolean) => void) => {
    axios.post(`${Constant.API_BASE}/sheet/cell/${sheet}/${col}/${row}`, {content})
      .then(res => {
        const success = res.data?.success || false;
        cb(success);
      });
  },

  // __________ add cols __________

  addCols,

  // __________ ui __________

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
