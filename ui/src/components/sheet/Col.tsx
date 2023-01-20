import { forwardRef } from "react";
import { Col as ColData } from "./SheetApi";
import EventBus, { EventType, SheetColsWidthUpdate } from "../common/EventBus";
import { useEffect } from "react";
import { useCallback } from "react";

export interface ColProps {
  data: ColData,
};

const Col = forwardRef((props: ColProps, ref: any) => {

  const onSheetColWidthUpdate = useCallback((e: SheetColsWidthUpdate) => {
    console.log(`Col: on: cols width update: ${JSON.stringify(e)}`);
  }, [props.data]);

  useEffect(() => {
    EventBus.on('sheet.cols.width.update', onSheetColWidthUpdate);

    return () => {
      EventBus.remove('sheet.cols.width.update', onSheetColWidthUpdate);
    };
  }, []);

  return (
    <div ref={ref}>
      <div
        className='sheet-col-header'
        style={{
          top: 0,
          left: props.data.left,
          width: props.data.width,
          height: 30,
        }}>{props.data.col}</div>
      <div
        className='sheet-col'
        style={{
          top: 0,
          left: props.data.left,
          bottom: 0,
        }}></div>
    </div>
  );
});

export default Col;
