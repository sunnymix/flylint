import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Cell as CellData, SelectedCell } from "./SheetApi";
import CellEditor from "../editor/CellEditor";
import SheetApi from "./SheetApi";
import LocalStore from "../common/LocalStore";

export interface CellProps {
  data: CellData,
};

const Cell = forwardRef((props: CellProps, ref: any) => {

  // __________ state __________

  const selectedCell: SelectedCell = LocalStore.getSheetSelectedCell(props.data.sheet);
  const isSelected = selectedCell && selectedCell.col == props.data.col && selectedCell.row == props.data.row;

  const [isFoucsed, setIsFocused] = useState<boolean>(isSelected);

  // __________ ref __________

  const editorRef = useRef<any>();

  // __________ effect __________

  // __________ event __________

  const onRootClick = (e: any) => {
    // FIXME: use focus event
    LocalStore.setSheetSelectedCell({
      sheet: props.data.sheet,
      col: props.data.col,
      row: props.data.row,
    });
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
    SheetApi.saveServerCellContent(props.data.sheet, props.data.col, props.data.row, content, (success: boolean) => {
      if (!success) console.log(`ERROR: cannot save cell content (sheet=${props.data.sheet},col=${props.data.col},row=${props.data.row})`);
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
      <CellEditor
        className='sheet-cell-editor'
        ref={editorRef}
        data={props.data}
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
