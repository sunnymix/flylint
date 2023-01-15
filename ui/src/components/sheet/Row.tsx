import { forwardRef } from "react";
import { Row as RowData } from "./SheetApi";

export interface RowProps {
  sheet: string,
  data: RowData,
};

const Row = forwardRef((props: RowProps, ref: any) => {
  
  return (
    <div>
      <div
        className='sheet-row-header'
        style={{
          left: 0,
          top: props.data.top,
          width: 50,
          height: props.data.height,
        }}>{props.data.index}</div>
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
