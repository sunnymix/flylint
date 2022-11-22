
import { Button, Dropdown, Popconfirm } from "antd";
import WikiApi from "../api/WikiApi";
import { history } from "umi";
import { EllipsisOutlined } from "@ant-design/icons";
import { WikiMode } from "../model/WikiModel";
import EventBus, { WikiNameUpdatedEventData } from "@/components/common/EventBus";
import { EventType } from "@/components/common/EventBus";

export interface WikiMenuProps {
  mode: WikiMode,
  name: string,
  title: string,
  className?: string,
};

export default (props: WikiMenuProps) => {

  const clickUpdateName = () => {
    const newName = prompt("Update name of this wiki:", props.name);
    if (!newName || newName.trim().length < 0) {
      return;
    }
    WikiApi.updateName(props.name, newName, (success: boolean, updatedName: string) => {
      if (!success || !updatedName) {
        return;
      }
      EventBus.dispatch("wiki.name.updated", {
        mode: props.mode,
        name: updatedName,
        oldName: props.name,
      } as WikiNameUpdatedEventData);
      history.push(`/${props.mode}/${updatedName}`);
    });
  };

  const clickUpdateTitle = () => {
    const newTitle = prompt("Update title of this wiki:", props.title);
    if (!newTitle || newTitle.trim().length < 0) {
      return;
    }
    WikiApi.updateTitle(props.name, newTitle, (success: boolean, updatedTitle: string) => {
      if (!success || !updatedTitle) {
        return;
      }
      location.reload();
    });
  };

  const clickDelete = () => {
    WikiApi.remove(props.name, (success: boolean) => {
      EventBus.dispatch("wiki.deleted", {
        mode: props.mode,
        name: props.name,
      })
      
      history.push(`/${props.mode}`);
    });
  };

  const menuItems = [
    {key: "update-wiki-name", label: <a type="text" onClick={clickUpdateName}>Update Name</a>},
    {key: "update-wiki-title", label: <a type="text" onClick={clickUpdateTitle}>Update Title</a>},
    {key: "delete-wiki", label: <Popconfirm onConfirm={clickDelete} title="Sure to delete this wiki?" okText="Confirm" icon="">
        <a type="text">Delete</a></Popconfirm>},
  ];

  return (
    <Dropdown menu={{items: menuItems}} trigger={['click']} className={props.className}>
      <Button size="small" type="text"><EllipsisOutlined /></Button>
    </Dropdown>
  );
};
