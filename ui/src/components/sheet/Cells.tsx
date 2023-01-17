import { forwardRef, useEffect, useState } from "react";
import { Cell as CellData } from "./SheetApi";
import Cell from "./Cell";
import { BasicWiki } from "../wiki/WikiModel";
import SheetApi from "./SheetApi";
import { Sheet as SheetData } from "./SheetApi";

export interface CellsProps {
  data: SheetData,
};

const Cells = forwardRef((props: CellsProps, ref: any) => {

  const [data, setData] = useState<CellData[]>([]);

  useEffect(() => {
    const data = SheetApi.makeCells(props.data);
    setData(data);
  }, [props.data]);

  return (
    <div className='sheet-cells'>
      {data.map((data: CellData) => 
        <Cell key={data.key} data={data} />)}
    </div>
  );
});

export default Cells;
