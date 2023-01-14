import { Descendant, Editor, Transforms, Text, BaseEditor, Point, Node } from "slate";
import { Element as SlateElement, Range, Location } from "slate";
import { ReactEditor } from "slate-react";
import { LinkData, ImageBlockData, IconData } from "./EditorElement";
import isUrl from "is-url";
import { isKeyHotkey } from "is-hotkey";
import WikiApi from "../wiki/WikiApi";
import MediaApi from "../media/MediaApi";
import { typeLevel } from "./EditorElement";
import { IconNames } from "../icon/AstroIcons";

export interface Outline {
  index: number,
  type: string,
  text: string,
  level: number,
};

const EditorApi = {

  resetBlock(editor: any) {
    Transforms.setNodes(
      editor, 
      {type: null, children: []},
      {match: (ele: any) => Editor.isBlock(editor, ele)},
    );
  },

  isBoldMarkActive(editor: BaseEditor & ReactEditor) {
    const [isMatch] = Editor.nodes(editor, {
      match: (ele: any) => ele.bold === true,
      universal: true,
    });
    return !!isMatch;
  },

  toggleBoldMark(editor: BaseEditor & ReactEditor) {
    const isActive = EditorApi.isBoldMarkActive(editor);
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
    const isActive = EditorApi.isCodeBlockActive(editor);
    Transforms.setNodes(
      editor,
      {type: isActive ? null : "code-block", children: []},
      {match: (ele: any) => Editor.isBlock(editor, ele)},
    );
  },

  isHeadingActive(editor: any, level: number) {
    const [isMatch] = Editor.nodes(editor, {
      match: (ele: any) => ele.type === `h${level}`,
    });
    return !!isMatch;
  },
  
  toggleHeading(editor: any, level: number) {
    const isActive = EditorApi.isHeadingActive(editor, level);
    Transforms.setNodes(
      editor,
      {type: isActive ? null : `h${level}`, children: []},
      {match: (ele: any) => Editor.isBlock(editor, ele)},
    )
  },

  isHeadingOneBlockActive(editor: any) {
    const [isMatch] = Editor.nodes(editor, {
      match: (ele: any) => ele.type === "heading-one",
    });
    return !!isMatch;
  },

  toggleHeadingOneBlock(editor: any) {
    const isActive = EditorApi.isHeadingOneBlockActive(editor);
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
    const isActive = EditorApi.isHeadingTwoBlockActive(editor);
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
    const isActive = EditorApi.isHeadingThreeBlockActive(editor);
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
    if (EditorApi.isLinkActive(editor)) {
      EditorApi.unwrapLink(editor);
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
      match: (ele: any) => ele.type === "link" && EditorApi.isElement(editor, ele),
    });
  },

  insertLink(editor: any, url: string) {
    if (editor.selection) {
      EditorApi.wrapLink(editor, url);
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

    editor.isVoid = (ele: any) => ['image-block', 'icon'].includes(ele.type) || isVoid(ele);
  
    editor.isInline = (ele: any) => ['link', 'icon'].includes(ele.type) || isInline(ele);

    editor.isToc = (ele: any) => typeLevel(ele.type) > 0;
  
    editor.insertText = (text: any) => {
      if (text && isUrl(text)) {
        EditorApi.wrapLink(editor, text);
      } else {
        insertText(text);
      }
    }
  
    editor.insertData = (data: any) => {
      const text = data.getData('text/plain');
  
      if (text && isUrl(text)) {
        EditorApi.wrapLink(editor, text)
      } else {
        insertData(data)
      }
    }
  
    return editor;
  },

  onKeyDown(event: React.KeyboardEvent<HTMLDivElement>, editor: any, toolbar?: (cmd: string|any) => void) {

    const { selection } = editor;
    if (selection && Range.isCollapsed(selection)) {
      const { nativeEvent } = event;
      if (isKeyHotkey('left', nativeEvent)) {
        event.preventDefault();
        Transforms.move(editor, { unit: 'offset', reverse: true });
        return;
      }
      if (isKeyHotkey('right', nativeEvent)) {
        event.preventDefault();
        Transforms.move(editor, { unit: 'offset' });
        return;
      }
    }

    if (!!event.shiftKey && event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      EditorApi.prependBlock(editor);
    }

    if (!!event.metaKey && event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      EditorApi.appendBlock(editor);
      return;
    }

    toolbar?.call(null, null);

    if (!event.ctrlKey) return;
    switch (event.key) {
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
        event.preventDefault();
        const level = +event.key;
        EditorApi.toggleHeading(editor, level);
        break;

      case "`":
        event.preventDefault();
        EditorApi.toggleCodeBlock(editor);
        break;

      case "b":
        event.preventDefault();
        EditorApi.toggleBoldMark(editor);
        break;

      case "k":
        event.preventDefault();
        const url = window.prompt('Url:')
        if (!url) {
          return;
        }
        EditorApi.insertLink(editor, url);
        break;

      case 'q':
        event.preventDefault();
        EditorApi.resetBlock(editor);
        break;
      
      case 's':
        event.preventDefault();
        toolbar?.call(null, 'show:' + +(+ new Date()));
        break;
    }
  },

  makeOutline(editor: any) {
    const eles = editor.children || [];
    if (!eles || !eles.length) return [];
    const data: Outline[] = [];
    eles.forEach((ele: any, index: number) => {
      const level = typeLevel(ele.type);
      if (!level) return;
      const item: Outline = {
        index,
        type: ele.type,
        text: ele.children[0]?.text || '···',
        level,
      };
      data.push(item);
    });

    return data;
  },

  onPaste(event: any, editor: any) {
    const files = event.clipboardData.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file && file.type.indexOf('image/') >= 0) {
        event.preventDefault();
        MediaApi.uploadImage(file, (imageUrl: string|null) => {
          if (!imageUrl) return;
          EditorApi.insertImageBlock(editor, imageUrl);
        });
      }
    }
  },

  parseContent(content: string) {
    if (!content) {
      return EditorApi.initialContent();
    }
    if (content.trim().length === 0) {
      return EditorApi.initialContent();
    }
    var json = EditorApi.initialContent();
    try {
      json = JSON.parse(content);
    } catch (error) {
      console.error(error);
    }
    return json;
  },

  initialContent() {
    return [EditorApi.emptyBlock()];
  },

  initialContentRaw() {
    return JSON.stringify(EditorApi.initialContent());
  },

  isAstChange(editor: any) {
    return editor.operations.some((op: any) => 'set_selection' !== op.type);
  },

  onContentChange(name: string, editor: any, value: Descendant[], cb: () => void) {
    if (!EditorApi.isAstChange(editor)) return;

    const content = JSON.stringify(value);
    WikiApi.updateContent(name, content, (success: boolean) => {
      if (!success) return;
      cb();
    });
  },

  setContent(editor: any, content: string) {
    editor.children = EditorApi.parseContent(content);
    Transforms.collapse(editor, {
      edge: "start"
    });
  },

  focusIndex(editor: any, index: number) {
    setTimeout(() => {
      ReactEditor.focus(editor);
      if (index === 0) {
        Transforms.select(editor, {path: [index, 0], offset: -1});
      }
      setTimeout(() => {
        Transforms.select(editor, {path: [index, 0], offset: 0});
      }, 10);
    }, 10);
  },

  currentPoint(editor: any) {
    if (!editor || !editor.selection || !editor.selection.anchor) return null;
    return editor.selection.anchor;
  },

  emptyBlock() {
    return {type: 'block', children: [{text: ''}]} as Node;
  },

  insertBlock(editor: any, node: Node, at: Point) {
    Transforms.insertNodes(editor, node, {at});
  },

  appendBlock(editor: any) {
    Transforms.insertNodes(editor, EditorApi.emptyBlock());
  },

  prependBlock(editor: any) {
    const point = EditorApi.currentPoint(editor);
    if (!point) return;
    const [row] = point.path;
    const previousPoint = {
      offset: 0,
      path: [row, 0],
    }
    EditorApi.insertBlock(editor, EditorApi.emptyBlock(), previousPoint);
    EditorApi.focusIndex(editor, row);
  },

  insertIcon(editor: any, name: IconNames) {
    const data: IconData = {
      type: 'icon',
      icon: name,
      children: [{'text': ''}],
    };
    Transforms.insertNodes(editor, data);
  },

};

export default EditorApi;
