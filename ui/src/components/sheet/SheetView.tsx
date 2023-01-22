import { forwardRef } from "react";
import { useModel } from "umi";
import './SheetStyle.css';
import SheetPop from "./SheetPop";
import { Col as ColData } from "./SheetApi";


const Peak = () => {
  const {sheet} = useModel('sheet', m => ({sheet: m.sheet}));
  return (
    <div className='sheet-peak'>
      <SheetPop col={0} row={0} />
    </div>
  );
};

const Col = (props: {col: ColData}) => {
  const {col} = props;
  return (
    <div className='sheet-col'>
      <div className='sheet-col-header' style={{left: col.left, width: col.width}}>
        {col.col}
        <SheetPop col={col.col} row={0} />
      </div>
      <div className='sheet-col-line' style={{left: col.left}}></div>
    </div>
  );
};

const Cols = () => {
  const {cols, rows} = useModel('sheet', m => ({cols: m.cols, rows: m.rows}));
  return (
    <div className='sheet-cols' style={{height: (30 + rows.length * 30)}}>
      {cols.map((col: ColData) => <Col key={`${col.col}`} col={col} />)}
    </div>
  );
};

const SheetView = () => {
  return (
    <div className='sheet'>
      <Peak />
      <Cols />
    </div>
  );
};

export default SheetView;
