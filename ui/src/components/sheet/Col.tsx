import { forwardRef } from "react";
import { Col as ColData } from "./SheetApi";

export interface ColProps {
  data: ColData,
};

const Col = forwardRef((props: ColProps, ref: any) => {

  return (
    <div ref={ref}>
      <div
        className='sheet-col-header'
        style={{
          top: 0,
          left: 50 + props.data.left,
          width: props.data.width,
          height: 30,
        }}>{props.data.index}</div>
      <div
        className='sheet-col'
        style={{
          top: 0,
          left: 50 + props.data.left,
          height: props.data.height,
        }}></div>
    </div>
  );
});

export default Col;
