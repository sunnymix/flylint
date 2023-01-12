import { useCallback, useEffect, useState, useRef } from "react";
import WikiApi from "./WikiApi";
import { DetailWiki, Toc } from "./WikiModel";
import Time from "@/components/common/Time";
import WikiOps from "./WikiOps";
import WikiEditor from "./WikiEditor";
const { withInlines } = WikiEditor;
import { WikiMode } from "./WikiModel";
import { history } from "umi";
import LocalStore from "@/components/common/LocalStore";
import { WikiNameUpdatedEventData, WikiTitleUpdatedEventData } from "@/components/common/EventBus";
import { onUpdateName, onUpdateTitle } from "./WikiOps";
import WikiToc from "./WikiToc";
import Layout from "../common/Layout";
import WikiContent from "./WikiContent";

export interface WikiDetailProps {
  name: string,
  mode: WikiMode,
};

export default (props: WikiDetailProps) => {

  // _________ state __________

  const contentRef = useRef<any>();
  const [path, setPath] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [updateTime, setUpdateTime] = useState<string>("");
  const [tocData, setTocData] = useState<Toc[]>();
  const topRef = useRef<any>(null);
  const [topHeight, setTopHeight] = useState<number>(0);
  const [bodyHeight, setBodyHeight] = useState<number>(0);

  // __________ resize __________

  const refreshBodySize = useCallback(() => {
    setTimeout(() => {
      const winSize = Layout.winSize();
      const topSize = Layout.refSize(topRef);
      const topHeight = 60 + topSize.height;
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
      history.push(`/${props.mode}`);
      return;
    }

    WikiApi.detail(props.name, (wiki: DetailWiki) => {
      if (!wiki) {
        LocalStore.removeCatalogSelectedKeys([props.name]);

        history.push(`/${props.mode}`);
        return;
      }

      setPath(wiki.path || "");
      setTitle(wiki.title || "");
      setUpdateTime(wiki.updated ? Time.formatDatetime(wiki.updated) : "");
      
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

  const tocOnClick = (event: any, toc: Toc) => {
    contentRef?.current.focus(toc.index);
  };

  return (
    <div className="wiki">
      <div className="wiki-page">
        <div className='wiki-top' ref={topRef} style={{marginLeft: 400}}>
          <div className="wiki-breadcrumb">
            <div className="com-ops">
              <button className='com-op btn-text' onClick={onNameClick}>{props.name}</button>
              <WikiOps mode={props.mode} className="com_op" name={props.name} title={title} onTitleUpdated={onTitleUpdated} />
            </div>
          </div>
          <div className="wiki-head">
            <div className="wiki-title" onClick={onTitleClick}>{title}</div>
            <div className="wiki-time">{`最近修改: ${updateTime}`}</div>
          </div>
        </div>
        <div className="wiki-body" style={{height: bodyHeight, position: 'relative'}}>
          <WikiToc
            className="wiki-toc"
            width={400}
            top={topHeight}
            tocData={tocData} 
            onClick={tocOnClick}/>
          <WikiContent
            ref={contentRef}
            name={props.name}
            onChange={() => setUpdateTime(Time.nowDatetime3())}
            onTocChange={(tocData: Toc[]) => setTocData(tocData)}
            style={{marginLeft: 400}}
            />
        </div>
      </div>
    </div>
  );
};
