import { forwardRef, useEffect, useState } from "react";
import { Row as RowData } from "./SheetApi";
import Row from "./Row";
import { Sheet as SheetData } from "./SheetApi";
import SheetApi from "./SheetApi";

export interface RowsProps {
  data: SheetData,
};

const Rows = forwardRef((props: RowsProps, ref: any) => {

  const [data, setData] = useState<RowData[]>([]);

  useEffect(() => {
    if (!props.data) return;
    const data = SheetApi.makeRows(props.data);
    setData(data);
  }, [props.data]);

  return (
    <div className='sheet-rows' ref={ref}>
      {data.map((data: RowData) =>
        <Row key={`${data.row}`} data={data} />)}
    </div>
  );
});

export default Rows;
