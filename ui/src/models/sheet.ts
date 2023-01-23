import { useCallback, useEffect, useState } from "react";
import LocalStore from "@/components/common/LocalStore";
import SheetApi, {
  Sheet as SheetData,
  Col as ColData,
  Row as RowData,
  Cell as CellData,
  SelectedCell,
  defaultWidth,
} from "@/components/sheet/SheetApi";
import { SheetColsAdd } from "@/components/common/EventBus";

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

  const addRows = (sheet: string, rows: RowData[],e: SheetColsAdd) => {
    console.log(`SheetModel: addRows: rows: ${JSON.stringify(rows)}`);
    const newRows: RowData[] = SheetApi.addRows(sheet, rows, e);
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
