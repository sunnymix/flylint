import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import SheetBody from "./SheetBody";
import './SheetStyle.css';
import { BasicWiki } from "../wiki/WikiModel";
import SheetApi, { Sheet as SheetData } from "./SheetApi";
import { LoadingOutlined } from '@ant-design/icons';

export interface SheetProps {
  data: BasicWiki,
};

const Sheet = forwardRef((props: SheetProps, ref: any) => {

  // console.log(`Sheet: render: ${props.data.id},${props.data.name},${props.data.title}`);

  // __________ state __________

  const [sheet, setSheet] = useState<SheetData|null>(null);

  // __________ effect: data -> sheet __________

  useEffect(() => {
    setSheet(null);
    SheetApi.getSheet(props.data.name, (sheet: SheetData|null) => {
      if (!sheet) return;
      setSheet(sheet);
    });
  }, [props.data])

  // __________ api __________

  useImperativeHandle(ref, () => ({
    api: () => { console.log('empty api') },
  }));

  // __________ ui __________

  if (!sheet) return (<div><LoadingOutlined /></div>)

  return (
    <div className='sheet' ref={ref}>
      <div>
        <SheetBody data={sheet} />
      </div>
    </div>
  );
});

export default Sheet;
