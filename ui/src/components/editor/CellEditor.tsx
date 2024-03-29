import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { createEditor, Descendant, Transforms } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import EditorElement from "./EditorElement";
import EditorApi from "./EditorApi";
const { withInlines } = EditorApi;
import EditorMenu from "./EditorMenu";
import './EditorStyle.css';
import SheetApi, { Cell as CellData } from "../sheet/SheetApi";

export interface CellEditorProps {
  cell?: CellData,
  className?: string,
  style?: React.CSSProperties,
  onChange?: (cell: CellData, content: string) => void,
  onFocus?: () => void,
  onBlur?: (cell: CellData, content: string) => void,
};

const CellEditor = forwardRef((props: CellEditorProps, ref: any) => {
  const {cell} = props;

  // __________ state __________

  const [editor] = useState(withReact(withInlines(withHistory(createEditor()))));
  const [menuShowCmd, setMenuShowCmd] = useState<string|any>();

  useEffect(() => {
    // console.log(`CellEditor: cell: change: `, cell);
    EditorApi.setContent(editor, cell?.content);
    EditorApi.forceRender(editor);
    return () => {
      Transforms.deselect(editor);
    };
  }, [cell]);

  // __________ editor __________

  const onEditorChange = useCallback((content: Descendant[]) => {
    if (!props.onChange || !cell) return;
    if (!EditorApi.isAstChange(editor)) return;
    props.onChange(cell, JSON.stringify(content));
  }, [editor, cell]);

  // __________ editor event __________

  const onEditorClick = useCallback((e: any) => {
    setMenuShowCmd(null);
  }, []);

  const onEditorFocus = useCallback((e: any) => {
    props.onFocus?.call(null);
  }, []);

  const onEditorBlur = useCallback((e: any) => {
    if (!cell) return;
    props.onBlur?.call(null, cell, JSON.stringify(editor.children));
    setMenuShowCmd(null);
  }, [cell]);

  // __________ api __________

  useImperativeHandle(ref, () => ({
    isFocused: () => EditorApi.isFocused(editor),
    tryFocus: () => EditorApi.tryFocus(editor),
    focus: (index: number) => EditorApi.focusIndex(editor, index),
    deselect: () => Transforms.deselect(editor),
    setContent: (content: string) => {
      EditorApi.setContent(editor, content);
      EditorApi.forceRender(editor);
    },
  }));

  // __________ ui ___________

  return (
    <div className={`editor ${props.className}`} ref={ref} style={{...props.style}}>
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

export default CellEditor;
