
import { Children, forwardRef, useCallback, useEffect, useState, useMemo } from "react";
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

export interface WikiDetailProps {
  name: string,
};

export default forwardRef((props: WikiDetailProps, ref) => {

  const [wiki, setWiki] = useState<DetailWiki|null>(null);

  const [updateTime, setUpdateTime] = useState<Date|null>(null);  

  // editor type: BaseEditor & ReactEditor
  const editor = useMemo(() => withReact(withInlines(withHistory(createEditor()))), []);

  useEffect(() => {
    if (!props.name) {
      setWiki(null);
      return;
    }

    WikiApi.detail(props.name, (wiki: DetailWiki) => {
      if (!wiki) {
        setWiki(null);
        return;
      }

      setWiki(wiki);
      MyEditor.setContent(editor, wiki.content);
    });

  }, [props.name]);

  if (!wiki) {
    return <></>;
  }

  return (
    <div>
      <div className="com_header">
        <div className="com_title">{wiki.title}</div>
        <div className="com_ops">
          <WikiMenu className="com_op" name={props.name} title={wiki.title} />
          <WikiCreateButton className="com_op" />
        </div>
      </div>
      <div className="com_body">
        <div className="wiki_time">
          {Time.formatDate(wiki.created)}
          {updateTime && (<> · Updated at {Time.nowDatetime3()}</>)}
        </div>
        <hr/>
        <div className="wiki_content">
          <div className="wiki_content_editor">
            <Slate
              editor={editor}
              value={MyEditor.parseContent(wiki.content)}
              onChange={(value: Descendant[]) =>
                MyEditor.onContentChange(props.name, editor, value, () => setUpdateTime(new Date()))}
              >
              <Editable
                placeholder="Type Here ..."
                renderElement={MyElement.renderElement}
                renderLeaf={MyElement.renderLeaf}
                onKeyDown={(event) => MyEditor.onKeyDown(event, editor)} />
            </Slate>
          </div>
        </div>
      </div>
    </div>
  );
});
