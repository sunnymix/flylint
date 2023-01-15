import { forwardRef } from "react";

export interface PeakProps {
  sheet: string,
};

const Peak = forwardRef((props: PeakProps, ref: any) => {

  return (
    <div className='sheet-peak'>
    </div>
  );
});

export default Peak;
