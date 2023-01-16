import { useCallback, useEffect, useState, useRef } from "react";
import WikiApi from "./WikiApi";
import { DetailWiki, WikiType } from "./WikiModel";
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

export interface WikiDetailProps {
  name: string,
  mode: WikiMode,
};

export default (props: WikiDetailProps) => {

  // __________ state __________

  const [type, setType] = useState<WikiType|null>(null);
  const [title, setTitle] = useState<string>("");
  const [updateTime, setUpdateTime] = useState<string>("");
  const [outline, setOutline] = useState<Outline[]>();
  const [topHeight, setTopHeight] = useState<number>(0);
  const [bodyHeight, setBodyHeight] = useState<number>(0);
  const [outlineWidth, setOutlineWidth] = useState<number>(400);

  // __________ ref __________

  const topRef = useRef<any>(null);
  const editorRef = useRef<any>();

  // __________ resize __________

  const refreshBodySize = useCallback(() => {
    setTimeout(() => {
      const winSize = Layout.winSize();
      const topSize = Layout.refSize(topRef);
      const topHeight = topSize.height;
      const bodyHeight = winSize.height - topHeight;
      setTopHeight(topHeight);
      setBodyHeight(bodyHeight);
    }, 1);
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

    WikiApi.detail(props.name, (wiki: DetailWiki) => {
      if (!wiki) {
        LocalStore.removeCatalogSelectedKeys([props.name]);
        history.push(`/wiki`);
        return;
      }

      setType(wiki.type || 'wiki');
      setTitle(wiki.title || "");
      setUpdateTime(wiki.updated ? Time.formatDatetime(wiki.updated) : "");

      const outlineWidth = wiki.type == 'wiki' ? 400 : 0;
      setOutlineWidth(outlineWidth);
      
      refreshBodySize();

      if (wiki.type === 'wiki') {
        setTimeout(() => {
          editorRef?.current?.setContent(wiki.content);
          setOutline(EditorApi.makeOutline(wiki.content));
        }, 10);
      }
    });

    return () => destroy();
  }, [props.name]);

  const onTitleUpdated = useCallback((data: WikiTitleUpdatedEventData) => {
    setTitle(data.title);
  }, []);

  const onTitleClick = useCallback(() => {
    onUpdateTitle(props.mode, props.name, title, (data: WikiTitleUpdatedEventData) => {
      setTitle(data.title);
    });
  }, [props.name, title]);

  const onOutlineClick = (event: any, outline: Outline) => {
    editorRef?.current.focus(outline.index);
  };

  const onEditorChange = (isInit: boolean, isAstChange: boolean, content: string) => {
    const isUpdateOutline = isInit || isAstChange;
    isUpdateOutline && setOutline(EditorApi.makeOutline(content));

    const isSaveContent = !isInit && isAstChange;
    isSaveContent && WikiApi.updateContent(props.name, content, (success: boolean) => {
      if (!success) return console.log('ERROR');
      return setUpdateTime(Time.nowDatetime());
    });
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
            data={outline}
            onClick={onOutlineClick}/>
        <div className="wiki-body" style={{height: bodyHeight, position: 'relative', marginLeft: outlineWidth}}>
          {type === 'wiki' && <Editor
            ref={editorRef}
            id={props.name}
            type={type}
            onChange={onEditorChange}
            />}
          {type === 'sheet' && <Sheet sheet={props.name} />}
        </div>
      </div>
    </div>
  );
};
