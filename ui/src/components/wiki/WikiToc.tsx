import { Toc } from './WikiModel';
import { Button } from 'antd';
import { useCallback } from 'react';

export interface WikiTocProps {
  className?: string,
  left?: number,
  width?: number,
  tocData?: Toc[],
  onClick?: (event: any, toc: Toc) => void,
};

const WikiToc = (props: WikiTocProps) => {

  const onClick = useCallback((event: any, toc: Toc) => {
    event.preventDefault();
    event.stopPropagation();
    props.onClick?.call(null, event, toc);
  }, []);
  
  return (
    <div className={props.className || 'wiki-toc'} style={{ width: props.width || 400}}>
      <div className='toc-content'>
        {props.tocData && props.tocData.map((toc: Toc) => (
          <div key={toc.index}>
            <a className='toc-item' onClick={(event: any) => onClick(event, toc)}>
              <div className='toc-text' style={{paddingLeft: (toc.level - 1) * 20}}>{toc.text}</div>
              <div className='toc-level'>{toc.level}</div>
            </a>
          </div>
        ))}
      </div>
    </div>
  )
};

export default WikiToc;
