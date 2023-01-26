import React, { forwardRef, useCallback, useState } from "react";
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
import Text from "../text/Text";

/* __________ sheet __________ */

export const SheetView = () => {
  const {cols, rows} = useModel('sheet', m => ({cols: m.cols, rows: m.rows}));
  const width = SheetApi.calcSheetWidth(cols);
  const height = SheetApi.calcSheetHeight(rows);
  console.log(`Sheet: render`);
  return (
    <div className='sheet' style={{width, height}}>
      <Border width={width} height={height} />
      <Peak />
      <Cols />
      <Rows />
      <Cells />
    </div>
  );
};
export default SheetView;

/* __________ border __________ */

const Border = (props: {width: number, height: number, color?: string}) => {
  const {width, height, color} = props;
  const backgroundColor = color || '#ddd';
  // console.log(`Border: render`);
  return (
    <div className='border'>
      <div className='border-left' style={{height, backgroundColor}}></div>
      <div className='border-right' style={{height, left: width, backgroundColor}}></div>
      <div className='border-top' style={{width, backgroundColor}}></div>
      <div className='border-bottom' style={{width, top: height, backgroundColor}}></div>
    </div>
  );
};

/* __________ peak __________ */

const Peak = () => {
  const {sheet} = useModel('sheet', m => ({sheet: m.sheet}));
  // console.log(`Peak: render`);
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
  // console.log(`Cols: render`);
  return (
    <div className='sheet-cols' style={{left: peakWidth, height: sheetHeight}}>
      {cols.map((col: ColData) => <Col key={`${col.col}`} col={col} />)}
    </div>
  );
};

/* __________ col __________ */

const Col = (props: {col: ColData}) => {
  const {col} = props;
  // console.log(`Col: render`);
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
  // console.log(`Rows: render`);
  return (
    <div className='sheet-rows' style={{top: peakHeight, width: sheetWidth}}>
      {rows.map((row: RowData) => <Row key={`${row.row}`} row={row} />)}
    </div>
  );
};

/* __________ row __________ */

const Row = (props: {row: RowData}) => {
  const {row} = props;
  // console.log(`Row: render`);
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
  console.log(`Cells: render`);
  const {
    cells, cols, rows,
  } = useModel('sheet', m => ({
    cells: m.cells, cols: m.cols, rows: m.rows,
  }));
  const cellsWidth = SheetApi.calcSheetWidth(cols, true);
  const cellsHeight = SheetApi.calcSheetHeight(rows, true);
  return (
    <div className='sheet-cells' style={{left: peakWidth, top: peakHeight, width: cellsWidth, height: cellsHeight}}>
      {cells.map((cell: CellData) => <Cell key={`${cell.col}-${cell.row}`} cell={cell} />)}
    </div>
  );
};

/* __________ cell __________ */

const Cell = (props: {cell: CellData}) => {
  const {setCurCell} = useModel('sheet', m => ({setCurCell: m.setCurCell}));
  const {cell} = props;
  const {cols, rows} = useModel('sheet', m => ({cols: m.cols, rows: m.rows}));
  const {left, top, width, height} = SheetApi.calcCellRect(cell.col, cell.row, cols, rows);
  const onClick = useCallback((e: React.MouseEvent) => {
    setCurCell(cell);
  }, [cell]);
  console.log(`Cell: render`);
  return (
    <div className='sheet-cell' onClick={onClick} style={{left, top, width, height}}>
      <Text content={cell.content} />
    </div>
  );
};

/* __________ cur cell __________ */

const CurCell = () => {
  return <></>;
  // const {curCell} = useModel('sheet', m => ({curCell: m.curCell}));
  // if (!curCell) return <></>;
  // const left = curCell.left + peakWidth, top = curCell.top + peakHeight, width = curCell.width, height = curCell.height;
  // console.log(`CurCell: render`);
  // return (
  //   <div className='sheet-cells-cur-cell' style={{left, top}}>
  //     <Border width={width} height={height} color='#1890ff' />
  //   </div>
  // );
};
