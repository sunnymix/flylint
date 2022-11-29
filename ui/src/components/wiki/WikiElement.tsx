import { Descendant, Transforms, Editor } from 'slate';
import { useSelected, useFocused, useSlateStatic, ReactEditor } from 'slate-react';
import { Button } from 'antd';
import { EnterOutlined, DeleteOutlined } from '@ant-design/icons';
import { active } from '@/components/common/Style';
import { goto } from '@/components/common/Url';

export type ElementType = 
  | 'heading-one'
  | 'heading-two'
  | 'heading-three'
  | 'code-block'
  | 'image-block'
  | 'block'
  | 'leaf'
  | 'edge'
  | 'link';

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

export const Edge = () => {
  return (
    <span contentEditable={false} style={{fontSize:0}}>{String.fromCodePoint(160)}</span>
  )
};

export type LinkData = { type: 'link'; url: string; children: Descendant[] };

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

export const typeLevel = (type: ElementType|null|undefined): number => {
  if (!type) return 0;
  switch (type) {
    case 'heading-one': return 1;
    case 'heading-two': return 2;
    case 'heading-three': return 3;
    default: return 0;
  }
};

export default {
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  CodeBlock,
  ImageBlock,
  Block,
  Leaf,
  Edge,
  Link,
  
  renderElement(props: any) {
    switch (props.element.type) {
      case 'heading-one':
        return <HeadingOne {...props} />;
      case 'heading-two':
        return <HeadingTwo {...props} />;
      case 'heading-three':
        return <HeadingThree {...props} />;
      case 'code-block':
        return <CodeBlock {...props} />;
      case 'image-block':
        return <ImageBlock {...props} />;
      case 'link':
        return <Link {...props} />;
      default:
        return <Block {...props} />;
    }
  },

  renderLeaf(props: any) {
    return <Leaf {...props}/>
  },

};
