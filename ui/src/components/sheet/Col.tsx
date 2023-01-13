import { forwardRef } from "react";
import { Col as ColData } from "./SheetApi";

export interface ColProps {
  data: ColData,
};

const Col = forwardRef((props: ColProps, ref: any) => {

  return (
    <div
      className='sheet-col'
      style={{
        top: 0,
        left: props.data.left,
        width: props.data.width,
        height: props.data.height,
      }}></div>
  );
});

export default Col;
