
import { 
  createEditor, Descendant, Editor, Transforms, Text, BaseEditor, 
  Element as SlateElement, Range, Path, Point, Location } from "slate";
import { Slate, Editable, withReact, ReactEditor, useSelected } from "slate-react";
import { LinkData } from "./MyElement";
import isUrl from "is-url";
import { isKeyHotkey } from "is-hotkey";
import WikiApi from "../api/WikiApi";

const initialEmptyContent = JSON.stringify([{"type":"paragraph","children":[{"text":""}]}]);

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
      match: (node: any) => node.type === "code-block",
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
      match: (node: any) => node.type === "heading-one",
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
      match: (node: any) => node.type === "heading-two",
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
      match: (node: any) => node.type === "heading-three",
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
    const [isMatch] = Editor.nodes(editor, {
      match: (node: any) => node.type === "link",
    });
    return !!isMatch;
  },

  wrapLink(editor: any, url: string) {
    if (MyEditor.isLinkActive(editor)) {
      MyEditor.unwrapLink(editor);
    }
    
    const { selection } = editor;
    const isCollapsed = selection && Range.isCollapsed(selection);
    const link: LinkData = {
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

  withInlines(editor: any) {
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
  },

  onKeyDown(event: React.KeyboardEvent<HTMLDivElement>, editor: any) {
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

      case "j": {
        event.preventDefault();
        const loc = editor.selection as Location;
        if (!loc) {
          return;
        }
        const node = Editor.node(editor, loc);
        console.log(loc, node);
      }
    }
  },



  fixContent(content: any) {
    if (!content) {
      return initialEmptyContent;
    }
    if (content.trim().length === 0) {
      return initialEmptyContent;
    }
    return content;
  },

  onContentChange(wikiPath: string, editor: any, value: Descendant[], cb: () => void) {
    const isAstChange = editor.operations.some((op: any) => 'set_selection' !== op.type);

    if (!isAstChange) {
      return;
    }

    const content = JSON.stringify(value);
    WikiApi.updateContent(wikiPath, content, (success: boolean) => {
      if (!success) {
        return;
      }

      cb();
    });
  },

};

export default MyEditor;
