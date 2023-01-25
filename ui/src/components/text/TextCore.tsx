import Ts, { isArr, isArrNotEmpty, isEmpty, isNotEmpty } from "../common/Ts";
import Icons from "../icon/AstroIcons";

/* __________ ele __________ */

export interface Ele {
  type?: EleType,
  children?: Ele[],
  text?: string,
  url?: string,
  icon?: string,
};

export const H1 = (props: any) => <h1 className='block h1'>{props.children}</h1>;

export const H2 = (props: any) => <h2 className='block h2'>{props.children}</h2>;

export const H3 = (props: any) => <h3 className='block h3'>{props.children}</h3>;

export const H4 = (props: any) => <h4 className='block h4'>{props.children}</h4>;

export const H5 = (props: any) => <h5 className='block h5'>{props.children}</h5>;

export const CodeBlock = (props: any) => {
  return (
    <pre className='block code-block'>
      <code>{props.children}</code>
    </pre>
  );
};

export const ImageBlock = (props: any) => {
  return (
    <div className='block image-block'>
      <img className='image-img' src={props.ele.url} />
    </div>
  );
};

export const Block = (props: any) => <div className='block'>{props.children}</div>;

export const Icon = (props: any) => <span className='inline icon'>{Icons.getIcon(props.ele.icon)}</span>;

export const Link = (props: any) => <a className='inline link' href={props.ele.link}>{props.children}</a>;

export const Leaf = (props: any) => <span className='inline text'>{props.ele.text}</span>;

/* __________ ele type __________ */

export type EleType = 
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5'
  | 'code-block' | 'image-block' | 'block'
  | 'link' | 'icon' | 'text'
;

export const defaultType = (ele: Ele) => {
  if (isNotEmpty(ele.type)) return ele.type;
  return isArr(ele.children) ? 'block' : 'text';
};

/* __________ inline __________ */

export const isInline = (type?: EleType) => type && ['leaf', 'edge', 'link', 'icon', 'text'].includes(type);

export const isBlock = (type?: EleType) => type && !isInline(type);

/* __________ render __________ */

export const render = (eles: Ele[]) => {
  const elesUI = eles.map((ele: Ele, i: number) => <div className='ele' key={Math.random()}>{renderItem(ele)}</div>);
  return (<>{elesUI}</>);
};

/* __________ render ele __________ */

export const renderItem = (ele: Ele) => {
  if (isEmpty(ele)) return <div className='empty'></div>;
  if (isEmpty(ele.children)) return renderEle(ele, null);
  const childrenUI: any = isArr(ele.children) ? render(ele.children || []) : null;
  return (<>{renderEle(ele, childrenUI)}</>);
};

/* __________ render block __________ */

export const renderEle = (ele: Ele, childrenUI: any) => {
  ele.type = defaultType(ele);
  const props = {ele, children: childrenUI, key: Math.random()};
  switch (ele.type) {
    case 'h1': return <H1 {...props} />;
    case 'h2': return <H2 {...props} />;
    case 'h3': return <H3 {...props} />;
    case 'h4': return <H4 {...props} />;
    case 'h5': return <H5 {...props} />;
    case 'code-block': return <CodeBlock {...props} />;
    case 'image-block': return <ImageBlock {...props} />;
    case 'block': return <Block {...props} />;
    case 'link': return <Link {...props} />;
    case 'icon': return <Icon {...props} />;
    case 'text': return <Leaf {...props} />;
    default: return <Block {...props} />;
  }
};

/* __________  __________ */


