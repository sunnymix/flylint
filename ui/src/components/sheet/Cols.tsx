import { forwardRef, useEffect, useState } from "react";
import {
  Sheet as SheetData,
  Col as ColData, } from "./SheetApi";
import Col from "./Col";
import SheetApi from "./SheetApi";
import EventBus, { EventData, EventType, SheetAt, SheetColsAdd } from "../common/EventBus";
import { useCallback } from "react";

export interface ColsProps {
  sheet: SheetData,
};

const Cols = forwardRef((props: ColsProps, ref: any) => {

  const [cols, setCols] = useState<ColData[]>(props.sheet.cols);

  const bindEvents = () => {
    EventBus.on('sheet.cols.add', onSheetColsAdd);
    EventBus.on('sheet.cols.delete', onSheetColsDelete);
  };

  const unbindEvents = () => {
    EventBus.remove('sheet.cols.add', onSheetColsAdd);
    EventBus.remove('sheet.cols.delete', onSheetColsDelete);
  };

  useEffect(() => {
    bindEvents();

    return () => {
      unbindEvents();
    };
  }, []);

  const onSheetColsAdd = (e: SheetColsAdd) => {
    console.log(`sheet.cols.add: ${JSON.stringify(e)}`);
    // peak:
    if (e.col == 0 && e.row == 0) return addColsByPeak(e.at, e.size);
  };

  const addColsByPeak = (at?: SheetAt, size?: number) => {
    if (!at || (at != 'before' && at != 'after')) return;
    if (!size || size < 1) return;
    if (at == 'before') return addBeforeAllCols(size);
    if (at == 'after') return addAfterAllCols(size);
  };

  const addBeforeAllCols = (size: number) => {
    const newCols: ColData[] = [];
    for (var i = 1; i <= size; i++) {
      newCols.push({
        sheet: props.sheet.sheet,
        col: i,
        left: (i - 1) * SheetApi.defaultWidth,
        width: SheetApi.defaultWidth,
      } as ColData);
    }
    for (var i = 1; i <= cols.length; i++) {
      const col = cols[i - 1];
      col.col = size + i;
      col.left = (col.col - 1) * SheetApi.defaultWidth;
      newCols.push(col);
    }
    console.log(`Cols: add before all cols: ${JSON.stringify(newCols)}`);
    setCols(newCols);
  };

  useEffect(() => {
    console.log(`Cols: cols update: ${JSON.stringify(cols)}`);
  }, [cols]);

  const addAfterAllCols = (size: number) => {
    
  };

  const onSheetColsDelete = (e: EventData) => {
    console.log(`sheet.cols.delete: ${JSON.stringify(e)}`);
  };

  return (
    <div 
      className='sheet-cols'
      ref={ref}
      style={{top: 0, left: SheetApi.peakWidth, height: cols.length * SheetApi.defaultHeight}}
      >
      {cols.map((col: ColData) => 
        <Col key={`${col.col}`} data={col} />)}
    </div>
  );
});

export default Cols;
