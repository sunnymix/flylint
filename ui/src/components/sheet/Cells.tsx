import { forwardRef } from "react";
import { Cell as CellData } from "./SheetApi";
import Cell from "./Cell";

export interface CellsProps {
  sheet: string,
  data: CellData[],
};

const Cells = forwardRef((props: CellsProps, ref: any) => {

  return (
    <div className='sheet-cells'>
      {props.data.map((data: CellData) => 
        <Cell key={data.key} sheet={props.sheet} data={data} />)}
    </div>
  );
});

export default Cells;
