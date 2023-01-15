import { forwardRef } from "react";
import { Row as RowData } from "./SheetApi";
import Row from "./Row";

export interface RowsProps {
  sheet: string,
  data: RowData[],
};

const Rows = forwardRef((props: RowsProps, ref: any) => {

  return (
    <div className='sheet-rows'>
      {props.data.map((data: RowData) =>
        <Row key={data.key} sheet={props.sheet} data={data} />)}
    </div>
  );
});

export default Rows;
