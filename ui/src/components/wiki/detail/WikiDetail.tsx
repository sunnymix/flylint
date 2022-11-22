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

// TODO:
// - reload select wiki when ancestor name changed

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
  const [editor, setEditor] = useState(withReact(withInlines(withHistory(createEditor()))));

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

  return (
    <div>
      <div className="com_bread">
        <WikiBreadcrumb path={path} name={props.name} />
      </div>
      <div className="com_header">
        <div className="com_title">{title}</div>
        <div className="com_ops">
          <div className="com_op">{updateTime}</div>
          <WikiMenu mode={props.mode} className="com_op" name={props.name} title={title} onTitleUpdated={onTitleUpdated} />
          <WikiCreateButton mode={props.mode} className="com_op" catalogName={props.name} />
        </div>
      </div>
      <div className="com_body">
        <div className="wiki_content">
          <div className="wiki_content_editor">
            <Slate
              editor={editor}
              value={MyEditor.initialContent()}
              onChange={(value: Descendant[]) =>
                MyEditor.onContentChange(props.name, editor, value, () => setUpdateTime(Time.nowDatetime3()))}
              >
              <Editable
                placeholder="Empty"
                renderElement={MyElement.renderElement}
                renderLeaf={MyElement.renderLeaf}
                onKeyDown={(event) => MyEditor.onKeyDown(event, editor)} />
            </Slate>
          </div>
        </div>
      </div>
    </div>
  );
};
