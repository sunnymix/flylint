import { forwardRef, useState } from "react";
import SheetPop from "./SheetPop";

import { Sheet as SheetData } from "./SheetApi";

export interface PeakProps {
  data: SheetData,
};

const Peak = forwardRef((props: PeakProps, ref: any) => {

  return (
    <div className='sheet-peak' ref={ref}>
      <SheetPop col={0} row={0} />
    </div>
  );
});

export default Peak;
