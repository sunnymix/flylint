import { useCallback, useEffect, useState } from "react";
import LocalStore from "@/components/common/LocalStore";
import SheetApi, {
  Sheet as SheetData,
  Col as ColData,
  Row as RowData,
  Cell as CellData,
  SelectedCell,
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
    SheetApi.getSheet(sheet, (newSheet: SheetData|null) => {
      if (!newSheet) return;
      setCols(newSheet.cols);
      setRows(newSheet.rows);
      setCells(newSheet.cells);
    });

  }, [sheet]);

  /* __________ api: cols: add __________ */

  const addCols = (sheet: string, cols: ColData[],e: SheetColsAdd) => {
    console.log(`SheetModel: addCols: cols: ${JSON.stringify(cols)}`);
    const newCols = SheetApi.addCols(sheet, cols, e);
    setCols(newCols);
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
