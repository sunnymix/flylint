
import { 
  createEditor, Descendant, Editor, Transforms, Text, BaseEditor, 
  Element as SlateElement, Range, Path, Point, Location } from "slate";
import { Slate, Editable, withReact, ReactEditor, useSelected } from "slate-react";

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

export const Element = (props: any) => {
  return <p {...props.attributes}>{props.children}</p>;
};

export const Leaf = (props: any) => {
  return (
    <span {...props.attributes} style={{fontWeight: props.leaf.bold ? "bold" : "normal"}}>
      {props.children}
    </span>
  );
};

export const InlineEdge = () => {
  return (
    <span contentEditable={false} style={{fontSize:0}}>
      ${String.fromCodePoint(160)}
    </span>
  )
};

export const Link = (props: any) => {
  const selected = useSelected();
  return (
    <a 
      {...props.attributes}
      href={props.element.url}
      style={{backgroundColor: selected ? "#eee" : "transparent"}}
      >
      <InlineEdge />
      {props.children}
      <InlineEdge />
    </a>
  )
};

export type LinkData = { type: "link"; url: string; children: Descendant[] };

export default {
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  CodeBlock,
  Element,
  Leaf,
  InlineEdge,
  Link,
  
  renderElement(props: any) {
    switch (props.element.type) {
      case "heading-one":
        return <HeadingOne {...props} />;
      case "heading-two":
        return <HeadingTwo {...props} />;
      case "heading-three":
        return <HeadingThree {...props} />;
      case "code-block":
        return <CodeBlock {...props} />;
      case "link":
        return <Link {...props} />;
      default:
        return <Element {...props} />;
    }
  },

  renderLeaf(props: any) {
    return <Leaf {...props}/>
  },

};
