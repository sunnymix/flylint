
import { Children, forwardRef, useCallback, useEffect, useState, useMemo } from "react";
import WikiApi from "../api/WikiApi";
import { DetailWiki } from "../model/WikiModel";
import Time from "@/components/common/Time";
import "./WikiDetailStyle.css";
import { createEditor, Descendant, Editor, Transforms, Text, BaseEditor, Element as SlateElement, Range } from "slate";
import { Slate, Editable, withReact, ReactEditor, useSelected } from "slate-react";
import { withHistory } from "slate-history";
import { Button, Popconfirm } from "antd";
import { history } from "umi";
import isUrl from "is-url";
import { isKeyHotkey } from "is-hotkey";

export interface WikiDetailProps {
  path: string,
  refreshSignal?: string,
};

const initialEmptyContent = JSON.stringify([{"type":"paragraph","children":[{"text":""}]}]);

export default forwardRef((props: WikiDetailProps, ref) => {

  const [wiki, setWiki] = useState<DetailWiki|null>(null);

  const [updateTime, setUpdateTime] = useState<Date|null>(null);

  // editor type: BaseEditor & ReactEditor
  const editor = useMemo(
    () => withInlines(withHistory(withReact(createEditor()))),
    []
  );

  useEffect(() => {
    if (!props.path) {
      setWiki(null);
      return;
    }

    WikiApi.detail(props.path, (wiki: DetailWiki) => {
      if (!wiki) {
        setWiki(null);
        return;
      }

      setWiki(wiki);
    });

  }, [props.path, props.refreshSignal]);

  if (!wiki) {
    return <></>;
  }






  // ops
  // ===

  const clickUpdateTitle = () => {
    const newTitle = prompt("Update title of this wiki:", wiki.title);
    if (!newTitle || newTitle.trim().length < 0) {
      return;
    }
    WikiApi.updateTitle(props.path, newTitle, (success: boolean, updatedTitle: string) => {
      if (!success || !updatedTitle) {
        return;
      }
      location.reload();
    });
  };

  const clickUpdatePath = () => {
    const newPath = prompt("Update path of this wiki:", props.path);
    if (!newPath || newPath.trim().length < 0) {
      return;
    }
    WikiApi.updatePath(props.path, newPath, (success: boolean, updatedPath: string) => {
      if (!success || !updatedPath) {
        return;
      }
      history.push(`/wiki/${updatedPath}`);
    });
  };

  const clickDelete = () => {
    WikiApi.remove(props.path, (success: boolean) => {
      history.push("/wiki");
    });
  };





  
  
  
  
  // content
  // =======

  const fixContent = (content: any) => {
    if (!content) {
      return initialEmptyContent;
    }
    if (content.trim().length === 0) {
      return initialEmptyContent;
    }
    return content;
  };

  const initialContent = JSON.parse(fixContent(wiki.content));




  
  
  // Slate: onChange
  // ===============

  const contentOnChange = (value: Descendant[]) => {
    const isAstChange = editor.operations.some(
      (op: any) => 'set_selection' !== op.type
    );

    if (!isAstChange) {
      return;
    }

    const content = JSON.stringify(value);
    WikiApi.updateContent(props.path, content, (success: boolean) => {
      setUpdateTime(new Date());
    });
  };




  




  // Editable: onKeyDown
  // ===================

  const editableOnKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const { nativeEvent } = event;

    if (isKeyHotkey('left', nativeEvent)) {
      event.preventDefault();
      Transforms.move(editor, {unit: "offset", reverse: true});
      return;
    }
    if (isKeyHotkey('right', nativeEvent)) {
      event.preventDefault();
      Transforms.move(editor, {unit: "offset"});
      return;
    }

    if (!event.ctrlKey) {
      return;
    }

    switch (event.key) {
      case "1": {
        event.preventDefault();
        MyEditor.toggleHeadingOneBlock(editor);
        break;
      }

      case "2": {
        event.preventDefault();
        MyEditor.toggleHeadingTwoBlock(editor);
        break;
      }

      case "3": {
        event.preventDefault();
        MyEditor.toggleHeadingThreeBlock(editor);
        break;
      }

      case "`": {
        event.preventDefault();
        MyEditor.toggleCodeBlock(editor);
        break;
      }

      case "b": {
        event.preventDefault();
        MyEditor.toggleBoldMark(editor);
        break;
      }

      case "k": {
        event.preventDefault();
        const url = window.prompt('Enter URL of the link:')
        if (!url) {
          return;
        }
        MyEditor.insertLink(editor, url);
        break;
      }
    }
  };





  // Editable: renderElemnt (Blocks)
  // ===============================
  const editableRenderElement = (props: any) => {
    switch (props.element.type) {
      case "heading-one":
        return <HeadingOneCom {...props} />;
      case "heading-two":
        return <HeadingTwoCom {...props} />;
      case "heading-three":
        return <HeadingThreeCom {...props} />;
      case "code-block":
        return <CodeBlockCom {...props} />;
      case "link":
        return <LinkCom {...props} />;
      default:
        return <DefaultCom {...props} />;
    }
  };




  // Editable: renderLeaf (Inlines)
  // ==============================
  const editableRenderLeaf = (props: any) => {
    return <LeafCom {...props}/>
  };

  
  





  // UI
  // ==

  return (
    <div>
      <div className="component_header">
        <div className="component_title">{wiki.title}</div>
        <div className="component_ops">
          <Button className="component_op" size="small" onClick={clickUpdateTitle}>Rename</Button>
          <Button className="component_op" size="small" onClick={clickUpdatePath}>Path</Button>
          <Popconfirm onConfirm={clickDelete} title="Sure to delete this wiki?" okText="Confirm" icon="">
            <Button className="component_op" size="small">Delete</Button>
          </Popconfirm>
        </div>
      </div>
      <div className="component_body">
        <div className="wiki_time">
          {Time.formatDate(wiki.created)}
          {updateTime && (<> · Updated at {Time.nowDatetime3()}</>)}
        </div>
        <hr/>
        <div className="wiki_content">
          <div className="wiki_content_editor">
            <Slate editor={editor} value={initialContent} onChange={contentOnChange}>
              <Editable
                placeholder="Type Here ..."
                renderElement={editableRenderElement}
                renderLeaf={editableRenderLeaf}
                onKeyDown={editableOnKeyDown} />
            </Slate>
          </div>
        </div>
      </div>
    </div>
  );
});



// Slate Elements
// ==============

const HeadingOneCom = (props: any) => {
  const style = {textAlign: props.element.align};
  return (
    <h1 style={style} {...props.attributes}>
      {props.children}
    </h1>
  );
};

const HeadingTwoCom = (props: any) => {
  const style = {textAlign: props.element.align};
  return (
    <h2 style={style} {...props.attributes}>
      {props.children}
    </h2>
  );
};

const HeadingThreeCom = (props: any) => {
  const style = {textAlign: props.element.align};
  return (
    <h3 style={style} {...props.attributes}>
      {props.children}
    </h3>
  );
};

const CodeBlockCom = (props: any) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

const DefaultCom = (props: any) => {
  return <p {...props.attributes}>{props.children}</p>;
};

const LeafCom = (props: any) => {
  return (
    <span {...props.attributes} style={{fontWeight: props.leaf.bold ? "bold" : "normal"}}>
      {props.children}
    </span>
  );
};

const InlineSelectionCom = () => {
  return (
    <span contentEditable={false} style={{fontSize:0}}>
      ${String.fromCodePoint(160)}
    </span>
  )
};

export type LinkElement = { type: "link"; url: string; children: Descendant[] };

const LinkCom = (props: any) => {
  const selected = useSelected();
  return (
    <a 
      {...props.attributes}
      href={props.element.url}
      style={{backgroundColor: selected ? "#eee" : "transparent"}}
      >
      <InlineSelectionCom />
      {props.children}
      <InlineSelectionCom />
    </a>
  )
};





// Editor helpers
// ==============

const MyEditor = {

  isBoldMarkActive(editor: BaseEditor & ReactEditor) {
    const [isMatch] = Editor.nodes(editor, {
      match: (node: any) => node.bold === true,
      universal: true,
    });
    return !!isMatch;
  },

  toggleBoldMark(editor: BaseEditor & ReactEditor) {
    const isActive = MyEditor.isBoldMarkActive(editor);
    Transforms.setNodes(
      editor,
      {bold: isActive ? null : true, children: []},
      {match: (node: any) => Text.isText(node), split: true},
    );
  },

  isCodeBlockActive(editor: BaseEditor & ReactEditor) {
    const [isMatch] = Editor.nodes(editor, {
      match: (node: any) => node.type === "code-block" && MyEditor.isElement(editor, node),
    });
    return !!isMatch;
  },

  toggleCodeBlock(editor: BaseEditor & ReactEditor) {
    const isActive = MyEditor.isCodeBlockActive(editor);
    Transforms.setNodes(
      editor,
      {type: isActive ? null : "code-block", children: []},
      {match: (node: any) => Editor.isBlock(editor, node)},
    );
  },

  isHeadingOneBlockActive(editor: any) {
    const [isMatch] = Editor.nodes(editor, {
      match: (node: any) => node.type === "heading-one" && MyEditor.isElement(editor, node),
    });
    return !!isMatch;
  },

  toggleHeadingOneBlock(editor: any) {
    const isActive = MyEditor.isHeadingOneBlockActive(editor);
    Transforms.setNodes(
      editor,
      {type: isActive ? null : "heading-one", children: []},
      {match: (node: any) => Editor.isBlock(editor, node)},
    )
  },

  isHeadingTwoBlockActive(editor: any) {
    const [isMatch] = Editor.nodes(editor, {
      match: (node: any) => node.type === "heading-two" && MyEditor.isElement(editor, node),
    });
    return !!isMatch;
  },

  toggleHeadingTwoBlock(editor: any) {
    const isActive = MyEditor.isHeadingTwoBlockActive(editor);
    Transforms.setNodes(
      editor,
      {type: isActive ? null : "heading-two", children: []},
      {match: (node: any) => Editor.isBlock(editor, node)},
    )
  },

  isHeadingThreeBlockActive(editor: any) {
    const [isMatch] = Editor.nodes(editor, {
      match: (node: any) => node.type === "heading-three" && MyEditor.isElement(editor, node),
    });
    return !!isMatch;
  },

  toggleHeadingThreeBlock(editor: any) {
    const isActive = MyEditor.isHeadingThreeBlockActive(editor);
    Transforms.setNodes(
      editor,
      {type: isActive ? null : "heading-three", children: []},
      {match: (node: any) => Editor.isBlock(editor, node)},
    );
  },

  isElement(editor: any, node: any) {
    return !Editor.isEditor(node) && SlateElement.isElement(node);
  },

  isLinkActive(editor: any) {
    const [isLink] = Editor.nodes(editor, {
      match: (node: any) => node.type === "link" && MyEditor.isElement(editor, node),
    });
    return !!isLink;
  },

  wrapLink(editor: any, url: string) {
    if (MyEditor.isLinkActive(editor)) {
      MyEditor.unwrapLink(editor);
    }
    
    const { selection } = editor;
    const isCollapsed = selection && Range.isCollapsed(selection);
    const link: LinkElement = {
      type: "link",
      url,
      children: isCollapsed ? [{text: url}] : [],
    };

    if (isCollapsed) {
      Transforms.insertNodes(editor, link);
    } else {
      Transforms.wrapNodes(editor, link, {split: true});
      Transforms.collapse(editor, {edge: "end"});
    }
  },

  unwrapLink(editor: any) {
    Transforms.unwrapNodes(editor, {
      match: (node: any) => node.type === 'link' && MyEditor.isElement(editor, node),
    });
  },

  insertLink(editor: any, url: string) {
    if (editor.selection) {
      MyEditor.wrapLink(editor, url);
    }
  },

  toggleLink(editor: any) {
    // TODO
  },

};



// withInlines

const withInlines = (editor: any) => {
  const { insertData, insertText, isInline } = editor

  editor.isInline = (element: any) => ['link'].includes(element.type) || isInline(element);

  editor.insertText = (text: any) => {
    if (text && isUrl(text)) {
      MyEditor.wrapLink(editor, text);
    } else {
      insertText(text);
    }
  }

  editor.insertData = (data: any) => {
    const text = data.getData('text/plain');

    if (text && isUrl(text)) {
      MyEditor.wrapLink(editor, text)
    } else {
      insertData(data)
    }
  }

  return editor;
};
