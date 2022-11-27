
export interface WikiTocProps {
  className?: string,
  width?: number,
  tocData?: any[],
};

const WikiToc = (props: WikiTocProps) => {
  
  return (
    <div className={props.className || 'wiki-toc'} style={{width: props.width || 400}}>
      <div className="com-header">
        <div className="com-title">TOC</div>
      </div>
    </div>
  )
};

export default WikiToc;
