import { forwardRef } from "react";
import React, { useCallback, useEffect, useRef } from "react";
import { useFocused, useSlate } from "slate-react";
import { Button } from "antd";
import { css, cx } from "@emotion/css";
import Icons, { IconNames } from "../icon/AstroIcons";
import Portal from "../common/Portal";
import EditorApi from "./EditorApi";

export interface EditorMenuProps {
  cmd?: string,
};

const EditorMenu = forwardRef((props: EditorMenuProps, refx: any) => {
  
  const rootRef = useRef<HTMLDivElement | null>(null);
  const editor = useSlate();
  const inFocus = useFocused();

  const show = () => {
    const el = rootRef.current;
    if (!el) return;

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
  };

  const hide = () => {
    const el = rootRef.current;
    if (!el) return;
    el.removeAttribute('style');
  };

  useEffect(() => {
    props.cmd ? show() : hide();
  }, [props.cmd]);

  const clickIcon = useCallback((name: IconNames) => {
    EditorApi.insertIcon(editor, name);
  }, []);

  return (
    <Portal>
      <div ref={rootRef} onMouseDown={e => e.preventDefault()}
        className={cx(css`
        position: absolute;
        z-index: 10000;
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
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => clickIcon('Aries')}><Icons.AriesIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => clickIcon('Taurus')}><Icons.TaurusIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => clickIcon('Gemini')}><Icons.GeminiIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => clickIcon('Cancer')}><Icons.CancerIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => clickIcon('Leo')}><Icons.LeoIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => clickIcon('Virgo')}><Icons.VirgoIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => clickIcon('Libra')}><Icons.LibraIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => clickIcon('Scorpio')}><Icons.ScorpioIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => clickIcon('Sagittarius')}><Icons.SagittariusIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => clickIcon('Capricorn')}><Icons.CapricornIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => clickIcon('Aquarius')}><Icons.AquariusIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => clickIcon('Pisces')}><Icons.PiscesIcon /></Button>
        </div>
        <div
          className={cx(css`
          display: flex;
          align-items: center;
          justify-content: center;
          `)}>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => clickIcon('Sun')}><Icons.SunIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => clickIcon('Moon')}><Icons.MoonIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => clickIcon('Mercury')}><Icons.MercuryIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => clickIcon('Venus')}><Icons.VenusIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => clickIcon('Earth')}><Icons.EarthIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => clickIcon('Mars')}><Icons.MarsIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => clickIcon('Jupiter')}><Icons.JupiterIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => clickIcon('Saturn')}><Icons.SaturnIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => clickIcon('Uranus')}><Icons.UranusIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => clickIcon('Neptune')}><Icons.NeptuneIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => clickIcon('Pluto')}><Icons.PlutoIcon /></Button>
        </div>
        <div
          className={cx(css`
          display: flex;
          align-items: center;
          justify-content: center;
          `)}>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => clickIcon('Conjunction')}><Icons.ConjunctionIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => clickIcon('Opposition')}><Icons.OppositionIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => clickIcon('Square')}><Icons.SquareIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => clickIcon('Trine')}><Icons.TrineIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => clickIcon('Sextile')}><Icons.SextileIcon /></Button>
        </div>
        <div
          className={cx(css`
          display: flex;
          align-items: center;
          justify-content: center;
          `)}>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => clickIcon('AscendingNode')}><Icons.AscendingNodeIcon /></Button>
          <Button type="text" size="small" style={{paddingTop: 2}} onClick={() => clickIcon('DescendingNode')}><Icons.DescendingNodeIcon /></Button>
        </div>
      </div>
    </Portal>
  );
});

export default EditorMenu;
