import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import Cells from "./Cells";
import { 
  Cell as CellData,
  Sheet as SheetData,
  Col as ColData,
  Row as RowData } from "./SheetApi";
import SheetApi from "./SheetApi";
import Cols from "./Cols";
import Rows from "./Rows";

export interface SheetContentProps {};

const SheetContent = forwardRef((props: SheetContentProps, ref: any) => {

  // __________ state __________

  const [cells, setCells] = useState<CellData[]>([]);
  const [rows, setRows] = useState<RowData[]>([]);
  const [cols, setCols] = useState<ColData[]>([]);

  // __________ life cycle __________

  useEffect(() => {
    const sheet = { colSize: 2, rowSize: 2 } as SheetData;
    const cells = SheetApi.makeCells(sheet);
    const rows = SheetApi.makeRows(sheet);
    const cols = SheetApi.makeCols(sheet);
    setCells(cells);
    setRows(rows);
    setCols(cols);
  }, []);

  // __________ api __________

  useImperativeHandle(ref, () => ({
    api: () => { console.log('sheet content api') },
  }));

  // __________ ui __________

  return (
    <div>
      <Cells data={cells} />
      <Rows data={rows} />
      <Cols data={cols} />
    </div>
  );
});

export default SheetContent;
