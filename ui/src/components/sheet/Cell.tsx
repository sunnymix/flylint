import { forwardRef, useEffect, useState } from "react";
import { Cell as CellData } from "./SheetApi";

export interface CellProps {
  data: CellData,
};

const Cell = forwardRef((props: CellProps, ref: any) => {

  // __________ state __________

  const [left, setLeft] = useState<number>(0);
  const [top, setTop] = useState<number>(0);

  // __________ effect __________

  // __________ api __________
  
  // __________ ui __________

  return (
    <div
      className='sheet-cell'
      style={{
        left: props.data.left,
        top: props.data.top,
        width: props.data.width,
        height: props.data.height,
      }}>
      {props.data.key}
    </div>
  );
});

export default Cell;
