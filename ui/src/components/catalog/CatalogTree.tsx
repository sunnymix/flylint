import { Tree } from "antd";
import type { DataNode, TreeProps, EventDataNode } from "antd/es/tree";
import TreeDataType from "antd/es/tree"
import React, { useEffect, useState, useRef, useCallback } from "react";
import { CaretDownFilled, DownOutlined } from "@ant-design/icons";
import { CatalogTree } from "./CatalogModel";
import CatalogApi from "./CatalogApi";
import LocalStore from "@/components/common/LocalStore";
import WikiCreateButton from "@/components/wiki/WikiCreateButton";
import TreeDragDrop from "@/components/common/TreeDragDrop";
import WikiOps from "../wiki/WikiOps";

// TODO: move to last node

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

  const rootRef = useRef<HTMLDivElement|null>(null)

  const [bodyHeight, setBodyHeight] = useState<number|undefined>();

  const getRootRefSize = useCallback(() => {
    if (!rootRef || !rootRef.current) return;
    return {
      width: rootRef.current.offsetWidth - 10,
      height: rootRef.current.offsetHeight - 50,
    };
  }, []);

  const refreshBodySize = useCallback(() => {
    setTimeout(() => {
      const size = getRootRefSize();
      setBodyHeight(size?.height);
    }, 10);
  }, []);

  const onWindowResize = useCallback((event: UIEvent) => {
    refreshBodySize();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", onWindowResize);
    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

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

      refreshBodySize();
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
    <div className={props.className} ref={rootRef} style={{width: props.width || 400}}>
      <div className="com_header">
        <div className="com_title">Catalog</div>
        <div className="com_ops">
          <WikiCreateButton mode="catalog" className="com_op" catalogName="/" />
        </div>
      </div>
      <div className="catalog_body">
        <Tree
          height={bodyHeight}
          switcherIcon={<CaretDownFilled />}
          expandedKeys={expandedKeys}
          selectedKeys={selectedKeys}
          onExpand={onExpand}
          onSelect={onSelect}
          treeData={trees}
          onDrop={TreeDragDrop.onDrop}
          blockNode
          draggable
          titleRender={(node: any) => (
            <div className="catalog_node_title">
              <div className="catalog_node_title_text">{node.title}</div>
              <div className="catalog_node_title_ops">
                <WikiCreateButton mode="catalog" catalogName={node.name} />
                <WikiOps mode="catalog" className="com_op" name={node.name} title={node.title} />
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};
