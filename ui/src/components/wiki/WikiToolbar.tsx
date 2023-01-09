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
        align-items: flex-start;
        flex-direction: column;
        border: 1px solid #ccc;
        background-color: #fff;
        border-radius: 2px;
        box-shadow: 0 0 2px 1px #00000010;
        `)}>
        <div
          className={cx(css`
          display: flex;
          align-items: center;
          justify-content: center;
          `)}>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => WikiEditor.insertIcon(editor, 'Aries')}><Icons.AriesIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => WikiEditor.insertIcon(editor, 'Taurus')}><Icons.TaurusIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => WikiEditor.insertIcon(editor, 'Gemini')}><Icons.GeminiIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => WikiEditor.insertIcon(editor, 'Cancer')}><Icons.CancerIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => WikiEditor.insertIcon(editor, 'Leo')}><Icons.LeoIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => WikiEditor.insertIcon(editor, 'Virgo')}><Icons.VirgoIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => WikiEditor.insertIcon(editor, 'Libra')}><Icons.LibraIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => WikiEditor.insertIcon(editor, 'Scorpio')}><Icons.ScorpioIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => WikiEditor.insertIcon(editor, 'Sagittarius')}><Icons.SagittariusIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => WikiEditor.insertIcon(editor, 'Capricorn')}><Icons.CapricornIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => WikiEditor.insertIcon(editor, 'Aquarius')}><Icons.AquariusIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => WikiEditor.insertIcon(editor, 'Pisces')}><Icons.PiscesIcon /></Button>
        </div>
        <div
          className={cx(css`
          display: flex;
          align-items: center;
          justify-content: center;
          `)}>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => WikiEditor.insertIcon(editor, 'Sun')}><Icons.SunIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => WikiEditor.insertIcon(editor, 'Moon')}><Icons.MoonIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => WikiEditor.insertIcon(editor, 'Mercury')}><Icons.MercuryIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => WikiEditor.insertIcon(editor, 'Venus')}><Icons.VenusIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => WikiEditor.insertIcon(editor, 'Earth')}><Icons.EarthIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => WikiEditor.insertIcon(editor, 'Mars')}><Icons.MarsIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => WikiEditor.insertIcon(editor, 'Jupiter')}><Icons.JupiterIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => WikiEditor.insertIcon(editor, 'Saturn')}><Icons.SaturnIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => WikiEditor.insertIcon(editor, 'Uranus')}><Icons.UranusIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => WikiEditor.insertIcon(editor, 'Neptune')}><Icons.NeptuneIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => WikiEditor.insertIcon(editor, 'Pluto')}><Icons.PlutoIcon /></Button>
        </div>
        <div
          className={cx(css`
          display: flex;
          align-items: center;
          justify-content: center;
          `)}>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => WikiEditor.insertIcon(editor, 'Conjunction')}><Icons.ConjunctionIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => WikiEditor.insertIcon(editor, 'Opposition')}><Icons.OppositionIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => WikiEditor.insertIcon(editor, 'Trine')}><Icons.TrineIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => WikiEditor.insertIcon(editor, 'Square')}><Icons.SquareIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => WikiEditor.insertIcon(editor, 'Sextile')}><Icons.SextileIcon /></Button>
        </div>
        <div
          className={cx(css`
          display: flex;
          align-items: center;
          justify-content: center;
          `)}>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => WikiEditor.insertIcon(editor, 'AscendingNode')}><Icons.AscendingNodeIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => WikiEditor.insertIcon(editor, 'DescendingNode')}><Icons.DescendingNodeIcon /></Button>
        </div>
      </div>
    </Portal>
  );
};

export default WikiToolbar;
