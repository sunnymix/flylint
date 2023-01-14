import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import WikiApi from "../wiki/WikiApi";
import { DetailWiki, Toc } from "../wiki/WikiModel";
import { createEditor, Descendant, Transforms } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import EditorElement from "./EditorElement";
import EditorApi from "./EditorApi";
const { withInlines } = EditorApi;
import EditorMenu from "./EditorMenu";
import './EditorStyle.css';

export interface EditorProps {
  name: string,
  className?: string,
  style?: any,
  onChange?: () => void,
  onOutlinesChange?: (tocData: Toc[]) => void,
};

const Editor = forwardRef((props: EditorProps, ref: any) => {

  // __________ state __________

  const [editor] = useState(withReact(withInlines(withHistory(createEditor()))));
  const [menuShowCmd, setMenuShowCmd] = useState<string|any>();

  // __________ effect __________

  const init = useCallback(() => {
  }, []);

  const destroy = useCallback(() => {
    Transforms.deselect(editor);
  }, []);

  useEffect(() => {
    init();

    WikiApi.detail(props.name, (wiki: DetailWiki) => {
      if (!wiki) return;

      EditorApi.setContent(editor, wiki.content || EditorApi.initialContentRaw());
      
      props.onOutlinesChange?.call(null, EditorApi.makeOutlines(editor));
    });

    return () => destroy();
  }, [props.name]);

  // __________ editor __________

  const onEditorChange = useCallback((value: Descendant[]) => {
    if (!EditorApi.isAstChange(editor)) return;

    props.onOutlinesChange?.call(null, EditorApi.makeOutlines(editor));
    
    EditorApi.onContentChange(props.name, editor, value, () => props.onChange?.call(null));
  }, [props.name]);

  // __________ api __________

  useImperativeHandle(ref, () => ({
    focus: (index: number) => {
      EditorApi.focusIndex(editor, index);
    },
    deselect: () => {
      Transforms.deselect(editor);
    },
  }));

  // __________ ui ___________

  return (
    <div className="editor" style={{...props.style}}>
      <Slate
        editor={editor}
        value={EditorApi.initialContent()}
        onChange={onEditorChange}
        >
        <EditorMenu cmd={menuShowCmd} />
        <Editable
          placeholder="Empty"
          renderElement={EditorElement.renderElement}
          renderLeaf={EditorElement.renderLeaf}
          onKeyDown={(event) => EditorApi.onKeyDown(event, editor, (cmd: string|any) => setMenuShowCmd(cmd))}
          onPaste={(event) => EditorApi.onPaste(event, editor)}
          onClick={(event) => setMenuShowCmd(null)}
          />
      </Slate>
    </div>
  );
});

export default Editor;
