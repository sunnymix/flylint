import { forwardRef, useImperativeHandle, useState } from "react";
import SheetBody from "./SheetBody";
import './SheetStyle.css';
import { BasicWiki } from "../wiki/WikiModel";
import { Sheet as SheetData } from "./SheetApi";

export interface SheetProps {
  data: BasicWiki,
};

const Sheet = forwardRef((props: SheetProps, ref: any) => {

  // console.log(`Sheet: render: ${props.data.id},${props.data.name},${props.data.title}`);

  // __________ state __________

  const data: SheetData = {
    sheet: props.data.name,
    colSize: 6,
    rowSize: 6,
  };

  // __________ api __________

  useImperativeHandle(ref, () => ({
    api: () => { console.log('empty api') },
  }));

  // __________ ui __________

  return (
    <div className='sheet' ref={ref}>
      <div>
        <SheetBody data={data} />
      </div>
    </div>
  );
});

export default Sheet;
