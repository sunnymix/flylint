import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { WikiType } from "../wiki/WikiModel";
import { createEditor, Descendant, Transforms } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import EditorElement from "./EditorElement";
import EditorApi from "./EditorApi";
const { withInlines } = EditorApi;
import EditorMenu from "./EditorMenu";
import './EditorStyle.css';

export interface EditorProps {
  id: string,
  type: WikiType,
  className?: string,
  style?: React.CSSProperties,
  onChange?: (isInit: boolean, isAstChange: boolean, content: string) => void,
  onFocus?: () => void,
  onBlur?: () => void,
};

const Editor = forwardRef((props: EditorProps, ref: any) => {

  // __________ state __________

  const [editor] = useState(withReact(withInlines(withHistory(createEditor()))));
  const [menuShowCmd, setMenuShowCmd] = useState<string|any>();

  // __________ effect __________

  const init = () => {
  };

  const destroy = () => {
    Transforms.deselect(editor);
  };

  useEffect(() => {
    init();

    return () => destroy();
  }, [props.id]);

  // __________ editor __________

  const onEditorChange = (value: Descendant[]) => {
    props.onChange?.call(null, false, EditorApi.isAstChange(editor), JSON.stringify(value));
  };

  // __________ editor event __________

  const onEditorClick = (e: any) => {
    setMenuShowCmd(null);
  };

  const onEditorFocus = (e: any) => {
    props.onFocus?.call(null);
  };

  const onEditorBlur = (e: any) => {
    props.onBlur?.call(null);
    setMenuShowCmd(null);
  };

  // __________ api __________

  useImperativeHandle(ref, () => ({

    focus: (index: number) => {
      EditorApi.focusIndex(editor, index);
    },

    deselect: () => {
      Transforms.deselect(editor);
    },

    setContent: (content: string) => {
      EditorApi.setContent(editor, content);
    },

  }));

  // __________ ui ___________

  return (
    <div
      className={`editor ${props.className}`}
      style={{...props.style}}
      >
      <Slate
        editor={editor}
        value={EditorApi.initialContent()}
        onChange={onEditorChange}
        >
        <EditorMenu cmd={menuShowCmd} />
        <Editable
          placeholder=''
          renderElement={EditorElement.renderElement}
          renderLeaf={EditorElement.renderLeaf}
          onKeyDown={(e) => EditorApi.onKeyDown(e, editor, (cmd: string|any) => setMenuShowCmd(cmd))}
          onPaste={(e) => EditorApi.onPaste(e, editor)}
          onClick={onEditorClick}
          onFocus={onEditorFocus}
          onBlur={onEditorBlur}
          />
      </Slate>
    </div>
  );
});

export default Editor;
