import Portal from "../common/Portal";
import React, { useCallback, useEffect, useRef } from "react";
import { Button } from "antd";
import { css, cx } from "@emotion/css";
import { useFocused, useSlate } from "slate-react";
import { Range, Editor } from "slate";
import { EllipsisOutlined, FileImageFilled } from "@ant-design/icons";
import Icons from "./icon/AstroIcons";
import WikiEditor from "./WikiEditor";

export interface ToolButtonProps {
  children: React.ReactNode,
};

export interface WikiToolbarProps {
};

const WikiToolbar = (props: WikiToolbarProps) => {

  const ref = useRef<HTMLDivElement | null>(null);
  const editor = useSlate();
  const inFocus = useFocused();

  // Will call in every click/render:
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { selection } = editor;

    if (!selection || !inFocus) {
      el.removeAttribute("style");
      return;
    }

    try {
      const selection: any = window.getSelection();
      if (!selection) return;

      const focusEle = selection.focusNode.parentNode;
      if (!focusEle) return;

      console.log(selection);

      const focusLeaf = focusEle.closest('.inline');
      if (!focusLeaf) return;
      
      const focusRect = focusLeaf.getBoundingClientRect();
      if (!focusRect) return;

      const top = `${focusRect.top + window.pageYOffset + focusRect.height + 6}px`;
      const left = `${focusRect.left + window.pageXOffset - el.offsetWidth / 2 + focusRect.width / 2}px`;

      el.style.opacity = '1.0';
      el.style.top = top;
      el.style.left = left;
    } catch (error) {
      console.log('ERROR:', error);
    }
  });

  return (
    <Portal>
      <div ref={ref} onMouseDown={e => e.preventDefault()}
        className={cx(css`
        position: absolute;
        z-index: 1;
        top: -10000px;
        left: -1000px;
        opacity: 0;
        display: flex;
        align-items: center;
        border: 1px solid #ccc;
        background-color: #fff;
        border-radius: 2px;
        padding: 6px 0 0 0;
        box-shadow: 0 0 2px 1px #00000020;
        `)}>
        <Button type="text" size="small" onClick={() => WikiEditor.insertIcon(editor, 'Aries')}><Icons.AriesIcon /></Button>
        <Button type="text" size="small" onClick={() => WikiEditor.insertIcon(editor, 'Taurus')}><Icons.TaurusIcon /></Button>
        <Button type="text" size="small" onClick={() => WikiEditor.insertIcon(editor, 'Gemini')}><Icons.GeminiIcon /></Button>
        <Button type="text" size="small" onClick={() => WikiEditor.insertIcon(editor, 'Cancer')}><Icons.CancerIcon /></Button>
        <Button type="text" size="small" onClick={() => WikiEditor.insertIcon(editor, 'Leo')}><Icons.LeoIcon /></Button>
        <Button type="text" size="small" onClick={() => WikiEditor.insertIcon(editor, 'Virgo')}><Icons.VirgoIcon /></Button>
        <Button type="text" size="small" onClick={() => WikiEditor.insertIcon(editor, 'Libra')}><Icons.LibraIcon /></Button>
        <Button type="text" size="small" onClick={() => WikiEditor.insertIcon(editor, 'Scorpio')}><Icons.ScorpioIcon /></Button>
        <Button type="text" size="small" onClick={() => WikiEditor.insertIcon(editor, 'Sagittarius')}><Icons.SagittariusIcon /></Button>
        <Button type="text" size="small" onClick={() => WikiEditor.insertIcon(editor, 'Capricorn')}><Icons.CapricornIcon /></Button>
        <Button type="text" size="small" onClick={() => WikiEditor.insertIcon(editor, 'Aquarius')}><Icons.AquariusIcon /></Button>
        <Button type="text" size="small" onClick={() => WikiEditor.insertIcon(editor, 'Pisces')}><Icons.PiscesIcon /></Button>
      </div>
    </Portal>
  );
};

export default WikiToolbar;
