import { useCallback, useEffect, useState } from "react";
import LocalStore from "@/components/common/LocalStore";
import SheetApi, {
  Sheet as SheetData,
  Col as ColData,
  Row as RowData,
  Cell as CellData,
  SelectedCell,
  defaultWidth,
  defaultHeight,
} from "@/components/sheet/SheetApi";
import { SheetColsAdd, SheetRowsAdd } from "@/components/common/EventBus";

const SheetModel = () => {

  /* __________ state __________ */
  
  const [sheet, setSheet] = useState<string|null>(null);
  const [cols, setCols] = useState<ColData[]>([]);
  const [rows, setRows] = useState<RowData[]>([]);
  const [cells, setCells] = useState<CellData[]>([]);
  const [cell, setCell] = useState<SelectedCell|null>(null);

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
    console.log(`SheetModel: addCols: cols: ${JSON.stringify(cols)}`);
    let afterCol = e.col || 0;
    afterCol = (afterCol > 0 && e.at == 'before') ? (afterCol - 1) : afterCol;
    const size = e.size || 0;
    const width = defaultWidth;
    const newCols = SheetApi.addCols(sheet, cols, afterCol, size, width);
    setCols(newCols);

    // SheetApi.addServerCol(sheet, byCol, size, width, (success: boolean) => {
    //   if (!success) return alert('ERROR');
    //   const newCols = SheetApi.addCols(sheet, cols, e);
    //   setCols(newCols);
    // });
  };

  /* __________ api: rows: add __________ */

  const addRows = (sheet: string, rows: RowData[], e: SheetRowsAdd) => {
    console.log(`SheetModel: addRows: rows: ${JSON.stringify(rows)}`);
    let afterRow = e.row || 0;
    afterRow = (afterRow > 0 && e.at == 'before') ? (afterRow - 1) : afterRow;
    const size = e.size || 0;
    const height = defaultHeight;
    const newRows: RowData[] = SheetApi.addRows(sheet, rows, afterRow, size, height);
    setRows(newRows);
  };

  /* __________ export __________ */

  return {
    sheet,
    selectSheet,
    cols,
    addCols,
    rows,
    addRows,
    cells,
    cell,
  };
};

export default SheetModel;
