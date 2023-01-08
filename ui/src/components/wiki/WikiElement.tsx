import { Descendant, Transforms, Editor } from 'slate';
import { useSelected, useFocused, useSlateStatic, ReactEditor } from 'slate-react';
import { Button } from 'antd';
import { EnterOutlined, DeleteOutlined } from '@ant-design/icons';
import { active } from '@/components/common/Style';
import { goto } from '@/components/common/Url';
import Icons from './icon/AstroIcons';

export type ElementType = 
  | 'heading-one'
  | 'heading-two'
  | 'heading-three'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'code-block'
  | 'image-block'
  | 'block'
  | 'leaf'
  | 'edge'
  | 'link'
  | 'icon'
;

export const H1 = (props: any) => <h1 className='block h1' {...props.attributes}>{props.children}</h1>;

export const H2 = (props: any) => <h2 className='block h2' {...props.attributes}>{props.children}</h2>;

export const H3 = (props: any) => <h3 className='block h3' {...props.attributes}>{props.children}</h3>;

export const H4 = (props: any) => <h4 className='block h4' {...props.attributes}>{props.children}</h4>;

export const H5 = (props: any) => <h5 className='block h5' {...props.attributes}>{props.children}</h5>;

export const HeadingOne = (props: any) => {
  const style = {textAlign: props.element.align};
  return (
    <h1 className='block heading-one' style={style} {...props.attributes}>
      {props.children}
    </h1>
  );
};

export const HeadingTwo = (props: any) => {
  const style = {textAlign: props.element.align};
  return (
    <h2 className='block heading-two' style={style} {...props.attributes}>
      {props.children}
    </h2>
  );
};

export const HeadingThree = (props: any) => {
  const style = {textAlign: props.element.align};
  return (
    <h3 className='block heading-three' style={style} {...props.attributes}>
      {props.children}
    </h3>
  );
};

export const CodeBlock = (props: any) => {
  return (
    <pre className='block code-block' {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

export type ImageBlockData = { type: 'image-block'; url: string; children: [{text: ''}] };

export const ImageBlock = (props: any) => {
  const editor: any = useSlateStatic();
  const path = ReactEditor.findPath(editor, props.element);
  const selected = useSelected();
  const focused = useFocused();
  const onEnter = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    const [row] = path;
    if (!row) return;
    const at = [row + 1];
    Transforms.insertNodes(editor, {children: [{text: ''}]}, {at});
    Transforms.select(editor, at);
  };
  const onRemove = (event: any) => {
    Transforms.removeNodes(editor, {at: path});
  };
  return (
    <div className={`block image-block ${active(selected, focused)}`} {...props.attributes}>
      {props.children}
      <div className={`image-body`} contentEditable={false}>
        <img className={`image-img`} src={props.element.url} />
        <div className={`image-ops`} contentEditable={false}>
          <Button onClick={onEnter} type='default' size='small'><EnterOutlined /></Button>
          <Button onClick={onRemove} type='default' size='small'><DeleteOutlined /></Button>
        </div>
      </div>
    </div>
  )
};

export const Block = (props: any) => {
  return <div className='block' {...props.attributes}>{props.children}</div>;
};

export const Leaf = (props: any) => {
  return (
    <span {...props.attributes} style={{fontWeight: props.leaf.bold ? 'bold' : 'normal'}}>
      {props.children}
    </span>
  );
};

export const Edge = () => <span contentEditable={false} style={{fontSize:0}}>{String.fromCodePoint(160)}</span>;

export type LinkData = { type: 'link'; url: string; children: Descendant[]; };

export const Link = (props: any) => {
  const editor: any = useSlateStatic();
  const selected = useSelected();
  const onClick = (event: any) => {
    if (!props.element.url) return;
    goto(props.element.url);
  };
  return (
    <a className={`inline link ${active(selected)}`} {...props.attributes} href={props.element.url} onClick={onClick}>
      <Edge />{props.children}<Edge />
    </a>
  )
};

export type IconData = { type: 'icon'; icon: string; children: [{'text': ''}]; };

export const Icon = (props: any) => {
  const selected = useSelected();
  const iconEle = Icons.getIcon(props.element.icon);
  return (
    <span className={`inline icon ${active(selected)}`} {...props.attributes} contentEditable={false}>
      {iconEle}{props.children}
    </span>
  );
};

export const typeLevel = (type: ElementType|null|undefined): number => {
  if (!type) return 0;
  switch (type) {
    case 'heading-one': return 1;
    case 'heading-two': return 2;
    case 'heading-three': return 3;
    case 'h1': return 1;
    case 'h2': return 2;
    case 'h3': return 3;
    case 'h4': return 4;
    case 'h5': return 5;
    default: return 0;
  }
};

export default {
  H1, H2, H3, H4, H5,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  CodeBlock,
  ImageBlock,
  Block,
  Leaf,
  Edge,
  Link,
  Icon,
  
  renderElement(props: any) {
    switch (props.element.type) {
      case 'heading-one':
        return <HeadingOne {...props} />;
      case 'heading-two':
        return <HeadingTwo {...props} />;
      case 'heading-three':
        return <HeadingThree {...props} />;
      case 'h1': return <H1 {...props} />;
      case 'h2': return <H2 {...props} />;
      case 'h3': return <H3 {...props} />;
      case 'h4': return <H4 {...props} />;
      case 'h5': return <H5 {...props} />;
      case 'code-block': return <CodeBlock {...props} />;
      case 'image-block': return <ImageBlock {...props} />;
      case 'link': return <Link {...props} />;
      case 'icon': return <Icon {...props} />;
      default: return <Block {...props} />;
    }
  },

  renderLeaf(props: any) {
    return <Leaf {...props}/>
  },

};
