import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import WikiApi from "../wiki/WikiApi";
import { DetailWiki, WikiType } from "../wiki/WikiModel";
import { createEditor, Descendant, Transforms } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import EditorElement from "./EditorElement";
import EditorApi from "./EditorApi";
const { withInlines } = EditorApi;
import EditorMenu from "./EditorMenu";
import './EditorStyle.css';

export interface EditorProps {
  name: string|null,
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

  const init = useCallback(() => {
  }, []);

  const destroy = useCallback(() => {
    Transforms.deselect(editor);
  }, []);

  const loadWiki = () => {
    if (!props.name) return;
    WikiApi.detail(props.name, (wiki: DetailWiki) => {
      if (!wiki || wiki.type !== 'wiki') return;
      EditorApi.setContent(editor, wiki.content || EditorApi.initialContentRaw());
      props.onChange?.call(null, true, false, wiki.content);
    });
  };

  const loadCell = () => {

  };

  useEffect(() => {
    init();

    if (props.type === 'wiki') loadWiki();
    if (props.type === 'cell') loadCell();

    return () => destroy();
  }, [props.name]);

  // __________ editor __________

  const onEditorChange = useCallback((value: Descendant[]) => {
    props.onChange?.call(null, false, EditorApi.isAstChange(editor), JSON.stringify(value));
  }, [props.name]);

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
