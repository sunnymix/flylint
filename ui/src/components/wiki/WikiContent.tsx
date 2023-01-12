import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import WikiApi from "./WikiApi";
import { DetailWiki, Toc } from "./WikiModel";
import { createEditor, Descendant, Transforms } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import MyElement from "./WikiElement";
import WikiEditor from "./WikiEditor";
const { withInlines } = WikiEditor;
import WikiToolbar from "./WikiToolbar";

export interface WikiContentProps {
  name: string,
  className?: string,
  style?: any,
  onChange?: () => void,
  onTocChange?: (tocData: Toc[]) => void,
};

const WikiContent = forwardRef((props: WikiContentProps, ref: any) => {

  // __________ state __________

  const [editor] = useState(withReact(withInlines(withHistory(createEditor()))));
  const [toolbarDisplayCmd, setToolbarDisplayCmd] = useState<string|any>();

  // __________ life cycle __________

  const init = useCallback(() => {
  }, []);

  const destroy = useCallback(() => {
    Transforms.deselect(editor);
  }, []);

  useEffect(() => {
    init();

    WikiApi.detail(props.name, (wiki: DetailWiki) => {
      if (!wiki) return;

      WikiEditor.setContent(editor, wiki.content || WikiEditor.initialContentRaw());
      
      props.onTocChange?.call(null, WikiEditor.makeToc(editor));
    });

    return () => destroy();
  }, [props.name]);

  // __________ editor __________

  const onEditorChange = useCallback((value: Descendant[]) => {
    if (!WikiEditor.isAstChange(editor)) return;

    props.onTocChange?.call(null, WikiEditor.makeToc(editor));
    
    WikiEditor.onContentChange(props.name, editor, value, () => props.onChange?.call(null));
  }, [props.name]);

  // __________ api __________

  useImperativeHandle(ref, () => ({
    focus: (index: number) => {
      WikiEditor.focusIndex(editor, index);
    },
    deselect: () => {
      Transforms.deselect(editor);
    },
  }));

  // __________ ui ___________

  return (
    <div className="wiki_content" style={{...props.style}}>
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
            onKeyDown={(event) => WikiEditor.onKeyDown(event, editor, (cmd: string|any) => setToolbarDisplayCmd(cmd))}
            onPaste={(event) => WikiEditor.onPaste(event, editor)}
            onClick={(event) => setToolbarDisplayCmd(null)}
            />
        </Slate>
      </div>
    </div>
  );
});

export default WikiContent;
