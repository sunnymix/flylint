import { forwardRef } from "react";
import { Col as ColData } from "./SheetApi";
import Col from "./Col";

export interface ColsProps {
  sheet: string,
  data: ColData[],
};

const Cols = forwardRef((props: ColsProps, ref: any) => {

  return (
    <div className='sheet-cols'>
      {props.data.map((data: ColData) => 
        <Col key={data.key} sheet={props.sheet} data={data} />)}
    </div>
  );
});

export default Cols;
