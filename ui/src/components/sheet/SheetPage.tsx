import { useCallback, useEffect, useState, useRef, forwardRef } from "react";
import { BasicWiki, WikiType } from "../wiki/WikiModel";
import Time from "@/components/common/Time";
import WikiOps from "../wiki/WikiOps";
import { WikiNameUpdatedEventData, WikiTitleUpdatedEventData } from "@/components/common/EventBus";
import Layout from "../common/Layout";
import Sheet from "../sheet/Sheet";
import { LoadingOutlined } from '@ant-design/icons';

export interface SheetPageProps {
  data: BasicWiki,
};

const SheetPage = forwardRef((props: SheetPageProps, ref: any) => {

  console.log(`SheetPage: render: data(${props.data.id},${props.data.name},${props.data.title})`);

  // __________ state __________

  const [title, setTitle] = useState<string>(props.data.title);

  // __________ ref __________

  const topRef = useRef<any>();
  const editorRef = useRef<any>();
  const bodyRef = useRef<any>();
  const outlineRef = useRef<any>();

  // __________ resize __________

  const refreshBodySize = () => {
    setTimeout(() => {
      const winHeight = Layout.winHeight();
      const topHeight = Layout.refHeight(topRef);
      const bodyHeight = winHeight - topHeight;

      Layout.setRefHeight(bodyRef, bodyHeight);
    }, 10);
  };

  const onWinResize = (e: UIEvent) => {
    refreshBodySize();
  };

  // __________ load __________

  useEffect(() => {
    window.addEventListener("resize", onWinResize);
    refreshBodySize();
    return () => {
      window.removeEventListener("resize", onWinResize);
    };
  }, [props.data, title]);

  const onTitleUpdated = useCallback((data: WikiTitleUpdatedEventData) => {
    setTitle(data.title);
  }, []);

  // _________ ui _________

  if (!props.data) return <div><LoadingOutlined /></div>

  if (props.data.type != 'sheet') return <div>not a sheet</div>

  return (
    <div className="wiki" ref={ref}>
      <div className="wiki-page">
        <div className='wiki-top' ref={topRef}>
          <div className="wiki-head">
            <div className="wiki-title">{title}</div>
            <div className="com-ops">
              <div className='com-op wiki-time'>{`${Time.formatDatetime(props.data.updated)}`}</div>
              <WikiOps className="com_op" mode={'wiki'} name={props.data.name} title={title} onTitleUpdated={onTitleUpdated} />
            </div>
          </div>
        </div>
        <div className="wiki-body" ref={bodyRef}>
          <Sheet data={props.data} />
        </div>
      </div>
    </div>
  );
});

export default SheetPage;
