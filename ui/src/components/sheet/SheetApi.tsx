import axios from "axios";
import Constant from "@/components/common/Constant";

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
}

const SheetApi = {

  peakWidth: 50,

  defaultWidth: 200,

  defaultHeight: 30,

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
