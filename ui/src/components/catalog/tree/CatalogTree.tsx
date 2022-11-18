
import { Tree } from "antd";
import type { DataNode, TreeProps } from "antd/es/tree";
import React from "react";
import { CaretDownFilled } from "@ant-design/icons";

export interface CatalogTreeProps {
  key?: string,
  className?: string,
  width?: number,
};

const treeData: DataNode[] = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        children: [
          {
            title: 'leaf',
            key: '0-0-0-0',
          },
          {
            title: 'leaf',
            key: '0-0-0-1',
          },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [{ title: 'leaf', key: '0-0-1-0' }],
      },
    ],
  },
];


export default (props: CatalogTreeProps) => {

  return (
    <div className={props.className} style={{width: props.width || 400}}>
      <div className="com_title">Catalog</div>
      <div className="com_body">
        <Tree
          showLine
          switcherIcon={<CaretDownFilled />}
          defaultExpandAll
          treeData={treeData}
          blockNode
          draggable
        />
      </div>
    </div>
  );
};
