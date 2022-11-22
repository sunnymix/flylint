import { Tree } from "antd";
import type { DataNode, TreeProps, EventDataNode } from "antd/es/tree";
import TreeDataType from "antd/es/tree"
import React, { useEffect, useState } from "react";
import { CaretDownFilled } from "@ant-design/icons";
import { CatalogTree } from "../model/CatalogModel";
import CatalogApi from "../api/CatalogApi";
import LocalStore from "@/components/common/LocalStore";
import WikiCreateButton from "@/components/wiki/button/WikiCreateButton";

export interface CatalogTreeProps {
  refreshSignal?: string,
  className?: string,
  width?: number,
  onSelect?: (names: string[]) => void,
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
      setExpandedKeys(LocalStore.getCatalogExpandKeys());
      setSelectedKeys(LocalStore.getCatalogSelectKeys());
    });
  }, [props.refreshSignal]);



  const onExpand = (expandedKeys: TreeNodeKey[], info: any) => {
    LocalStore.setCatalogExpandKeys(expandedKeys as string[]);
    setExpandedKeys(expandedKeys);
  };

  const onSelect = (selectedKeys: TreeNodeKey[], info: any) => {
    const node = info.node as DataNode;
    if (!node) {
      setSelectedKeys([]);
      props.onSelect?.call(null, []);
      return;
    }

    const newSelectedKeys = [node.key.toString()];
    LocalStore.setCatalogSelectedKeys(newSelectedKeys);
    setSelectedKeys(newSelectedKeys);
    props.onSelect?.call(null, newSelectedKeys);
  };

  return (
    <div className={props.className} style={{width: props.width || 400}}>
      <div className="com_header">
        <div className="com_title">Catalog</div>
        <div className="com_ops">
          <WikiCreateButton mode="catalog" className="com_op" catalogName="/" />
        </div>
      </div>
      <div className="catalog_tree_body">
        <Tree
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
