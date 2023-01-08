import Portal from "../common/Portal";
import React, { useCallback, useEffect, useRef } from "react";
import { Button } from "antd";
import { css, cx } from "@emotion/css";
import { useFocused, useSlate } from "slate-react";
import { Range, Editor } from "slate";
import { EllipsisOutlined, FileImageFilled } from "@ant-design/icons";
import Icons from "./icon/AstrologyIcons";

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
      const domSelection: any = window.getSelection();
      const domRange = domSelection.getRangeAt(0);
      const rect = domRange.getBoundingClientRect();
      el.style.opacity = '1.0';
      el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight - 4}px`;
      el.style.left = `${rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2}px`;
    } catch (error) {}
  });

  const preventClick = useCallback((event: any) => event.preventDefault(), []);

  return (
    <Portal>
      <div ref={ref} onClick={preventClick} className={cx(css`
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
        <Button type="text" size="small"><Icons.AriesIcon /></Button>
        <Button type="text" size="small"><Icons.TaurusIcon /></Button>
        <Button type="text" size="small"><Icons.GeminiIcon /></Button>
        <Button type="text" size="small"><Icons.CancerIcon /></Button>
        <Button type="text" size="small"><Icons.LeoIcon /></Button>
        <Button type="text" size="small"><Icons.VirgoIcon /></Button>
        <Button type="text" size="small"><Icons.LibraIcon /></Button>
        <Button type="text" size="small"><Icons.ScorpioIcon /></Button>
        <Button type="text" size="small"><Icons.SagittariusIcon /></Button>
        <Button type="text" size="small"><Icons.CapricornIcon /></Button>
        <Button type="text" size="small"><Icons.AquariusIcon /></Button>
        <Button type="text" size="small"><Icons.PiscesIcon /></Button>
      </div>
    </Portal>
  );
};

export default WikiToolbar;
