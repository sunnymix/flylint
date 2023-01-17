import { forwardRef, useEffect, useState } from "react";
import {
  Sheet as SheetData,
  Col as ColData, } from "./SheetApi";
import Col from "./Col";
import SheetApi from "./SheetApi";

export interface ColsProps {
  data: SheetData,
};

const Cols = forwardRef((props: ColsProps, ref: any) => {

  const [data, setData] = useState<ColData[]>([]);

  useEffect(() => {
    if (!props.data) return;
    const data = SheetApi.makeCols(props.data);
    setData(data);
  }, [props.data]);

  return (
    <div className='sheet-cols' ref={ref}>
      {data.map((data: ColData) => 
        <Col key={data.key} data={data} />)}
    </div>
  );
});

export default Cols;
