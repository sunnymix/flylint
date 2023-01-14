import { forwardRef, useCallback } from "react";
import { Outline } from "./EditorApi";
import { Scrollbars } from 'react-custom-scrollbars';
import { last } from '@/components/common/Style';
import './EditorStyle.css';

export interface EditorOutlinesProps {
  className?: string,
  height?: number,
  left?: number,
  width?: number,
  top?: number,
  data?: Outline[],
  onClick?: (event: any, outline: Outline) => void,
};

const EditorOutlines = forwardRef((props: EditorOutlinesProps, ref: any) => {

  const onClick = useCallback((event: any, outline: Outline) => {
    event.preventDefault();
    event.stopPropagation();
    props.onClick?.call(null, event, outline);
  }, []);
  
  return (
    <div className={`editor-outlines ${props.className}`} style={{ width: props.width || 0, top: props.top || 0}}>
      <Scrollbars className='editor-outlines-body' autoHide>
        {props.data && props.data.map((outline: Outline) => (                                                                                                                                                                                                                                                                                                                                                                                                                                 
          <div key={outline.index}>
            <a className='editor-outline' onClick={(event: any) => onClick(event, outline)}>
              <div className='editor-outline-lines'>
                {[...Array(outline.level).keys()].map((ele: any, index: number) => (
                  <div key={index} className={`editor-outline-line-body ${last(index === (outline.level - 1))}`}  style={{opacity: 1.0 / (index + 1) * 1.5}}>
                    <div className='editor-outline-line'></div>
                  </div>
                ))}
              </div>
              <div className='editor-outline-text'>
                <div className='editor-outline-indicator'>
                  <div className='editor-outline-dot'></div>
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

export default EditorOutlines;
