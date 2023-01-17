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
import { BasicWiki } from "../wiki/WikiModel";

export interface SheetBodyProps {
  data: SheetData,
};

const SheetBody = forwardRef((props: SheetBodyProps, ref: any) => {

  // __________ state __________

  const [cells, setCells] = useState<CellData[]>([]);
  const [rows, setRows] = useState<RowData[]>([]);
  const [cols, setCols] = useState<ColData[]>([]);

  // __________ life cycle __________

  useEffect(() => {
    const sheet = { colSize: 6, rowSize: 6 } as SheetData;
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
      <Peak data={props.data} />
      <Cells data={props.data} />
      <Cols data={props.data} />
      <Rows data={props.data} />
    </div>
  );
});

export default SheetBody;
