import { useCallback, useEffect, useState, useRef } from "react";
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

export interface WikiPageProps {
  name: string,
  mode: WikiMode,
};

const WikiPage = (props: WikiPageProps) => {

  // __________ state __________

  const [wiki, setWiki] = useState<BasicWiki|null>(null);
  const [outline, setOutline] = useState<Outline[]>();

  // __________ calculate __________

  const outlineWidth: number = (wiki != null && wiki.type == 'wiki') ? 400 : 0;

  // __________ ref __________

  const topRef = useRef<any>(null);
  const editorRef = useRef<any>();

  // __________ resize __________

  const refreshBodySize = useCallback(() => {
    setTimeout(() => {
      Layout.setRefBackgroundColor(topRef, 'yellow');
      Layout.setRefHeight(topRef, 200);

      
      const winSize = Layout.winSize();
      const topSize = Layout.refSize(topRef);
      const topHeight = topSize.height;
      const bodyHeight = winSize.height - topHeight;
    }, 10);
  }, []);

  const onWindowResize = useCallback((event: UIEvent) => {
    refreshBodySize();
  }, []);

  // __________ load __________

  const init = useCallback(() => {
    window.addEventListener("resize", onWindowResize);
    refreshBodySize();
  }, []);

  const destroy = useCallback(() => {
    window.removeEventListener("resize", onWindowResize);
    editorRef?.current?.deselect();
  }, []);

  useEffect(() => {
    init();

    if (!props.name) {
      history.push(`/wiki`);
      return;
    }

    setWiki(null);

    WikiApi.basic(props.name, (wiki: BasicWiki) => {
      if (!wiki) {
        LocalStore.removeCatalogSelectedKeys([props.name]);
        history.push(`/wiki`);
        return;
      }
      setWiki(wiki);
      refreshBodySize();
    });

    return () => destroy();
  }, [props.name]);

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

  if (!wiki) return <div>loading</div>

  return (
    <div className="wiki">
      <div className="wiki-page">
        <div className='wiki-top' ref={topRef} style={{marginLeft: outlineWidth}}>
          <div className="wiki-head">
            <div className="wiki-title">{wiki?.title}</div>
            <div className="com-ops">
              <div className='com-op wiki-time'>{`${Time.formatDatetime(wiki.updated)}`}</div>
              <WikiOps mode={props.mode} className="com_op" name={props.name} title={wiki.title} onTitleUpdated={onTitleUpdated} />
            </div>
          </div>
        </div>
        {/* TODO: top */}
        <EditorOutline className='wiki-outline' width={outlineWidth} data={outline} onClick={onOutlineClick}/>
        {/* TODO: height */}
        <div className="wiki-body" style={{marginLeft: outlineWidth}}>
          {wiki.type === 'wiki' && <Editor ref={editorRef} wiki={wiki} onChange={onEditorChange} />}
          {wiki.type === 'sheet' && <Sheet sheet={props.name} />}
        </div>
      </div>
    </div>
  );
};

export default WikiPage;
