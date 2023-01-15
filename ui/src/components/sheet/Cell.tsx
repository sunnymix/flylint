import React, { forwardRef, useEffect, useState } from "react";
import { Cell as CellData } from "./SheetApi";
import Editor from "../editor/Editor";

export interface CellProps {
  data: CellData,
};

const Cell = forwardRef((props: CellProps, ref: any) => {

  // __________ state __________

  const [left, setLeft] = useState<number>(0);
  const [top, setTop] = useState<number>(0);
  const [isFoucs, setIsFocus] = useState<boolean>(false);

  // __________ effect __________

  // __________ event __________

  // __________ api __________
  
  // __________ ui __________

  return (
    <div
      className={`sheet-cell ${isFoucs ? 'active' : ''}`}
      style={{
        left: props.data.left,
        top: props.data.top,
        width: props.data.width,
        height: props.data.height,
      }}>
      <Editor
          className='sheet-cell-editor'
          name={null}
          type='cell'
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          style={{
            width: props.data.width,
            minHeight: props.data.height,
          }} />
    </div>
  );
});

export default Cell;
