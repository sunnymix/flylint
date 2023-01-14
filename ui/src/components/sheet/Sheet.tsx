import { forwardRef, useImperativeHandle } from "react";
import SheetBody from "./SheetBody";
import './SheetStyle.css';


export interface SheetProps {};

const Sheet = forwardRef((props: SheetProps, ref) => {

  // __________ state __________

  // __________ api __________

  useImperativeHandle(ref, () => ({
    api: () => { console.log('empty api') },
  }));

  // __________ ui __________

  return (
    <div className='sheet'>
      <div>
        <SheetBody />
      </div>
    </div>
  );
});

export default Sheet;
