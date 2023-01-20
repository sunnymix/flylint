import { forwardRef, useEffect, useState } from "react";
import { Row as RowData } from "./SheetApi";
import Row from "./Row";
import { Sheet as SheetData } from "./SheetApi";
import SheetApi from "./SheetApi";

export interface RowsProps {
  sheet: SheetData,
};

const Rows = forwardRef((props: RowsProps, ref: any) => {

  const [rows, setRows] = useState<RowData[]>([]);

  useEffect(() => {
    if (!props.sheet) return;
    const rows = SheetApi.makeRows(props.sheet);
    setRows(rows);
  }, [props.sheet]);

  return (
    <div
      className='sheet-rows'
      ref={ref}
      style={{left: 0, top: SheetApi.defaultHeight, width: rows.length * SheetApi.defaultWidth}}
      >
      {rows.map((row: RowData) =>
        <Row key={`${row.row}`} data={row} />)}
    </div>
  );
});

export default Rows;
