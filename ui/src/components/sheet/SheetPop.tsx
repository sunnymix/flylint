import { forwardRef } from "react";
import { Button, Dropdown, Popconfirm } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined, ArrowUpOutlined, ArrowDownOutlined, EllipsisOutlined, CloseOutlined } from '@ant-design/icons';

export interface SheetPopProps {};

const SheetPop = forwardRef((props: SheetPopProps, ref: any) => {

  const menuItems = [
    {key: 'cols-add-before', label: <a type="text"><ArrowLeftOutlined /> 向左插入1列</a>},
    {key: 'cols-add-after', label: <a type="text"><ArrowRightOutlined /> 向右插入1列</a>},
    {key: 'cols-set-width', label: <a type="text"><EllipsisOutlined /> 列宽设置</a>},
    {key: 'cols-delete', label: <a type="text"><CloseOutlined /> 删除列</a>},
    {key: '', type: 'divider'},
    {key: 'rows-add-before', label: <a type="text"><ArrowUpOutlined /> 向上插入1行</a>},
    {key: 'rows-add-after', label: <a type="text"><ArrowDownOutlined /> 向下插入1行</a>},
    {key: 'rows-delete', label: <a type="text"><CloseOutlined /> 删除行</a>},
    {key: '', type: 'divider'},
  ];

  return (
    <Dropdown className='sheet-pop' menu={{items: menuItems}}>
      <Button size="small" type="text" onClick={(e: any) => e.stopPropagation()}><EllipsisOutlined /></Button>
    </Dropdown>
  );
});

export default SheetPop;
