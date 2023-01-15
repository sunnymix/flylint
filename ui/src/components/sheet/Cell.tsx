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

  const [isFoucsed, setIsFocused] = useState<boolean>(false);

  // __________ ref __________

  const editorRef = useRef<any>();

  // __________ effect __________

  useEffect(() => {
    if (!props.sheet || !props.data.col || !props.data.row) return;
    
    SheetApi.getCell(props.sheet, props.data.col, props.data.row, (data: CellData|null) => {
      if (!data) return;
      setTimeout(() => {
        editorRef?.current?.setContent(data.content);
      }, 1);
    });

  }, [props.sheet, props.data.col, props.data.row]);

  // __________ event __________

  const onRootClick = (e: any) => {
    if (!isFoucsed) {
      // editorRef?.current?.focus(0);
    }
  };

  const onEditorFocus = () => {
    setIsFocused(true);
    editorRef?.current?.tryFocus();
  };

  const onEditorBlur = () => {
    setIsFocused(false);
  };

  const onEditorChange = (isInit: boolean, isAstChange: boolean, content: string) => {
    if (isInit || !isAstChange) return;
    SheetApi.saveCellContent(props.sheet, props.data.col, props.data.row, content, (success: boolean) => {
      if (!success) console.log(`ERROR: cannot save cell content (sheet=${props.sheet},col=${props.data.col},row=${props.data.row})`);
    });
  };

  // __________ api __________
  
  // __________ ui __________

  return (
    <div
      className={`sheet-cell ${isFoucsed ? 'active' : ''}`}
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
        onChange={onEditorChange}
        style={{
          width: props.data.width,
          minHeight: props.data.height,
        }} />
    </div>
  );
});

export default Cell;
