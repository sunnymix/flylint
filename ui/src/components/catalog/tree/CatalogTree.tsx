
import { Tree } from "antd";
import type { DataNode, TreeProps, EventDataNode } from "antd/es/tree";
import TreeDataType from "antd/es/tree"
import React, { useEffect, useState } from "react";
import { CaretDownFilled } from "@ant-design/icons";
import { CatalogTree } from "../model/CatalogModel";
import CatalogApi from "../api/CatalogApi";

export interface CatalogTreeProps {
  key?: string,
  className?: string,
  width?: number,
};

export declare type TreeNodeKey = string | number;

export default (props: CatalogTreeProps) => {

  const [trees, setTrees] = useState<DataNode[]>([]);

  const [expandedKeys, setExpandedKeys] = useState<TreeNodeKey[]>([]);

  const [selectedKeys, setSelectedKeys] = useState<TreeNodeKey[]>([]);

  useEffect(() => {
    CatalogApi.query((trees: CatalogTree[]) => {
      const newTrees = trees as DataNode[];
      if (!newTrees) {
        setTrees([]);
        return;
      }

      setTrees(newTrees);
      setExpandedKeys(JSON.parse(localStorage.getItem("flylint.catalog.tree.expandedKeys") || "[]") || []);
      setSelectedKeys(JSON.parse(localStorage.getItem("flylint.catalog.tree.selectedKeys") || "[]") || []);
    });
  }, []);



  const onExpand = (expandedKeys: TreeNodeKey[], info: any) => {
    localStorage.setItem("flylint.catalog.tree.expandedKeys", JSON.stringify(expandedKeys));
    setExpandedKeys(expandedKeys);
  };

  const onSelect = (selectedKeys: TreeNodeKey[], info: any) => {
    const node = info.node as DataNode;
    if (!node) {
      setSelectedKeys([]);
      return;
    }

    const newSelectedKeys = [node.key.toString()];
    localStorage.setItem("flylint.catalog.tree.selectedKeys", JSON.stringify(newSelectedKeys));
    setSelectedKeys(newSelectedKeys);
  };

  return (
    <div className={props.className} style={{width: props.width || 400}}>
      <div className="com_title">Catalog</div>
      <div>
        <Tree
          showLine
          switcherIcon={<CaretDownFilled />}
          expandedKeys={expandedKeys}
          selectedKeys={selectedKeys}
          onExpand={onExpand}
          onSelect={onSelect}
          treeData={trees}
          blockNode
          draggable
        />
      </div>
    </div>
  );
};
