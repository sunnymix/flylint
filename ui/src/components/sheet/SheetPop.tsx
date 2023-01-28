import React, { forwardRef, useCallback } from "react";
import { Button, Dropdown, Popconfirm } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined, ArrowUpOutlined, ArrowDownOutlined, EllipsisOutlined, DownOutlined, MoreOutlined, CaretDownFilled } from '@ant-design/icons';
import { SheetColsAdd, SheetRowsAdd, defaultWidth, defaultHeight } from './SheetApi';
import LocalStore from "../common/LocalStore";
import { useModel } from "umi";
import { addCols, addRows } from '@/components/sheet/sheetSlice';
import { useAppDispatch } from "@/hook/hook";

const SheetPop = forwardRef((props: {sheet: string, col: number, row: number}, ref: any) => {
  const {sheet, col, row} = props;
  const dispatch = useAppDispatch();

  const onColsAddBefore = useCallback((e: React.UIEvent) => {
    dispatch(addCols({sheet, afterCol: col - 1, size: 1, width: defaultWidth} as SheetColsAdd));
  }, []);

  const onColsAddAfter = useCallback((e: React.UIEvent) => {
    dispatch(addCols({sheet, afterCol: col, size: 1, width: defaultWidth} as SheetColsAdd));
  }, []);

  const onRowsAddBefore = useCallback((e: React.UIEvent) => {
    dispatch(addRows({sheet, afterRow: row - 1, size: 1, height: defaultHeight} as SheetRowsAdd));
  }, []);

  const onRowsAddAfter = useCallback((e: React.UIEvent) => {
    dispatch(addRows({sheet, afterRow: row, size: 1, height: defaultHeight} as SheetRowsAdd));
  }, []);

  const colItems = [
    {key: 'divider-col', type: 'divider'},
    {key: 'cols-add-before', label: <a onClick={onColsAddBefore} type="text"><ArrowLeftOutlined /> 向左插入1列</a>},
    {key: 'cols-add-after', label: <a onClick={onColsAddAfter} type="text"><ArrowRightOutlined /> 向右插入1列</a>},
    {key: 'cols-set-width', label: <a type="text">列宽设置</a>},
    {key: 'cols-delete', label: <a type="text">删除列</a>},
  ];

  const rowItems = [
    {key: 'divider-row', type: 'divider'},
    {key: 'rows-add-before', label: <a onClick={onRowsAddBefore} type="text"><ArrowUpOutlined /> 向上插入1行</a>},
    {key: 'rows-add-after', label: <a onClick={onRowsAddAfter} type="text"><ArrowDownOutlined /> 向下插入1行</a>},
    {key: 'rows-set-width', label: <a type="text">行高设置</a>},
    {key: 'rows-auto-width', label: <a type="text">行高自适应</a>},
    {key: 'rows-delete', label: <a type="text">删除行</a>},
  ];

  let items: any[] = [];
  if (col > 0) items = [...colItems];
  if (row > 0) items = [...rowItems];
  if (col == 0 && row == 0) items = [...colItems, ...rowItems];

  return (
    <Dropdown className='sheet-pop' menu={{items: items}} placement='bottom'>
      <div className='sheet-pop-body'>
        <Button className ='sheet-pop-btn' size='small' type='text'><CaretDownFilled /></Button>
      </div>
    </Dropdown>
  );
});

export default SheetPop;
