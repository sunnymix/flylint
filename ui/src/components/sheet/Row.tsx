import { forwardRef } from "react";
import { Row as RowData } from "./SheetApi";

export interface RowProps {
  data: RowData,
};

const Row = forwardRef((props: RowProps, ref: any) => {
  
  return (
    <div
      className='sheet-row'
      style={{
        left: 0,
        top: props.data.top,
        width: props.data.width,
        height: props.data.height,
      }}></div>
  );
});

export default Row;
