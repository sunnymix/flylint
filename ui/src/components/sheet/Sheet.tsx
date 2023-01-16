import { forwardRef, useImperativeHandle } from "react";
import SheetBody from "./SheetBody";
import './SheetStyle.css';

export interface SheetProps {
  sheet: string,
};

const Sheet = forwardRef((props: SheetProps, ref) => {

  console.log('Sheet render');

  // __________ state __________

  // __________ api __________

  useImperativeHandle(ref, () => ({
    api: () => { console.log('empty api') },
  }));

  // __________ ui __________

  return (
    <div className='sheet'>
      <div>
        <SheetBody sheet={props.sheet} />
      </div>
    </div>
  );
});

export default Sheet;
