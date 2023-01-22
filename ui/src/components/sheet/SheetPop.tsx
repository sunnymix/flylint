import React, { forwardRef, useCallback } from "react";
import { Button, Dropdown, Popconfirm } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined, ArrowUpOutlined, ArrowDownOutlined, EllipsisOutlined, CloseOutlined } from '@ant-design/icons';
import EventBus, { SheetColsAdd, SheetColsDelete, SheetColsWidthUpdate } from './SheetApi';
import LocalStore from "../common/LocalStore";
import { useModel } from "umi";

const SheetPop = forwardRef((props: {col: number, row: number}, ref: any) => {
  const {col, row} = props;

  const {
    sheet,
    cols,
    addCols,
  } = useModel('sheet', m => ({
    sheet: m.sheet,
    cols: m.cols,
    addCols: m.addCols}));

  const onColsAddBefore = useCallback((e: React.UIEvent) => {
    if (!sheet) return;
    addCols(sheet, cols, {target: 'col', col, row, at: 'before', size: 1} as SheetColsAdd);
  }, [sheet, cols, col, row]);

  const onColsAddAfter = useCallback((e: React.UIEvent) => {
    if (!sheet) return;
    addCols(sheet, cols, {target: 'col', col, row, at: 'after', size: 1} as SheetColsAdd);
  }, [sheet, cols, col, row]);

  const onColsWidthUpdate = useCallback((e: React.UIEvent) => {
  }, []);

  const onColsDelete = useCallback((e: React.MouseEvent) => {
  }, []);

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