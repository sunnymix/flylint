import Portal from "../common/Portal";
import React, { useCallback, useEffect, useRef } from "react";
import { Button } from "antd";
import { css, cx } from "@emotion/css";
import { useFocused, useSlate } from "slate-react";
import { Range, Editor } from "slate";
import { EllipsisOutlined, FileImageFilled } from "@ant-design/icons";

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

    const domSelection: any = window.getSelection();
    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    el.style.opacity = '0.6';
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
    el.style.left = `${rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2}px`;
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
        `)}>
        {/* <div className={cx(css`
          border-style: solid;
          border-width: 5px 4px;
          border-color: #000 transparent transparent transparent;`)}></div> */}
        {/* <Button type="text" size="small" style={{color: "#fff"}}><EllipsisOutlined/></Button>
        <Button type="text" size="small" style={{color: "#fff"}}><FileImageFilled/></Button> */}
      </div>
    </Portal>
  );
};

export default WikiToolbar;
