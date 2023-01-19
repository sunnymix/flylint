import { forwardRef } from "react";
import { Row as RowData } from "./SheetApi";

export interface RowProps {
  data: RowData,
};

const Row = forwardRef((props: RowProps, ref: any) => {
  
  return (
    <div ref={ref}>
      <div
        className='sheet-row-header'
        style={{
          left: 0,
          top: props.data.top,
          width: 50,
          height: props.data.height,
        }}>{props.data.row}</div>
      <div
        className='sheet-row'
        style={{
          left: 0,
          top: props.data.top,
          width: props.data.width,
        }}></div>
    </div>
  );
});

export default Row;
