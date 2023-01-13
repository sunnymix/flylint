import { forwardRef, useImperativeHandle } from "react";
import SheetContent from "./SheetContent";
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
        <SheetContent />
      </div>
    </div>
  );
});

export default Sheet;
