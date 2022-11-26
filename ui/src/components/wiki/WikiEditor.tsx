import { Descendant, Editor, Transforms, Text, BaseEditor } from "slate";
import { Element as SlateElement, Range, Location } from "slate";
import { ReactEditor } from "slate-react";
import { LinkData, ImageBlockData } from "./WikiElement";
import isUrl from "is-url";
import { isKeyHotkey } from "is-hotkey";
import WikiApi from "./WikiApi";
import MediaApi from "../media/MediaApi";

const initialEmptyContent = JSON.stringify([{"type":"paragraph","children":[{"text":""}]}]);

const WikiEditor = {

  isBoldMarkActive(editor: BaseEditor & ReactEditor) {
    const [isMatch] = Editor.nodes(editor, {
      match: (ele: any) => ele.bold === true,
      universal: true,
    });
    return !!isMatch;
  },

  toggleBoldMark(editor: BaseEditor & ReactEditor) {
    const isActive = WikiEditor.isBoldMarkActive(editor);
    Transforms.setNodes(
      editor,
      {bold: isActive ? null : true, children: []},
      {match: (ele: any) => Text.isText(ele), split: true},
    );
  },

  isCodeBlockActive(editor: BaseEditor & ReactEditor) {
    const [isMatch] = Editor.nodes(editor, {
      match: (ele: any) => ele.type === "code-block",
    });
    return !!isMatch;
  },

  toggleCodeBlock(editor: BaseEditor & ReactEditor) {
    const isActive = WikiEditor.isCodeBlockActive(editor);
    Transforms.setNodes(
      editor,
      {type: isActive ? null : "code-block", children: []},
      {match: (ele: any) => Editor.isBlock(editor, ele)},
    );
  },

  isHeadingOneBlockActive(editor: any) {
    const [isMatch] = Editor.nodes(editor, {
      match: (ele: any) => ele.type === "heading-one",
    });
    return !!isMatch;
  },

  toggleHeadingOneBlock(editor: any) {
    const isActive = WikiEditor.isHeadingOneBlockActive(editor);
    Transforms.setNodes(
      editor,
      {type: isActive ? null : "heading-one", children: []},
      {match: (ele: any) => Editor.isBlock(editor, ele)},
    )
  },

  isHeadingTwoBlockActive(editor: any) {
    const [isMatch] = Editor.nodes(editor, {
      match: (ele: any) => ele.type === "heading-two",
    });
    return !!isMatch;
  },

  toggleHeadingTwoBlock(editor: any) {
    const isActive = WikiEditor.isHeadingTwoBlockActive(editor);
    Transforms.setNodes(
      editor,
      {type: isActive ? null : "heading-two", children: []},
      {match: (ele: any) => Editor.isBlock(editor, ele)},
    )
  },

  isHeadingThreeBlockActive(editor: any) {
    const [isMatch] = Editor.nodes(editor, {
      match: (ele: any) => ele.type === "heading-three",
    });
    return !!isMatch;
  },

  toggleHeadingThreeBlock(editor: any) {
    const isActive = WikiEditor.isHeadingThreeBlockActive(editor);
    Transforms.setNodes(
      editor,
      {type: isActive ? null : "heading-three", children: []},
      {match: (ele: any) => Editor.isBlock(editor, ele)},
    );
  },

  isElement(editor: any, ele: any) {
    return !Editor.isEditor(ele) && SlateElement.isElement(ele);
  },

  isLinkActive(editor: any) {
    const [isMatch] = Editor.nodes(editor, {
      match: (ele: any) => ele.type === "link",
    });
    return !!isMatch;
  },

  wrapLink(editor: any, url: string) {
    if (WikiEditor.isLinkActive(editor)) {
      WikiEditor.unwrapLink(editor);
    }
    
    const { selection } = editor;
    const isCollapsed = selection && Range.isCollapsed(selection);
    const link: LinkData = {
      type: 'link',
      url,
      children: isCollapsed ? [{text: url}] : [],
    };

    if (isCollapsed) {
      Transforms.insertNodes(editor, link);
    } else {
      Transforms.wrapNodes(editor, link, {split: true});
      Transforms.collapse(editor, {edge: 'end'});
    }
  },

  unwrapLink(editor: any) {
    Transforms.unwrapNodes(editor, {
      match: (ele: any) => ele.type === "link" && WikiEditor.isElement(editor, ele),
    });
  },

  insertLink(editor: any, url: string) {
    if (editor.selection) {
      WikiEditor.wrapLink(editor, url);
    }
  },

  insertImageBlock(editor: any, url: string) {
    const data: ImageBlockData = {
      type: 'image-block',
      url,
      children: [{text: ''}]
    };
    Transforms.insertNodes(editor, data);
  },

  withInlines(editor: any) {
    const { insertData, insertText, isInline, isVoid } = editor;

    editor.isVoid = (ele: any) => ['image-block'].includes(ele.type) || isVoid(ele);
  
    editor.isInline = (ele: any) => ['link'].includes(ele.type) || isInline(ele);

    editor.isToc = (ele: any) => ['heading-one', 'heading-two', 'heading-three'].includes(ele.type);
  
    editor.insertText = (text: any) => {
      if (text && isUrl(text)) {
        WikiEditor.wrapLink(editor, text);
      } else {
        insertText(text);
      }
    }
  
    editor.insertData = (data: any) => {
      const text = data.getData('text/plain');
  
      if (text && isUrl(text)) {
        WikiEditor.wrapLink(editor, text)
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
      Transforms.move(editor, {unit: 'offset', reverse: true});
      return;
    }
    if (isKeyHotkey('right', nativeEvent)) {
      event.preventDefault();
      Transforms.move(editor, {unit: 'offset'});
      return;
    }

    if (!event.ctrlKey) {
      return;
    }

    switch (event.key) {
      case "1": {
        event.preventDefault();
        WikiEditor.toggleHeadingOneBlock(editor);
        break;
      }

      case "2": {
        event.preventDefault();
        WikiEditor.toggleHeadingTwoBlock(editor);
        break;
      }

      case "3": {
        event.preventDefault();
        WikiEditor.toggleHeadingThreeBlock(editor);
        break;
      }

      case "`": {
        event.preventDefault();
        WikiEditor.toggleCodeBlock(editor);
        break;
      }

      case "b": {
        event.preventDefault();
        WikiEditor.toggleBoldMark(editor);
        break;
      }

      case "k": {
        event.preventDefault();
        const url = window.prompt('Url:')
        if (!url) {
          return;
        }
        WikiEditor.insertLink(editor, url);
        break;
      }

      case "j": {
        event.preventDefault();
        const tocEles = (editor.children || []).filter((ele: any) => editor.isToc(ele));
        console.log(tocEles);
      }
    }
  },

  onPaste(event: any, editor: any) {
    const files = event.clipboardData.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file && file.type.indexOf('image/') >= 0) {
        event.preventDefault();
        MediaApi.uploadImage(file, (imageUrl: string|null) => {
          if (!imageUrl) return;
          WikiEditor.insertImageBlock(editor, imageUrl);
        });
      }
    }
  },

  parseContent(content: string) {
    if (!content) {
      return WikiEditor.initialContent();
    }
    if (content.trim().length === 0) {
      return WikiEditor.initialContent();
    }
    var json = WikiEditor.initialContent();
    try {
      json = JSON.parse(content);
    } catch (error) {
      console.error(error);
    }
    return json;
  },

  initialContent() {
    return [{type: 'block', children:[{text: ''}]}];
  },

  initialContentRaw() {
    return JSON.stringify(WikiEditor.initialContent());
  },

  onContentChange(name: string, editor: any, value: Descendant[], cb: () => void) {
    const isAstChange = editor.operations.some((op: any) => 'set_selection' !== op.type);

    if (!isAstChange) {
      return;
    }

    const content = JSON.stringify(value);
    WikiApi.updateContent(name, content, (success: boolean) => {
      if (!success) {
        return;
      }

      cb();
    });
  },

  setContent(editor: any, content: string) {
    editor.children = WikiEditor.parseContent(content);
    Transforms.collapse(editor, {
      edge: "start"
    });
  },

};

export default WikiEditor;
