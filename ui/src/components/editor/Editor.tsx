import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { BasicWiki, DetailWiki, WikiType } from "../wiki/WikiModel";
import WikiApi from "../wiki/WikiApi";
import { createEditor, Descendant, Transforms } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import EditorElement from "./EditorElement";
import EditorApi from "./EditorApi";
const { withInlines } = EditorApi;
import EditorMenu from "./EditorMenu";
import './EditorStyle.css';

export interface EditorProps {
  wiki: BasicWiki,
  className?: string,
  style?: React.CSSProperties,
  onChange?: (isInit: boolean, isAstChange: boolean, content: string) => void,
  onFocus?: () => void,
  onBlur?: () => void,
};

const Editor = forwardRef((props: EditorProps, ref: any) => {

  // console.log(`Editor: render: ${props.wiki.id},${props.wiki.name},${props.wiki.title}`);

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

    if (!props.wiki || props.wiki.type != 'wiki') return;

    WikiApi.detail(props.wiki.name, (wiki: DetailWiki) => {
      EditorApi.setContent(editor, wiki.content);
      EditorApi.forceRender(editor);
      props.onChange?.call(null, true, false, wiki.content);
    });

    return () => destroy();
  }, [props.wiki]);

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

export default Editor;
