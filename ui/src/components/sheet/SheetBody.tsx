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
import Peak from "./Peak";

export interface SheetBodyProps {
  sheet: string,
};

const SheetBody = forwardRef((props: SheetBodyProps, ref: any) => {

  // __________ state __________

  const [cells, setCells] = useState<CellData[]>([]);
  const [rows, setRows] = useState<RowData[]>([]);
  const [cols, setCols] = useState<ColData[]>([]);

  // __________ life cycle __________

  useEffect(() => {
    const sheet = { colSize: 5, rowSize: 5 } as SheetData;
    const cells = SheetApi.makeCells(sheet);
    const rows = SheetApi.makeRows(sheet);
    const cols = SheetApi.makeCols(sheet);
    setCells(cells);
    setRows(rows);
    setCols(cols);
  }, []);

  // __________ api __________

  useImperativeHandle(ref, () => ({
    api: () => { console.log('sheet body api') },
  }));

  // __________ ui __________

  return (
    <div>
      <Peak sheet={props.sheet} />
      <Cells sheet={props.sheet} data={cells} />
      <Cols sheet={props.sheet} data={cols} />
      <Rows sheet={props.sheet} data={rows} />
    </div>
  );
});

export default SheetBody;
