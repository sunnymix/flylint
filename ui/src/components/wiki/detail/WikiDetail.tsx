import { Children, forwardRef, useCallback, useEffect, useState, useMemo, useRef } from "react";
import WikiApi from "../api/WikiApi";
import { DetailWiki } from "../model/WikiModel";
import Time from "@/components/common/Time";
import "./WikiDetailStyle.css";
import { createEditor, Descendant } from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { withHistory } from "slate-history";
import WikiMenu from "../menu/WikiMenu";
import WikiCreateButton from "../button/WikiCreateButton";
import MyElement from "../editor/MyElement";
import MyEditor from "../editor/MyEditor";
const { withInlines } = MyEditor;
import { WikiMode } from "../model/WikiModel";
import { history } from "umi";
import LocalStore from "@/components/common/LocalStore";
import WikiBreadcrumb from "../breadcrumb/WikiBreadCrumb";
import { WikiTitleUpdatedEventData } from "@/components/common/EventBus";
import { onUpdateTitle } from "../menu/WikiMenu";

// TODO:
// - cache and reset selection between renders
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
      MyEditor.setContent(editor, wiki.content || MyEditor.initialContentRaw());
    });

  }, [props.name]);

  // Unload:
  useEffect(() => {
    return () => {
      // Destroy:
    };
  }, []);

  const onTitleUpdated = useCallback((data: WikiTitleUpdatedEventData) => {
    setTitle(data.title);
  }, []);

  const onEditorChange = useCallback((value: Descendant[]) => {
    MyEditor.onContentChange(props.name, editor, value, () => setUpdateTime(Time.nowDatetime3()));
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
          <WikiBreadcrumb className="com_op" path={path} name={props.name} />
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
              value={MyEditor.initialContent()}
              onChange={onEditorChange}
              >
              <Editable
                placeholder="Empty"
                renderElement={MyElement.renderElement}
                renderLeaf={MyElement.renderLeaf}
                onKeyDown={(event) => MyEditor.onKeyDown(event, editor)}
                />
            </Slate>
          </div>
        </div>
      </div>
    </div>
  );
};
