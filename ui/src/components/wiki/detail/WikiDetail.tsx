
import { forwardRef, useEffect, useState } from "react";
import WikiApi from "../api/WikiApi";
import { DetailWiki } from "../model/WikiModel";
import Time from "@/components/common/Time";
import "./WikiDetailStyle.css";
import { createEditor, Descendant } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { Button } from "antd";

export interface WikiDetailProps {
  path: string,
  refreshSignal?: string,
};

export default forwardRef((props: WikiDetailProps, ref) => {

  const [wiki, setWiki] = useState<DetailWiki|null>(null);

  const [editor] = useState(() => withReact(createEditor()));

  useEffect(() => {
    if (!props.path) {
      setWiki(null);
      return;
    }

    WikiApi.detail(props.path, (wiki: DetailWiki) => {
      if (!wiki) {
        setWiki(null);
        return;
      }

      setWiki(wiki);
    });

  }, [props.path, props.refreshSignal]);

  if (!wiki) {
    return <></>;
  }

  const fixContent = (content: any) => {
    if (!content) {
      return "[]";
    }
    if (content.trim().length === 0) {
      return "[]";
    }
    return content;
  };

  const initialContent = JSON.parse(fixContent(wiki.content));

  const contentOnChange = (value: Descendant[]) => {
    const isAstChange = editor.operations.some(
      op => 'set_selection' !== op.type
    );

    if (!isAstChange) {
      return;
    }

    const content = JSON.stringify(value);
    WikiApi.updateContent(props.path, content, (success: boolean) => {
      console.log(success);
    });
  };

  return (
    <div>
      <div className="component_header">
        <div className="component_title">{wiki.title}</div>
        <div className="component_ops">
          <Button className="component_op" size="small" type="default">Path</Button>
          <Button className="component_op" size="small" type="default">Read</Button>
          <Button className="component_op" size="small" type="primary">New</Button>
        </div>
      </div>
      <div className="wiki_time">{Time.formatDate(wiki.updated)}</div>
      <div className="wiki_content">
        <div className="wiki_content_editor">
          <Slate editor={editor} value={initialContent} onChange={contentOnChange}>
            <Editable />
          </Slate>
        </div>
      </div>
    </div>
  );
});
