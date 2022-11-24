import { Children, forwardRef, useCallback, useEffect, useState, useMemo, useRef } from "react";
import WikiApi from "../api/WikiApi";
import { DetailWiki } from "../model/WikiModel";
import Time from "@/components/common/Time";
import "./WikiDetailStyle.css";
import { createEditor, Descendant, Transforms } from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { withHistory } from "slate-history";
import WikiMenu from "../menu/WikiMenu";
import WikiCreateButton from "../button/WikiCreateButton";
import MyElement from "../editor/WikiElement";
import WikiEditor from "../editor/WikiEditor";
const { withInlines } = WikiEditor;
import { WikiMode } from "../model/WikiModel";
import { history } from "umi";
import LocalStore from "@/components/common/LocalStore";
import WikiBreadcrumb from "../breadcrumb/WikiBreadCrumb";
import { WikiNameUpdatedEventData, WikiTitleUpdatedEventData } from "@/components/common/EventBus";
import { onUpdateName, onUpdateTitle } from "../menu/WikiMenu";

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
          {/* TODO: add click event to breadcrumb */}
          <div className="com_op" onClick={onNameClick}>
            <WikiBreadcrumb path={path} name={props.name} />
          </div>
          <WikiCreateButton className="com_op" mode={props.mode} catalogName={props.name} />
        </div>
      </div>
      <div className="com_header">
        <div className="com_title" onClick={onTitleClick}>{title}</div>
        <div className="com_ops">
          <WikiMenu mode={props.mode} className="com_op" name={props.name} title={title} onTitleUpdated={onTitleUpdated} />
          <div className="com_op wiki_time">{updateTime}</div>
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
