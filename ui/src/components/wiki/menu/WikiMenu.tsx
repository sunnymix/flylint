
import { Button, Dropdown, Popconfirm } from "antd";
import WikiApi from "../api/WikiApi";
import { history } from "umi";
import { MenuOutlined } from "@ant-design/icons";
import { WikiMode } from "../model/WikiModel";
import EventBus, { WikiNameUpdatedEventData, WikiTitleUpdatedEventData } from "@/components/common/EventBus";
import { EventType } from "@/components/common/EventBus";

export const onUpdateTitle = (mode: WikiMode, name: string, title: string, cb?: (data: WikiTitleUpdatedEventData) => void) => {
  const newTitle = prompt("Update Title:", title);
  if (!newTitle || newTitle.trim().length < 0) {
    return;
  }

  WikiApi.updateTitle(name, newTitle, (success: boolean, updatedTitle: string) => {
    if (!success || !updatedTitle) {
      return;
    }
    
    const eventData = {
      mode,
      name,
      title: updatedTitle,
    } as WikiTitleUpdatedEventData;

    EventBus.dispatch("wiki.title.updated", eventData);
    cb?.call(null, eventData);
  });
}

export interface WikiMenuProps {
  mode: WikiMode,
  name: string,
  title: string,
  className?: string,
  onNameUpdated?: (data: WikiNameUpdatedEventData) => void,
  onTitleUpdated?: (data: WikiTitleUpdatedEventData) => void,
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

      const eventData = {
        mode: props.mode,
        name: updatedName,
        oldName: props.name,
      } as WikiNameUpdatedEventData;

      EventBus.dispatch("wiki.name.updated", eventData);
      props.onNameUpdated?.call(null, eventData);
      
      history.push(`/${props.mode}/${updatedName}`);
    });
  };

  const clickUpdateTitle = () => {
    onUpdateTitle(props.mode, props.name, props.title, (data: WikiTitleUpdatedEventData) => {
      props.onTitleUpdated?.call(null, data);
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
      <Button size="small" type="text"><MenuOutlined /></Button>
    </Dropdown>
  );
};
