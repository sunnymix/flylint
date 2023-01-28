import { useCallback, useEffect, useState } from "react";
import LocalStore from "@/components/common/LocalStore";
import SheetApi, {
  Sheet as SheetData,
  Col as ColData,
  Row as RowData,
  Cell as CellData,
  defaultWidth,
  defaultHeight,
  isSameCell,
} from "@/components/sheet/SheetApi";
import { SheetColsAdd, SheetRowsAdd } from "@/components/common/EventBus";

const SheetModel = () => {

  /* __________ state __________ */
  
  const [leftGap, setleftGap] = useState<number>(0);
  const [topGap, setTopGap] = useState<number>(0);
  const [sheet, setSheet] = useState<string|null>(null);
  const [cols, setCols] = useState<ColData[]>([]);
  const [rows, setRows] = useState<RowData[]>([]);
  const [cells, setCells] = useState<CellData[]>([]);
  const [curCell, setCurCell] = useState<CellData>();

  /* __________ api: sheet: select __________ */

  const selectSheet = useCallback((sheet: string|null) => {
    setSheet(sheet);
  }, []);

  /* __________ effect: sheet: change __________ */

  useEffect(() => {
    if (!sheet) return;
    SheetApi.getServerSheet(sheet, (newSheet: SheetData|null) => {
      if (!newSheet) return;
      setCols(newSheet.cols);
      setRows(newSheet.rows);
      setCells(newSheet.cells);
    });
  }, [sheet]);

  /* __________ api: cols: add __________ */

  const addCols = (sheet: string, cols: ColData[],e: SheetColsAdd) => {
    console.log(`# models | sheet | addCols: cols: `, cols);
    let afterCol = e.col || 0;
    afterCol = (afterCol > 0 && e.at == 'before') ? (afterCol - 1) : afterCol;
    const size = e.size || 0;
    const width = defaultWidth;
    
    SheetApi.addServerCol(sheet, afterCol, size, width, (success: boolean) => {
      if (!success) return alert('ERROR');
      setCurCell(undefined);
      const newCols = SheetApi.addCols(sheet, cols, afterCol, size, width);
      setCols(newCols);
    });
  };

  /* __________ api: rows: add __________ */

  const addRows = (sheet: string, rows: RowData[], e: SheetRowsAdd) => {
    console.log(`# models | sheet | addRows: rows: `, rows);
    let afterRow = e.row || 0;
    afterRow = (afterRow > 0 && e.at == 'before') ? (afterRow - 1) : afterRow;
    const size = e.size || 0;
    const height = defaultHeight;

    SheetApi.addServerRow(sheet, afterRow, size, height, (success: boolean) => {
      if (!success) return alert('ERROR');
      setCurCell(undefined);
      const newRows: RowData[] = SheetApi.addRows(sheet, rows, afterRow, size, height);
      setRows(newRows);
    });
  };

  /* __________ api: cursor & curCell: update __________ */

  const updateCell = (cells: CellData[], cell?: CellData, newCell?: CellData) => {
    console.log(`# models | sheet | updateCell: `, cells, cell, newCell);
    if (!cell || !newCell) return;
    const newCells = cells.map((item: CellData) => {
      if (isSameCell(item, cell)) {
        item.content = newCell.content;
        console.log(`# models | sheet | updateCell | update: `, item);
        return {...item};
      }
      return item;
    });
    setCells(newCells);
  };

  /* cells */

  useEffect(() => {
    // console.log(`# models | sheet | cells | changes: `, cells);
  }, [cells]);

  /* __________ effect: curCell: change __________ */

  useEffect(() => {
    // console.log(`# models | sheet | curCell | change: `, curCell);
  }, [curCell]);

  /* __________ export __________ */

  return {
    leftGap, setleftGap, topGap, setTopGap,
    sheet, selectSheet,
    cols, addCols,
    rows, addRows,
    cells, 
    curCell, setCurCell, updateCell,
  };
};

export default SheetModel;
