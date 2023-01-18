import { forwardRef, useState } from "react";
import SheetPop from "./SheetPop";

import { Sheet as SheetData } from "./SheetApi";

export interface PeakProps {
  data: SheetData,
};

const Peak = forwardRef((props: PeakProps, ref: any) => {

  return (
    <div className='sheet-peak' ref={ref}>
      <SheetPop />
    </div>
  );
});

export default Peak;
