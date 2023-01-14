import { forwardRef, useCallback } from "react";
import { Outline } from "./EditorApi";
import { Scrollbars } from 'react-custom-scrollbars';
import { last } from '@/components/common/Style';
import './EditorStyle.css';

export interface EditorOutlineProps {
  className?: string,
  height?: number,
  left?: number,
  width?: number,
  top?: number,
  data?: Outline[],
  onClick?: (event: any, outline: Outline) => void,
};

const EditorOutline = forwardRef((props: EditorOutlineProps, ref: any) => {

  const onClick = useCallback((event: any, outline: Outline) => {
    event.preventDefault();
    event.stopPropagation();
    props.onClick?.call(null, event, outline);
  }, []);
  
  return (
    <div className={`editor-outline ${props.className}`} style={{ width: props.width || 0, top: props.top || 0}}>
      <Scrollbars className='editor-outline-body' autoHide>
        {props.data && props.data.map((outline: Outline) => (                                                                                                                                                                                                                                                                                                                                                                                                                                 
          <div key={outline.index}>
            <a className='editor-outline-item' onClick={(event: any) => onClick(event, outline)}>
              <div className='editor-outline-item-lines'>
                {[...Array(outline.level).keys()].map((ele: any, index: number) => (
                  <div key={index} className={`editor-outline-item-line-body ${last(index === (outline.level - 1))}`}  style={{opacity: 1.0 / (index + 1) * 1.5}}>
                    <div className='editor-outline-item-line'></div>
                  </div>
                ))}
              </div>
              <div className='editor-outline-item-text'>
                <div className='editor-outline-item-indicator'>
                  <div className='editor-outline-item-dot'></div>
                </div>
                {outline.text}
              </div>
            </a>
          </div>
        ))}
      </Scrollbars>
    </div>
  );
});

export default EditorOutline;
