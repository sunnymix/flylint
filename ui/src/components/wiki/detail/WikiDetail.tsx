
import { forwardRef, useCallback, useEffect, useState } from "react";
import WikiApi from "../api/WikiApi";
import { DetailWiki } from "../model/WikiModel";
import Time from "@/components/common/Time";
import "./WikiDetailStyle.css";
import { createEditor, Descendant, Editor, Transforms, Text, BaseEditor } from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { Button, Popconfirm } from "antd";
import { WarningFilled } from "@ant-design/icons";
import { history } from "umi";

export interface WikiDetailProps {
  path: string,
  refreshSignal?: string,
};

const initialEmptyContent = JSON.stringify([{"type":"paragraph","children":[{"text":""}]}]);

export default forwardRef((props: WikiDetailProps, ref) => {

  const [wiki, setWiki] = useState<DetailWiki|null>(null);

  // editor type: BaseEditor & ReactEditor
  const [editor] = useState(() => withReact(createEditor()));

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
      op => 'set_selection' !== op.type
    );

    if (!isAstChange) {
      return;
    }

    const content = JSON.stringify(value);
    WikiApi.updateContent(props.path, content, (success: boolean) => {
      console.log(`Content updated at ${Time.nowDatetime3()}, ${success ? 'success' : 'error'}`);
    });
  };




  




  // Editable: onKeyDown
  // ===================

  const editableOnKeyDown = (event: any) => {
    if (!event.ctrlKey) {
      return;
    }

    switch (event.key) {
      case "1": {
        event.preventDefault();
        CustomEditor.toggleHeadingOneBlock(editor);
        break;
      }

      case "2": {
        event.preventDefault();
        CustomEditor.toggleHeadingTwoBlock(editor);
        break;
      }

      case "3": {
        event.preventDefault();
        CustomEditor.toggleHeadingThreeBlock(editor);
        break;
      }

      case "`": {
        event.preventDefault();
        CustomEditor.toggleCodeBlock(editor);
        break;
      }

      case "b": {
        event.preventDefault();
        CustomEditor.toggleBoldMark(editor);
        break;
      }
    }
  };




  // Editable: renderElemnt (Blocks)
  // ===============================
  const editableRenderElement = (props: any) => {
    switch (props.element.type) {
      case "heading-one":
        return <HeadingOne {...props} />;
      case "heading-two":
        return <HeadingTwo {...props} />;
      case "heading-three":
        return <HeadingThree {...props} />;
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  };




  // Editable: renderLeaf (Inlines)
  // ==============================
  const editableRenderLeaf = (props: any) => {
    return <Leaf {...props}/>
  };

  
  





  // UI
  // ==

  return (
    <div>
      <div className="component_header">
        <div className="component_title">{wiki.title}</div>
        <div className="component_ops">
          <Button className="component_op" size="small" type="default" onClick={clickUpdateTitle}>Rename</Button>
          <Button className="component_op" size="small" type="default" onClick={clickUpdatePath}>Path</Button>
          <Popconfirm onConfirm={clickDelete} title="Sure to delete this wiki?" okText="Confirm" icon="">
            <Button className="component_op" size="small" type="default">Delete</Button>
          </Popconfirm>
        </div>
      </div>
      <div className="wiki_time">{Time.formatDate(wiki.created)}</div>
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
  );
});



// Slate Elements
// ==============

const HeadingOne = (props: any) => {
  const style = {textAlign: props.element.align};
  return (
    <h1 style={style} {...props.attributes}>
      {props.children}
    </h1>
  );
};

const HeadingTwo = (props: any) => {
  const style = {textAlign: props.element.align};
  return (
    <h2 style={style} {...props.attributes}>
      {props.children}
    </h2>
  );
};

const HeadingThree = (props: any) => {
  const style = {textAlign: props.element.align};
  return (
    <h3 style={style} {...props.attributes}>
      {props.children}
    </h3>
  );
};

const CodeElement = (props: any) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

const DefaultElement = (props: any) => {
  return <p {...props.attributes}>{props.children}</p>;
};

const Leaf = (props: any) => {
  return (
    <span {...props.attributes} style={{fontWeight: props.leaf.bold ? "bold" : "normal"}}>
      {props.children}
    </span>
  );
};




// Editor helpers
// ==============

const CustomEditor = {

  isBoldMarkActive(editor: BaseEditor & ReactEditor) {
    const [isMatch] = Editor.nodes(editor, {
      match: (node: any) => node.bold === true,
      universal: true,
    });
    return !!isMatch;
  },

  toggleBoldMark(editor: BaseEditor & ReactEditor) {
    const isActive = CustomEditor.isBoldMarkActive(editor);
    Transforms.setNodes(
      editor,
      {bold: isActive ? null : true, children: []},
      {match: (node: any) => Text.isText(node), split: true},
    );
  },

  isCodeBlockActive(editor: BaseEditor & ReactEditor) {
    const [isMatch] = Editor.nodes(editor, {
      match: (node: any) => node.type === "code",
    });
    return !!isMatch;
  },

  toggleCodeBlock(editor: BaseEditor & ReactEditor) {
    const isActive = CustomEditor.isCodeBlockActive(editor);
    Transforms.setNodes(
      editor,
      {type: isActive ? null : "code", children: []},
      {match: (node: any) => Editor.isBlock(editor, node)},
    );
  },

  isHeadingOneBlockActive(editor: any) {
    const [isMatch] = Editor.nodes(editor, {
      match: (node: any) => node.type === "heading-one",
    });
    return !!isMatch;
  },

  toggleHeadingOneBlock(editor: any) {
    const isActive = CustomEditor.isHeadingOneBlockActive(editor);
    Transforms.setNodes(
      editor,
      {type: isActive ? null : "heading-one", children: []},
      {match: (node: any) => Editor.isBlock(editor, node)},
    )
  },

  isHeadingTwoBlockActive(editor: any) {
    const [isMatch] = Editor.nodes(editor, {
      match: (node: any) => node.type === "heading-two",
    });
    return !!isMatch;
  },

  toggleHeadingTwoBlock(editor: any) {
    const isActive = CustomEditor.isHeadingTwoBlockActive(editor);
    Transforms.setNodes(
      editor,
      {type: isActive ? null : "heading-two", children: []},
      {match: (node: any) => Editor.isBlock(editor, node)},
    )
  },

  isHeadingThreeBlockActive(editor: any) {
    const [isMatch] = Editor.nodes(editor, {
      match: (node: any) => node.type === "heading-three",
    });
    return !!isMatch;
  },

  toggleHeadingThreeBlock(editor: any) {
    const isActive = CustomEditor.isHeadingThreeBlockActive(editor);
    Transforms.setNodes(
      editor,
      {type: isActive ? null : "heading-three", children: []},
      {match: (node: any) => Editor.isBlock(editor, node)},
    );
  },

};
