import React, { forwardRef, useCallback } from "react";
import { Button, Dropdown, Popconfirm } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined, ArrowUpOutlined, ArrowDownOutlined, EllipsisOutlined, CloseOutlined } from '@ant-design/icons';
import EventBus, { EventData, SheetColsAdd, SheetColsDelete, SheetColsWidthUpdate } from "../common/EventBus";
import LocalStore from "../common/LocalStore";

export interface SheetPopProps {
  sheet: string,
};

const SheetPop = forwardRef((props: SheetPopProps, ref: any) => {

  const onColsAddBefore = useCallback((e: React.UIEvent) => {
    const {col, row} = LocalStore.getSheetSelectedPos(props.sheet);
    EventBus.dispatch('sheet.cols.add', {target: 'col', col, row, at: 'before', size: 1} as SheetColsAdd);
  }, [props.sheet]);

  const onColsAddAfter = useCallback((e: React.UIEvent) => {
    const {col, row} = LocalStore.getSheetSelectedPos(props.sheet);
    EventBus.dispatch('sheet.cols.add', {target: 'col', col, row, at: 'after', size: 1} as SheetColsAdd);
  }, [props.sheet]);

  const onColsWidthUpdate = useCallback((e: React.UIEvent) => {
    const {col, row} = LocalStore.getSheetSelectedPos(props.sheet);
    const width = window.prompt('width:');
    if (!width) return;
    EventBus.dispatch('sheet.cols.width.update', {target: 'col', col, at: 'self', row, width: +width} as SheetColsWidthUpdate);
  }, [props.sheet]);

  const onColsDelete = useCallback((e: React.MouseEvent) => {
    const {col, row} = LocalStore.getSheetSelectedPos(props.sheet);
    EventBus.dispatch('sheet.cols.delete', {target: 'col', col, row, at: 'self', size: 1} as SheetColsDelete);
  }, [props.sheet]);

  const menuItems = [
    {key: 'divider1', type: 'divider'},
    {key: 'cols-add-before', label: <a onClick={onColsAddBefore} type="text"><ArrowLeftOutlined /> 向左插入1列</a>},
    {key: 'cols-add-after', label: <a onClick={onColsAddAfter} type="text"><ArrowRightOutlined /> 向右插入1列</a>},
    {key: 'cols-set-width', label: <a onClick={onColsWidthUpdate} type="text">列宽设置</a>},
    {key: 'cols-delete', label: <a onClick={onColsDelete} type="text">删除列</a>},
    {key: 'divider2', type: 'divider'},
    {key: 'rows-add-before', label: <a type="text"><ArrowUpOutlined /> 向上插入1行</a>},
    {key: 'rows-add-after', label: <a type="text"><ArrowDownOutlined /> 向下插入1行</a>},
    {key: 'rows-set-width', label: <a type="text">行高设置</a>},
    {key: 'rows-auto-width', label: <a type="text">行高自适应</a>},
    {key: 'rows-delete', label: <a type="text">删除行</a>},
    {key: 'divider3', type: 'divider'},
  ];

  return (
    <Dropdown className='sheet-pop' menu={{items: menuItems}}>
      <Button size="small" type="text" onClick={(e: any) => e.stopPropagation()}><EllipsisOutlined /></Button>
    </Dropdown>
  );
});

export default SheetPop;
