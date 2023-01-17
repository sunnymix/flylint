import { useCallback, useEffect, useState, useRef, forwardRef } from "react";
import WikiApi from "./WikiApi";
import { BasicWiki, WikiType } from "./WikiModel";
import Time from "@/components/common/Time";
import WikiOps from "./WikiOps";
import { WikiMode } from "./WikiModel";
import { history } from "umi";
import LocalStore from "@/components/common/LocalStore";
import { WikiNameUpdatedEventData, WikiTitleUpdatedEventData } from "@/components/common/EventBus";
import { onUpdateName, onUpdateTitle } from "./WikiOps";
import Layout from "../common/Layout";
import Sheet from "../sheet/Sheet";

import Editor from "../editor/Editor";
import EditorOutline from "../editor/EditorOutline";
import EditorApi, { Outline } from "../editor/EditorApi";
import { LoadingOutlined } from '@ant-design/icons';

export interface WikiPageProps {
  name: string,
  mode: WikiMode,
};

const WikiPage = forwardRef((props: WikiPageProps, ref: any) => {

  // __________ state __________

  const [wiki, setWiki] = useState<BasicWiki|null>(null);
  const [outline, setOutline] = useState<Outline[]>();

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

      const outlineWidth = (wiki && wiki.type == 'wiki') ? 400 : 0;

      Layout.setRefMarginLeft(topRef, outlineWidth);
      
      Layout.setRefWidth(outlineRef, outlineWidth);
      Layout.setRefTop(outlineRef, topHeight);

      Layout.setRefMarginLeft(bodyRef, outlineWidth);
      Layout.setRefHeight(bodyRef, bodyHeight);
    }, 10);
  };

  const onWinResize = (e: UIEvent) => {
    refreshBodySize();
  };

  // __________ load __________

  useEffect(() => {
    setWiki(null);
    WikiApi.basic(props.name, (wiki: BasicWiki) => {
      if (!wiki) {
        LocalStore.removeCatalogSelectedKeys([props.name]);
        history.push(`/wiki`);
        return;
      }
      setWiki(wiki);
    });
  }, [props.name]);

  useEffect(() => {
    window.addEventListener("resize", onWinResize);
    refreshBodySize();
    return () => {
      window.removeEventListener("resize", onWinResize);
    };
  }, [wiki]);

  const onTitleUpdated = useCallback((data: WikiTitleUpdatedEventData) => {
    // TODO
  }, []);

  const onOutlineClick = (e: any, outline: Outline) => {
    editorRef?.current.focus(outline.index);
  };

  const onEditorChange = (isInit: boolean, isAstChange: boolean, content: string) => {
    const isUpdateOutline = isInit || isAstChange;
    isUpdateOutline && setOutline(EditorApi.makeOutline(content));

    const isSaveContent = !isInit && isAstChange;
    isSaveContent && WikiApi.updateContent(props.name, content, (success: boolean) => {
      if (!success) return console.log('ERROR');
    });
  };

  // _________ ui _________

  if (!wiki) return <div><LoadingOutlined /></div>

  return (
    <div className="wiki" ref={ref}>
      <div className="wiki-page">
        <div className='wiki-top' ref={topRef}>
          <div className="wiki-head">
            <div className="wiki-title">{wiki?.title}</div>
            <div className="com-ops">
              <div className='com-op wiki-time'>{`${Time.formatDatetime(wiki.updated)}`}</div>
              <WikiOps className="com_op" mode={props.mode} name={props.name} title={wiki.title} onTitleUpdated={onTitleUpdated} />
            </div>
          </div>
        </div>
        <EditorOutline className='wiki-outline' ref={outlineRef} data={outline} onClick={onOutlineClick}/>
        <div className="wiki-body" ref={bodyRef}>
          {wiki.type === 'wiki' && <Editor ref={editorRef} wiki={wiki} onChange={onEditorChange} />}
          {/* {wiki.type === 'sheet' && <Sheet sheet={props.name} />} */}
        </div>
      </div>
    </div>
  );
});

export default WikiPage;
