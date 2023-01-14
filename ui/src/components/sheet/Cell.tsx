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
      <Editor
          className='sheet-cell-editor'
          name={null}
          type='cell'
          style={{
            zIndex: 100,
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            width: props.data.width,
            minHeight: props.data.height,
            padding: 4
          }} />
    </div>
  );
});

export default Cell;
