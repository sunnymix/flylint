import { Children, forwardRef, useCallback, useEffect, useState, useMemo, useRef } from "react";
import WikiApi from "./WikiApi";
import { DetailWiki, Toc } from "./WikiModel";
import Time from "@/components/common/Time";
import { createEditor, Descendant, Transforms } from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { withHistory } from "slate-history";
import WikiOps from "./WikiOps";
import WikiCreateButton from "./WikiCreateButton";
import MyElement from "./WikiElement";
import WikiEditor from "./WikiEditor";
const { withInlines } = WikiEditor;
import { WikiMode } from "./WikiModel";
import { history } from "umi";
import LocalStore from "@/components/common/LocalStore";
import WikiBreadcrumb from "./WikiBreadCrumb";
import { WikiNameUpdatedEventData, WikiTitleUpdatedEventData } from "@/components/common/EventBus";
import { onUpdateName, onUpdateTitle } from "./WikiOps";
import { Button } from "antd";
import WikiToolbar from "./WikiToolbar";
import WikiToc from "./WikiToc";
import Layout from "../common/Layout";

// TODO:
// - reload select wiki when ancestor name changed
// - table of content

export interface WikiDetailProps {
  name: string,
  mode: WikiMode,
};

export default (props: WikiDetailProps) => {

  // Wiki property:
  const [path, setPath] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [updateTime, setUpdateTime] = useState<string>("");
  const [tocData, setTocData] = useState<Toc[]>();
  const topRef = useRef<any>(null);
  const [bodyHeight, setBodyHeight] = useState<number>();
  const [toolbarDisplayCmd, setToolbarDisplayCmd] = useState<string|any>();

  // Editor:
  const [editor] = useState(withReact(withInlines(withHistory(createEditor()))));

  // Init:
  const onInit = useCallback(() => {
    window.addEventListener("resize", onWindowResize);
    refreshBodySize();
  }, []);

  // Destroy:
  const onDestroy = useCallback(() => {
    window.removeEventListener("resize", onWindowResize);

    // Unset editor selection
    Transforms.deselect(editor);
  }, []);

  // Resize:

  const refreshBodySize = useCallback(() => {
    return;

    // Disable!

    setTimeout(() => {
      const winSize = Layout.winSize();
      const topSize = Layout.refSize(topRef);
      const bodyHeight = winSize.height - 60 - topSize.height;

      setBodyHeight(bodyHeight);
    }, 10);
  }, []);

  const onWindowResize = useCallback((event: UIEvent) => {
    refreshBodySize();
  }, []);

  // Load:
  useEffect(() => {
    onInit();

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
      WikiEditor.setContent(editor, wiki.content || WikiEditor.initialContentRaw());
      setTocData(WikiEditor.makeToc(editor));
      refreshBodySize();
    });

    return () => {
      onDestroy();
    };

  }, [props.name]);

  const onTitleUpdated = useCallback((data: WikiTitleUpdatedEventData) => {
    setTitle(data.title);
  }, []);

  const onNameClick = useCallback(() => {
    onUpdateName(props.mode, props.name, (data: WikiNameUpdatedEventData) => {
      history.push(`/${props.mode}/${data.name}`);
    });
  }, [props.name]);

  const onTitleClick = useCallback(() => {
    onUpdateTitle(props.mode, props.name, title, (data: WikiTitleUpdatedEventData) => {
      setTitle(data.title);
    });
  }, [props.name, title]);

  const onEditorChange = useCallback((value: Descendant[]) => {
    if (!WikiEditor.isAstChange(editor) && typeof tocData !== 'undefined') return;

    setTocData(WikiEditor.makeToc(editor));
    WikiEditor.onContentChange(props.name, editor, value, () => setUpdateTime(Time.nowDatetime3()));
  }, [props.name, tocData]);

  const tocOnClick = (event: any, toc: Toc) => {
    WikiEditor.focusIndex(editor, toc.index);
  };

  return (
    <div className="wiki">
      <WikiToc className="wiki-toc" width={400} tocData={tocData} onClick={tocOnClick}/>
      <div className="wiki-page" style={{marginLeft: 400}}>
        <div className='wiki-top' ref={topRef}>
          <div className="wiki-breadcrumb">
            <div className="com-ops">
              <button className='com-op btn-text' onClick={onNameClick}>{props.name}</button>
              <div className='com-op'>·</div>
              <button className='com-op btn-text' onClick={onTitleClick}>{title}</button>
              <WikiOps mode={props.mode} className="com_op" name={props.name} title={title} onTitleUpdated={onTitleUpdated} />
              <WikiCreateButton className="com_op" mode={props.mode} catalogName={props.name} />
            </div>
          </div>
          <div className="wiki-head">
            <div className="wiki-title">{title}</div>
            <div className="wiki-time">{`${updateTime}`}</div>
          </div>
        </div>
        <div className="wiki-body" style={{height: `${bodyHeight ? bodyHeight + 'px' : 'auto'}`}}>
          <div className="wiki_content">
            <div className="wiki_content_editor">
              <Slate
                editor={editor}
                value={WikiEditor.initialContent()}
                onChange={onEditorChange}
                >
                <WikiToolbar cmd={toolbarDisplayCmd} />
                <Editable
                  placeholder="Empty"
                  renderElement={MyElement.renderElement}
                  renderLeaf={MyElement.renderLeaf}
                  onKeyDown={(event) => WikiEditor.onKeyDown(event, editor, () => setToolbarDisplayCmd(`display:${+(new Date())}`))}
                  onPaste={(event) => WikiEditor.onPaste(event, editor)}
                  onClick={(event) => setToolbarDisplayCmd(null)}
                  />
              </Slate>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
