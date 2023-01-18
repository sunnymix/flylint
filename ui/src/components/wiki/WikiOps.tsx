import { Button, Dropdown, Popconfirm } from "antd";
import WikiApi from "./WikiApi";
import { history } from "umi";
import { EllipsisOutlined } from "@ant-design/icons";
import { WikiMode } from "./WikiModel";
import EventBus, { WikiNameUpdatedEventData, WikiTitleUpdatedEventData } from "@/components/common/EventBus";
import { EventType } from "@/components/common/EventBus";

// TODO: rewrite WikiOps

export const onUpdateName = (mode: WikiMode, name: string, cb?: (data: WikiNameUpdatedEventData) => void) => {
  const newName = prompt("name :", name);
    if (!newName || newName.trim().length < 0) return;

    WikiApi.updateName(name, newName, (success: boolean, updatedName: string) => {
      if (!success || !updatedName) return;

      const eventData = {
        mode,
        name: updatedName,
        oldName: name,
      } as WikiNameUpdatedEventData;

      EventBus.dispatch("wiki.name.updated", eventData);
      cb?.call(null, eventData);
    });
};

export const onUpdateTitle = (mode: WikiMode, name: string, title: string, cb?: (data: WikiTitleUpdatedEventData) => void) => {
  const newTitle = prompt("title :", title);
  if (!newTitle || newTitle.trim().length < 0) return;

  WikiApi.updateTitle(name, newTitle, (success: boolean, updatedTitle: string) => {
    if (!success || !updatedTitle) return;
    
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

const WikiOps = (props: WikiMenuProps) => {

  const clickUpdateName = (event: any) => {
    event.stopPropagation();
    onUpdateName(props.mode, props.name, (data: WikiNameUpdatedEventData) => {
      props.onNameUpdated?.call(null, data);
      history.push(`/wiki/${data.name}`);
    });
  };

  const clickUpdateTitle = (e: any) => {
    // e.stopPropagation();
    onUpdateTitle(props.mode, props.name, props.title, (data: WikiTitleUpdatedEventData) => {
      props.onTitleUpdated?.call(null, data);
    });
  };

  const clickDelete = (event: any) => {
    event.stopPropagation();
    WikiApi.remove(props.name, (success: boolean) => {
      EventBus.dispatch("wiki.deleted", {
        mode: props.mode,
        name: props.name,
      })
      
      history.push(`/wiki`);
    });
  };

  const menuItems = [
    // {key: "update-wiki-name", label: <a type="text" onClick={clickUpdateName}>Update Name</a>},
    {key: "update-wiki-title", label: <a type="text" onClick={clickUpdateTitle}>Update Title</a>},
    {key: "delete-wiki", label: <Popconfirm onConfirm={clickDelete} title="Sure to delete this wiki?" okText="Confirm" icon="">
        <a type="text" onClick={(event: any) => event.stopPropagation()}>Delete</a></Popconfirm>},
  ];

  return (
    <Dropdown menu={{items: menuItems}} className={props.className}>
      <Button size="small" type="text" onClick={(event: any) => event.stopPropagation()}><EllipsisOutlined /></Button>
    </Dropdown>
  );
};

export default WikiOps;
