import axios from "axios";
import Constant from "@/components/common/Constant";

export const peakWidth = 50;
export const defaultWidth = 200;
export const defaultHeight = 30;

export interface Sheet {
  sheet: string,
  colSize: number,
  rowSize: number,
};

export interface Col {
  sheet: string,
  key: string,
  index: number,
  left: number,
  width: number,
  height: number,
};

export interface Row {
  sheet: string,
  key: string,
  index: number,
  top: number,
  height: number,
  width: number,
}

export type CellType = 'cell';

export interface Cell {
  sheet: string,
  type: CellType,
  key: string,
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

const SheetApi = {

  // __________ server __________

  getCell: (sheet: string, col: number, row: number, cb: (data: Cell|null) => void) => {
    axios.get(`${Constant.API_BASE}/cell/${sheet}/${col}/${row}`)
      .then(res => {
        const data = res.data?.data as Cell || null;
        cb(data);
      });
  },

  saveCellContent: (sheet: string, col: number, row: number, content: string, cb: (success: boolean) => void) => {
    axios.post(`${Constant.API_BASE}/cell/${sheet}/${col}/${row}`, {content})
      .then(res => {
        const success = res.data?.success || false;
        cb(success);
      });
  },

  // __________ ui __________

  makeRows: (sheet: Sheet) => {
    const rows: Row[] = [];
    for (var r = 1; r <= sheet.rowSize; r++) {
      rows.push({
        key: r.toString(),
        index: r,
        top: r * defaultHeight,
        height: defaultHeight,
        width: peakWidth + sheet.colSize * defaultWidth,
      } as Row);
    }
    return rows;
  },

  makeCols: (sheet: Sheet) => {
    const cols: Col[] = [];
    for (var c = 1; c <= sheet.colSize; c++) {
      cols.push({
        key: c.toString(),
        index: c,
        left: (c - 1) * defaultWidth,
        width: defaultWidth,
        height: (sheet.rowSize + 1) * defaultHeight,
      } as Col);
    }
    return cols;
  },

  makeCells: (sheet: Sheet) => {
    const cells: Cell[] = [];
    for (var r = 1; r <= sheet.rowSize; r++) {
      for (var c = 1; c <= sheet.colSize; c++) {
        const left = peakWidth + (c - 1) * defaultWidth;
        const top = defaultHeight + (r - 1) * defaultHeight;
        cells.push({
          sheet: sheet.sheet,
          type: 'cell',
          key: `${c}-${r}`,
          col: c,
          row: r,
          colSize: 1,
          rowSize: 1,
          left: left,
          top: top,
          width: defaultWidth,
          height: defaultHeight,
        });
      }
    }
    return cells;
  },

};

export default SheetApi;
