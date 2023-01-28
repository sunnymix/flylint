import { useAppSelector, useAppDispatch } from '@/hook/hook';
import sheetSlice, { fetchSheet } from '@/components/sheet/sheetSlice';
import { useCallback, useEffect } from 'react';
import SheetPop from "./SheetPop";
import Text from '../text/Text';
import CellEditor from '../editor/CellEditor';
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
} from './SheetApi';

const {selectCell, updateCell} = sheetSlice.actions;

/* __________ sheet __________ */

export default function Sheet(props: {sheet: string}) {
  const {sheet} = props;
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchSheet(sheet));
  }, [sheet]);
  const {cols, rows} = useAppSelector(s => ({cols: s.sheet.cols, rows: s.sheet.rows}));
  const width = SheetApi.calcSheetWidth(cols);
  const height = SheetApi.calcSheetHeight(rows);
  return (
    <div className='sheet' style={{width, height}}>
      <Border sheet={sheet} width={width} height={height} />
      <Peak sheet={sheet} />
      <Cols sheet={sheet} />
      <Rows sheet={sheet} />
      <Cells sheet={sheet} />
      <CurEditor />
    </div>
  );
};

/* __________ border __________ */

function Border (props: {sheet: string, width: number, height: number, color?: string}) {
  const {width, height, color} = props;
  const backgroundColor = color || '#ddd';
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

const Peak = (props: {sheet: string}) => {
  const {sheet} = props;
  return (
    <div className='sheet-peak sheet-pop-outer' style={{width: peakWidth, height: peakHeight}}>
      <SheetPop sheet={sheet} col={0} row={0} />
    </div>
  );
};

/* __________ cols __________ */

const Cols = (props: {sheet: string}) => {
  const {sheet} = props;
  const {cols, rows} = useAppSelector(s => ({cols: s.sheet.cols, rows: s.sheet.rows}));
  const sheetHeight = SheetApi.calcSheetHeight(rows);
  return (
    <div className='sheet-cols' style={{left: peakWidth, height: sheetHeight}}>
      {cols.map((col: ColData) => <Col sheet={sheet} key={`${col.col}`} col={col} />)}
    </div>
  );
};

/* __________ col __________ */

const Col = (props: {sheet: string, col: ColData}) => {
  const {sheet, col} = props;
  return (
    <div className='sheet-col'>
      <div className='sheet-col-header sheet-pop-outer' style={{height: peakHeight, left: col.left, width: col.width}}>
        <div className='sheet-header-title'>
          {col.col}
          <SheetPop sheet={sheet} col={col.col} row={0} />
        </div>
      </div>
      <div className='sheet-col-line' style={{left: col.left}}></div>
    </div>
  );
};

/* __________ rows __________ */

const Rows = (props: {sheet: string}) => {
  const {sheet} = props;
  const {cols, rows} = useAppSelector(s => ({cols: s.sheet.cols, rows: s.sheet.rows}));
  const sheetWidth = SheetApi.calcSheetWidth(cols);
  return (
    <div className='sheet-rows' style={{top: peakHeight, width: sheetWidth}}>
      {rows.map((row: RowData) => <Row sheet={sheet} key={`${row.row}`} row={row} />)}
    </div>
  );
};

/* __________ row __________ */

const Row = (props: {sheet: string, row: RowData}) => {
  const {sheet, row} = props;
  return (
    <div className='sheet-row'>
      <div className='sheet-row-header sheet-pop-outer' style={{top: row.top, height: row.height, width: peakWidth}}>
        <div className='sheet-header-title'>
          {row.row}
          <SheetPop sheet={sheet} col={0} row={row.row} />
        </div>
      </div>
      <div className='sheet-row-line' style={{top: row.top}}></div>
    </div>
  );
};

/* __________ cells __________ */

const Cells = (props: {sheet: string}) => {
  const {sheet} = props;
  const {cols, rows, cells} = useAppSelector(s => ({cols: s.sheet.cols, rows: s.sheet.rows, cells: s.sheet.cells}));
  const cellsWidth = SheetApi.calcSheetWidth(cols, true);
  const cellsHeight = SheetApi.calcSheetHeight(rows, true);
  // console.log(`| Sheet | Cells : `, cells);
  return (
    <div className='sheet-cells' style={{left: peakWidth, top: peakHeight, width: cellsWidth, height: cellsHeight}}>
      {cells.map((cell: CellData) => <Cell sheet={sheet} key={`${cell.col}-${cell.row}`} cell={cell} />)}
    </div>
  );
};

/* __________ cell __________ */

const Cell = (props: {sheet: string, cell: CellData}) => {
  const dispatch = useAppDispatch();
  const {sheet, cell} = props;
  const rect = cell ? (cell as Rect) : Rect0;
  const onClick = useCallback((e: React.MouseEvent) => {
    dispatch(selectCell(cell));
  }, [cell]);
  // console.log(`| Sheet | Cell : `, cell);
  return (
    <div className='sheet-cell' onClick={onClick} style={{...rect}}>
      <Text cell={cell} />
    </div>
  );
};

/* __________ cell eidtor __________ */

const CurEditor = () => {
  const dispatch = useAppDispatch();
  const {curCell} = useAppSelector(s => ({curCell: s.sheet.curCell}));
  const rect = curCell ? (curCell as Rect) : Rect0;
  const onEditorChange = async (cell: CellData, content: string) => {
    const success = await SheetApi.postCellContent(cell.sheet, cell.col, cell.row, content);
    if (success) dispatch(updateCell({cell, newCell: {content} as CellData}));
  };
  const onEditorFocus = useCallback(() => {}, []);
  const onEditorBlur = useCallback((cell: CellData, content: string) => {}, []);
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
