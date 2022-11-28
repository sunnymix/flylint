import { Toc } from './WikiModel';
import { Button } from 'antd';

export interface WikiTocProps {
  className?: string,
  left?: number,
  width?: number,
  tocData?: Toc[],
};

const WikiToc = (props: WikiTocProps) => {
  
  return (
    <div className={props.className || 'wiki-toc'} style={{ width: props.width || 400}}>
      <div className='toc-content'>
        {props.tocData && props.tocData.map((toc: Toc) => (
          <div key={toc.index}>
            <a className='toc-item'>{toc.text}</a>
          </div>
        ))}
      </div>
    </div>
  )
};

export default WikiToc;
