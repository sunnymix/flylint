import { sheet } from "@emotion/css";
export const peakWidth = 50;
export const defaultWidth = 200;
export const defaultHeight = 30;

export interface Sheet {
  colSize: number,
  rowSize: number,
};

export interface Col {
  key: string,
  index: number,
  left: number,
  width: number,
  height: number,
};

export interface Row {
  key: string,
  index: number,
  top: number,
  height: number,
  width: number,
}

export interface Cell {
  key: string,
  col: number,
  row: number,
  colSize: number,
  rowSize: number,
  left: number,
  top: number,
  width: number,
  height: number,
};

const SheetApi = {

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
