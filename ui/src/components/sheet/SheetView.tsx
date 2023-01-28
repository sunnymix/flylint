import React, { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { useModel } from "umi";
import './SheetStyle.css';
import SheetPop from "./SheetPop";
import SheetApi, {
  defaultWidth,
  defaultHeight,
  peakWidth,
  peakHeight,
  Col as ColData,
  Row as RowData,
  Cell as CellData,
  CursorData,
  Rect,
  Rect0,
  isSameCell,
} from "./SheetApi";
import Text from "../text/Text";
import CellEditor from "../editor/CellEditor";

/* __________ sheet __________ */

export const SheetView = () => {
  const {cols, rows} = useModel('sheet', m => ({cols: m.cols, rows: m.rows}));
  const width = SheetApi.calcSheetWidth(cols);
  const height = SheetApi.calcSheetHeight(rows);
  // console.log(`| SheetView | render`);
  return (
    <div className='sheet' style={{width, height}}>
      <Border width={width} height={height} />
      <Peak />
      <Cols />
      <Rows />
      <Cells />
      <CurEditor />
    </div>
  );
};
export default SheetView;

/* __________ border __________ */

const Border = (props: {width: number, height: number, color?: string}) => {
  const {width, height, color} = props;
  const backgroundColor = color || '#ddd';
  // console.log(`| SheetView | Border: render`);
  return (
    <div className='border'>
      <div className='border-top' style={{width, backgroundColor}}></div>
      <div className='border-right' style={{height, left: width, backgroundColor}}></div>
      <div className='border-bottom' style={{width, top: height, backgroundColor}}></div>
      <div className='border-left' style={{height, backgroundColor}}></div>
    </div>
  );
};

/* __________ peak __________ */

const Peak = () => {
  const {sheet} = useModel('sheet', m => ({sheet: m.sheet}));
  // console.log(`| SheetView | Peak: render`);
  return (
    <div className='sheet-peak sheet-pop-outer' style={{width: peakWidth, height: peakHeight}}>
      <SheetPop col={0} row={0} />
    </div>
  );
};

/* __________ cols __________ */

const Cols = () => {
  const {cols, rows} = useModel('sheet', m => ({cols: m.cols, rows: m.rows}));
  const sheetHeight = SheetApi.calcSheetHeight(rows);
  // console.log(`| SheetView | Cols | render`);
  useEffect(() => {
    console.log(`| SheetView | Cols | cols - change: `, cols);
  }, [cols]);
  return (
    <div className='sheet-cols' style={{left: peakWidth, height: sheetHeight}}>
      {cols.map((col: ColData) => <Col key={`${col.col}`} col={col} />)}
    </div>
  );
};

/* __________ col __________ */

const Col = (props: {col: ColData}) => {
  const {col} = props;
  // console.log(`| SheetView | Col | render`);
  return (
    <div className='sheet-col'>
      <div className='sheet-col-header sheet-pop-outer' style={{height: peakHeight, left: col.left, width: col.width}}>
        <div className='sheet-header-title'>
          {col.col}
          <SheetPop col={col.col} row={0} />
        </div>
      </div>
      <div className='sheet-col-line' style={{left: col.left}}></div>
    </div>
  );
};

/* __________ rows __________ */

const Rows = () => {
  const {rows, cols} = useModel('sheet', m => ({rows: m.rows, cols: m.cols}));
  const sheetWidth = SheetApi.calcSheetWidth(cols);
  // console.log(`| SheetView | Rows | render`);
  return (
    <div className='sheet-rows' style={{top: peakHeight, width: sheetWidth}}>
      {rows.map((row: RowData) => <Row key={`${row.row}`} row={row} />)}
    </div>
  );
};

/* __________ row __________ */

const Row = (props: {row: RowData}) => {
  const {row} = props;
  // console.log(`| SheetView | Row | render`);
  return (
    <div className='sheet-row'>
      <div className='sheet-row-header sheet-pop-outer' style={{top: row.top, height: row.height, width: peakWidth}}>
        <div className='sheet-header-title'>
          {row.row}
          <SheetPop col={0} row={row.row} />
        </div>
      </div>
      <div className='sheet-row-line' style={{top: row.top}}></div>
    </div>
  );
};

/* __________ cells __________ */

const Cells = () => {
  const {
    cells, cols, rows,
  } = useModel('sheet', m => ({
    cells: m.cells, cols: m.cols, rows: m.rows,
  }));
  useEffect(() => {
    console.log(`| SheetView | Cells | cells - changes: `, cells);
  }, [cells]);

  const cellsWidth = SheetApi.calcSheetWidth(cols, true);
  const cellsHeight = SheetApi.calcSheetHeight(rows, true);

  console.log(`| SheetView | Cells | render`);
  return (
    <div className='sheet-cells' style={{left: peakWidth, top: peakHeight, width: cellsWidth, height: cellsHeight}}>
      {cells.map((cell: CellData) => <Cell key={`${cell.col}-${cell.row}`} cell={cell} />)}
    </div>
  );
};

/* __________ cell __________ */

const Cell = (props: {cell: CellData}) => {
  const {cells, setCurCell} = useModel('sheet', m => ({cells: m.cells, setCurCell: m.setCurCell}));
  const {cell} = props;
  const rect = cell ? (cell as Rect) : Rect0;
  // const [content, setContent] = useState<string|undefined>(cell.content);
  useEffect(() => {
    console.log(`| SheetView | Cell | effect | cells | change :`, cells);
  }, [cells]);
  const onClick = useCallback((e: React.MouseEvent) => {
    setCurCell(undefined);
    setTimeout(() => setCurCell(cell), 10);
    console.log(`| SheetView | Cell | onClick | cells: `, cells);
  }, [cell, cells]);
  console.log(`| SheetView | Cell | render`);
  return (
    <div className='sheet-cell' onClick={onClick} style={{...rect}}>
      <Text cell={cell} />
    </div>
  );
};

/* __________ cell eidtor __________ */

const CurEditor = () => {
  const {
    cells, curCell, updateCell} = useModel('sheet', m => ({
      cells: m.cells, curCell: m.curCell, updateCell: m.updateCell}));
  const rect = curCell ? (curCell as Rect) : Rect0;
  const onEditorChange = (cell: CellData, content: string) => {
    console.log(`| SheetView | CurEditor | onEditorChange | cell: `, cell);
    // cell.content = content;
    updateCell(cells, cell, {content} as CellData);

    // const theCell = cells.find((item: CellData) => isSameCell(item, cell));
    // if (!theCell) return;
    // theCell.content = content;
    
  };
  const onEditorFocus = useCallback(() => {}, []);
  const onEditorBlur = useCallback(() => {}, []);
  console.log(`| SheetView | CurEditor | render | curCell: `, curCell, cells);
  return (
    <div className='sheet-content-box' style={{left: peakWidth, top: peakHeight}}>
      <div className='sheet-cur-eidtor' style={{...rect}}>
        <CellEditor
          className='sheet-cell-editor'
          cell={curCell}
          onChange={onEditorChange}
          onFocus={onEditorFocus}
          onBlur={onEditorBlur}
          style={{width: rect.width, minHeight: rect.height}} />
      </div>
    </div>
  );
};
