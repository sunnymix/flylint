import { Children, forwardRef, useCallback, useEffect, useState, useMemo, useRef } from "react";
import WikiApi from "./WikiApi";
import { DetailWiki } from "./WikiModel";
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

  // Editor:
  const [editor] = useState(withReact(withInlines(withHistory(createEditor()))));

  // Destroy:
  const onDestroy = useCallback(() => {
    // Unset editor selection
    Transforms.deselect(editor);
  }, []);

  // Load:
  useEffect(() => {
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
    });

    return () => {
      onDestroy();
    };

  }, [props.name]);

  const onTitleUpdated = useCallback((data: WikiTitleUpdatedEventData) => {
    setTitle(data.title);
  }, []);

  const onEditorChange = useCallback((value: Descendant[]) => {
    WikiEditor.onContentChange(props.name, editor, value, () => setUpdateTime(Time.nowDatetime3()));
  }, [props.name]);

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

  return (
    <div>
      <div className="com_bread">
        <div className="com_ops">
          <button className="com_op btn_text" onClick={onTitleClick}>{title}</button>
          <button className="com_op btn_text" onClick={onNameClick}>
            <WikiBreadcrumb path={path} name={props.name} />
          </button>
          <WikiOps mode={props.mode} className="com_op" name={props.name} title={title} onTitleUpdated={onTitleUpdated} />
          <WikiCreateButton className="com_op" mode={props.mode} catalogName={props.name} />
        </div>
      </div>
      <div className="com_header">
        <div className="com_title">{title}</div>
        <div className="com_ops">
          <div className="com_op wiki_time">{`updated: ${updateTime}`}</div>
        </div>
      </div>
      <div className="com_body">
        <div className="wiki_content">
          <div className="wiki_content_editor">
            <Slate
              editor={editor}
              value={WikiEditor.initialContent()}
              onChange={onEditorChange}
              >
              <WikiToolbar />
              <Editable
                placeholder="Empty"
                renderElement={MyElement.renderElement}
                renderLeaf={MyElement.renderLeaf}
                onKeyDown={(event) => WikiEditor.onKeyDown(event, editor)}
                onPaste={(event) => WikiEditor.onPaste(event, editor)}
                />
            </Slate>
          </div>
        </div>
      </div>
    </div>
  );
};
