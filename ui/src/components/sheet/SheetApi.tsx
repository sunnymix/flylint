import { sheet } from "@emotion/css";

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
        top: r * 30,
        height: 30,
        width: 50 + sheet.colSize * 100,
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
        left: (c - 1) * 100,
        width: 100,
        height: (sheet.rowSize + 1) * 30,
      } as Col);
    }
    return cols;
  },

  makeCells: (sheet: Sheet) => {
    const cells: Cell[] = [];
    for (var r = 1; r <= sheet.rowSize; r++) {
      for (var c = 1; c <= sheet.colSize; c++) {
        const left = (c - 1) * 100 + 50;
        const top = (r - 1) * 30 + 30;

        cells.push({
          key: `${c}-${r}`,
          col: c,
          row: r,
          colSize: 1,
          rowSize: 1,
          left: left,
          top: top,
          width: 100,
          height: 30,
        });
      }
    }
    return cells;
  },

};

export default SheetApi;
