import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Cell as CellData } from "./SheetApi";
import Editor from "../editor/Editor";
import SheetApi from "./SheetApi";

export interface CellProps {
  sheet: string,
  data: CellData,
};

const Cell = forwardRef((props: CellProps, ref: any) => {

  // __________ state __________

  const [isFoucs, setIsFocus] = useState<boolean>(false);

  // __________ ref __________

  const editorRef = useRef<any>();

  // __________ effect __________

  useEffect(() => {
    if (!props.sheet || !props.data.col || !props.data.row) return;
    
    SheetApi.getCellData(props.sheet, props.data.col, props.data.row, (data: CellData|null) => {
      
      if (!data) return;
      
      setTimeout(() => {
        editorRef?.current?.setContent(data.content);
      }, 1);
    });

  }, [props.sheet, props.data.col, props.data.row]);

  // __________ event __________

  const onRootClick = (e: any) => {
    if (!isFoucs) {
      editorRef?.current?.focus(0);
    }
  };

  const onEditorFocus = () => {
    setTimeout(() => {
      setIsFocus(true);
    }, 1);
  };

  const onEditorBlur = () => {
    setIsFocus(false);
  };

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
      }}
      onClick={onRootClick}>
      <Editor
        ref={editorRef}
        className='sheet-cell-editor'
        id={`${props.sheet}-${props.data.col}-${props.data.row}`}
        type='cell'
        onFocus={onEditorFocus}
        onBlur={onEditorBlur}
        style={{
          width: props.data.width,
          minHeight: props.data.height,
        }} />
    </div>
  );
});

export default Cell;
