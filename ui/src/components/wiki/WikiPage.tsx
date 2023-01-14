import { useCallback, useEffect, useState, useRef } from "react";
import WikiApi from "./WikiApi";
import { DetailWiki, WikiType } from "./WikiModel";
import Time from "@/components/common/Time";
import WikiOps from "./WikiOps";
import WikiEditor from "./WikiEditor";
const { withInlines } = WikiEditor;
import { WikiMode } from "./WikiModel";
import { history } from "umi";
import LocalStore from "@/components/common/LocalStore";
import { WikiNameUpdatedEventData, WikiTitleUpdatedEventData } from "@/components/common/EventBus";
import { onUpdateName, onUpdateTitle } from "./WikiOps";
import Layout from "../common/Layout";
import Sheet from "../sheet/Sheet";

import Editor from "../editor/Editor";
import EditorOutline from "../editor/EditorOutline";
import { Outline } from "../editor/EditorApi";

export interface WikiDetailProps {
  name: string,
  mode: WikiMode,
};

export default (props: WikiDetailProps) => {

  // _________ state __________

  const contentRef = useRef<any>();
  const [type, setType] = useState<WikiType>('wiki');
  const [path, setPath] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [updateTime, setUpdateTime] = useState<string>("");
  const [outlines, setOutlines] = useState<Outline[]>();
  const topRef = useRef<any>(null);
  const [topHeight, setTopHeight] = useState<number>(0);
  const [bodyHeight, setBodyHeight] = useState<number>(0);
  const [outlineWidth, setOutlineWidth] = useState<number>(400);

  // __________ resize __________

  const refreshBodySize = useCallback(() => {
    setTimeout(() => {
      const winSize = Layout.winSize();
      const topSize = Layout.refSize(topRef);
      const topHeight = topSize.height;
      const bodyHeight = winSize.height - topHeight;
      setTopHeight(topHeight);
      setBodyHeight(bodyHeight);
    }, 10);
  }, []);

  const onWindowResize = useCallback((event: UIEvent) => {
    refreshBodySize();
  }, []);

  // ___________ load _________

  const init = useCallback(() => {
    window.addEventListener("resize", onWindowResize);
    refreshBodySize();
  }, []);

  const destroy = useCallback(() => {
    window.removeEventListener("resize", onWindowResize);
    contentRef?.current?.deselect();
  }, []);

  useEffect(() => {
    init();

    if (!props.name) {
      history.push(`/wiki`);
      return;
    }

    WikiApi.detail(props.name, (wiki: DetailWiki) => {
      if (!wiki) {
        LocalStore.removeCatalogSelectedKeys([props.name]);
        history.push(`/wiki`);
        return;
      }

      setType(wiki.type || 'wiki');
      setPath(wiki.path || "");
      setTitle(wiki.title || "");
      setUpdateTime(wiki.updated ? Time.formatDatetime(wiki.updated) : "");

      const outlineWidth = wiki.type == 'wiki' ? 400 : 0;
      setOutlineWidth(outlineWidth);
      
      refreshBodySize();
    });

    return () => destroy();
  }, [props.name]);

  const onTitleUpdated = useCallback((data: WikiTitleUpdatedEventData) => {
    setTitle(data.title);
  }, []);

  const onNameClick = useCallback(() => {
    onUpdateName(props.mode, props.name, (data: WikiNameUpdatedEventData) => {
      history.push(`/wiki/${data.name}`);
    });
  }, [props.name]);

  const onTitleClick = useCallback(() => {
    onUpdateTitle(props.mode, props.name, title, (data: WikiTitleUpdatedEventData) => {
      setTitle(data.title);
    });
  }, [props.name, title]);

  const onOutlineClick = (event: any, outline: Outline) => {
    contentRef?.current.focus(outline.index);
  };

  // _________ ui _________

  return (
    <div className="wiki">
      <div className="wiki-page">
        <div className='wiki-top' ref={topRef} style={{marginLeft: outlineWidth}}>
          <div className="wiki-head">
            <div className="wiki-title" onClick={onTitleClick}>{title}</div>
            <div className="com-ops">
              <div className='com-op wiki-time'>{`最近修改: ${updateTime}`}</div>
              <WikiOps mode={props.mode} className="com_op" name={props.name} title={title} onTitleUpdated={onTitleUpdated} />
            </div>
          </div>
        </div>
        <EditorOutline
            className="wiki-outline"
            width={outlineWidth}
            top={topHeight}
            data={outlines} 
            onClick={onOutlineClick}/>
        <div className="wiki-body" style={{height: bodyHeight, position: 'relative', marginLeft: outlineWidth}}>
          {type == 'wiki' && <Editor
            ref={contentRef}
            name={props.name}
            onChange={() => setUpdateTime(Time.nowDatetime3())}
            onOutlinesChange={(data: Outline[]) => setOutlines(data)}
            />}
          {type == 'sheet' && <Sheet />}
        </div>
      </div>
    </div>
  );
};
