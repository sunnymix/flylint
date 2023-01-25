import React, { forwardRef, useCallback } from "react";
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
} from "./SheetApi";

/* __________ sheet __________ */

export const SheetView = () => {
  const {cols, rows} = useModel('sheet', m => ({cols: m.cols, rows: m.rows}));
  const width = SheetApi.calcSheetWidth(cols);
  const height = SheetApi.calcSheetHeight(rows);
  return (
    <div className='sheet' style={{width, height}}>
      <Border />
      <Peak />
      <Cols />
      <Rows />
      <Cells />
    </div>
  );
};

export default SheetView;

/* __________ border __________ */

const Border = () => {
  return (
    <div className='sheet-border'>
      <div className='sheet-border-horizontal'></div>
      <div className='sheet-border-vertical'></div>
    </div>
  );
};

/* __________ peak __________ */

const Peak = () => {
  const {sheet} = useModel('sheet', m => ({sheet: m.sheet}));
  return (
    <div className='sheet-peak' style={{width: peakWidth, height: peakHeight}}>
      <SheetPop col={0} row={0} />
    </div>
  );
};

/* __________ cols __________ */

const Cols = () => {
  const {cols, rows} = useModel('sheet', m => ({cols: m.cols, rows: m.rows}));
  const sheetHeight = SheetApi.calcSheetHeight(rows);
  return (
    <div className='sheet-cols' style={{left: peakWidth, height: sheetHeight}}>
      {cols.map((col: ColData) => <Col key={`${col.col}`} col={col} />)}
    </div>
  );
};

/* __________ col __________ */

const Col = (props: {col: ColData}) => {
  const {col} = props;
  return (
    <div className='sheet-col'>
      <div className='sheet-col-header' style={{height: peakHeight, left: col.left, width: col.width}}>
        {col.col}
        <SheetPop col={col.col} row={0} />
      </div>
      <div className='sheet-col-line' style={{left: col.left}}></div>
    </div>
  );
};

/* __________ rows __________ */

const Rows = () => {
  const {rows, cols} = useModel('sheet', m => ({rows: m.rows, cols: m.cols}));
  const sheetWidth = SheetApi.calcSheetWidth(cols);
  return (
    <div className='sheet-rows' style={{top: peakHeight, width: sheetWidth}}>
      {rows.map((row: RowData) => <Row key={`${row.row}`} row={row} />)}
    </div>
  );
};

/* __________ row __________ */

const Row = (props: {row: RowData}) => {
  const {row} = props;
  return (
    <div className='sheet-row'>
      <div className='sheet-row-header' style={{top: row.top, height: row.height, width: peakWidth}}>
        {row.row}
        <SheetPop col={0} row={row.row} />
      </div>
      <div className='sheet-row-line' style={{top: row.top}}></div>
    </div>
  );
};

/* __________ cells __________ */

const Cells = () => {
  const {
    cells, cols, rows, curCell,
    leftGap, topGap, updateCursorAndCurCell 
  } = useModel('sheet', m => ({
    cells: m.cells, cols: m.cols, rows: m.rows, curCell: m.curCell,
    leftGap: m.leftGap, topGap: m.topGap, updateCursorAndCurCell: m.updateCursorAndCurCell
  }));
  const cellsWidth = SheetApi.calcSheetWidth(cols, true);
  const cellsHeight = SheetApi.calcSheetHeight(rows, true);
  const onClick = useCallback((e: React.MouseEvent) => {
    const left = e.clientX - leftGap - peakWidth;
    const top = e.clientY - topGap - peakHeight;
    if (!left || !top) return;
    const cursor = {left, top} as CursorData;
    updateCursorAndCurCell(cursor, cols, rows);
  }, [cols, rows, leftGap, topGap]);
  return (
    <div className='sheet-cells' onClick={onClick} style={{left: peakWidth, top: peakHeight, width: cellsWidth, height: cellsHeight}}>
      <CurCell />
      {cells.map((cell: CellData) => <Cell key={`${cell.col}-${cell.row}`} cell={cell} />)}
    </div>
  );
};

/* __________ cur cell __________ */

const CurCell = () => {
  const {curCell} = useModel('sheet', m => ({curCell: m.curCell}));
  if (!curCell) return <></>;
  const left = curCell.left;
  const top = curCell.top;
  const width = curCell.width + 1;
  const height = curCell.height + 1;
  return (
    <div className='sheet-cells-cur-cell' style={{left, top, width, height}}></div>
  );
};

/* __________ cell __________ */

const Cell = (props: {cell: CellData}) => {
  const {cell} = props;
  const {cols, rows} = useModel('sheet', m => ({cols: m.cols, rows: m.rows}));
  const {left, top, width, height} = SheetApi.calcCellRect(cell.col, cell.row, cols, rows);
  return (
    <div className='sheet-cell' style={{left, top, width, height}}>Cell</div>
  );
};
