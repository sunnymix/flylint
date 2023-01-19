import { forwardRef, useEffect, useState } from "react";
import {
  Sheet as SheetData,
  Col as ColData, } from "./SheetApi";
import Col from "./Col";
import SheetApi from "./SheetApi";
import EventBus, { EventType } from "../common/EventBus";
import { useCallback } from "react";

export interface ColsProps {
  data: SheetData,
};

const Cols = forwardRef((props: ColsProps, ref: any) => {

  const [data, setData] = useState<ColData[]>([]);

  useEffect(() => {
    if (!props.data) return;
    const data = SheetApi.makeCols(props.data);
    setData(data);
  }, [props.data]);

  const onSheetColsAdd = useCallback((e: EventType) => {
    console.log(`sheet.cols.add: ${JSON.stringify(e)}`);
  }, []);

  const onSheetColsDelete = useCallback((e: EventType) => {
    console.log(`sheet.cols.delete: ${JSON.stringify(e)}`);
  }, []);

  // __________ event bus __________

  useEffect(() => {
    EventBus.on('sheet.cols.add', onSheetColsAdd);
    EventBus.on('sheet.cols.delete', onSheetColsDelete);

    return () => {
      EventBus.remove('sheet.cols.add', onSheetColsAdd);
      EventBus.remove('sheet.cols.delete', onSheetColsDelete);
    };
  }, []);

  return (
    <div className='sheet-cols' ref={ref}>
      {data.map((data: ColData) => 
        <Col key={`${data.col}`} data={data} />)}
    </div>
  );
});

export default Cols;
