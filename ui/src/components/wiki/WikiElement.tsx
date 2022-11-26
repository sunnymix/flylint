import { Descendant, Transforms } from 'slate';
import { useSelected, useFocused, useSlateStatic, ReactEditor } from 'slate-react';
import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

export const HeadingOne = (props: any) => {
  const style = {textAlign: props.element.align};
  return (
    <h1 style={style} {...props.attributes}>
      {props.children}
    </h1>
  );
};

export const HeadingTwo = (props: any) => {
  const style = {textAlign: props.element.align};
  return (
    <h2 style={style} {...props.attributes}>
      {props.children}
    </h2>
  );
};

export const HeadingThree = (props: any) => {
  const style = {textAlign: props.element.align};
  return (
    <h3 style={style} {...props.attributes}>
      {props.children}
    </h3>
  );
};

export const CodeBlock = (props: any) => {
  return (
    <pre {...props.attributes}>
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
  return (
    <div {...props.attributes} className='block'>
      {props.children}
      <div contentEditable={false} style={{position: 'relative'}}>
        <img src={props.element.url} style={{display: 'block', boxShadow: selected && focused ? '0 0 0 3px #b4d5ff' : 'none'}} />
        <div contentEditable={false} style={{position: 'absolute', left: 5, top: 5}}>
          <Button onClick={() => Transforms.removeNodes(editor, {at: path})} type='text' size='small'><DeleteOutlined /></Button>
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
    <span contentEditable={false} style={{fontSize:0}}>${String.fromCodePoint(160)}</span>
  )
};

export type LinkData = { type: 'link'; url: string; children: Descendant[] };

export const Link = (props: any) => {
  const selected = useSelected();
  return (
    <a {...props.attributes} href={props.element.url}
      style={{boxShadow: selected ? '0 0 0 3px #b4d5ff' : 'none'}}
      >
      <Edge />{props.children}<Edge />
    </a>
  )
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
