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
  data: CellData,
  className?: string,
  style?: React.CSSProperties,
  onChange?: (isInit: boolean, isAstChange: boolean, content: string) => void,
  onFocus?: () => void,
  onBlur?: () => void,
};

const CellEditor = forwardRef((props: CellEditorProps, ref: any) => {

  // console.log(`Editor: render: ${props.wiki.id},${props.wiki.name},${props.wiki.title}`);

  // __________ state __________

  const [editor] = useState(withReact(withInlines(withHistory(createEditor()))));
  const [menuShowCmd, setMenuShowCmd] = useState<string|any>();

  const [data, setData] = useState<CellData|null>(null);

  // __________ effect __________

  const init = () => {
  };

  const destroy = () => {
    Transforms.deselect(editor);
  };

  useEffect(() => {
    init();

    if (!props.data || props.data.type != 'cell') return;

    SheetApi.getServerCell(props.data.sheet, props.data.col, props.data.row, (data: CellData|null) => {
      if (!data) return;
      setData(data);
    });

    return () => destroy();
  }, [props.data]);

  useEffect(() => {
    if (!data) return;
    EditorApi.setContent(editor, data.content || '');
    EditorApi.forceRender(editor);
  }, [data]);

  // __________ editor __________

  const onEditorChange = useCallback((value: Descendant[]) => {
    props.onChange?.call(null, false, EditorApi.isAstChange(editor), JSON.stringify(value));
  }, [editor]);

  // __________ editor event __________

  const onEditorClick = useCallback((e: any) => {
    setMenuShowCmd(null);
  }, []);

  const onEditorFocus = useCallback((e: any) => {
    props.onFocus?.call(null);
  }, []);

  const onEditorBlur = useCallback((e: any) => {
    props.onBlur?.call(null);
    setMenuShowCmd(null);
  }, []);

  // __________ api __________

  useImperativeHandle(ref, () => ({

    isFocused: () => {
      return EditorApi.isFocused(editor);
    },

    tryFocus: () => {
      EditorApi.tryFocus(editor);
    },

    focus: (index: number) => {
      EditorApi.focusIndex(editor, index);
    },

    deselect: () => {
      Transforms.deselect(editor);
    },

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
