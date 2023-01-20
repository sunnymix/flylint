import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import Cells from "./Cells";
import { 
  Cell as CellData,
  Sheet as SheetData,
  Col as ColData,
  Row as RowData } from "./SheetApi";
import SheetApi from "./SheetApi";
import Cols from "./Cols";
import Rows from "./Rows";
import Peak from "./Peak";
import { BasicWiki } from "../wiki/WikiModel";

export interface SheetBodyProps {
  data: SheetData,
};

const SheetBody = forwardRef((props: SheetBodyProps, ref: any) => {

  // __________ state __________

  // __________ life cycle __________

  // __________ api __________

  useImperativeHandle(ref, () => ({
    api: () => { console.log('sheet body api') },
  }));

  // __________ ui __________

  return (
    <div ref={ref}>
      <Peak data={props.data} />
      <Cells data={props.data} />
      <Cols sheet={props.data} />
      <Rows sheet={props.data} />
    </div>
  );
});

export default SheetBody;
