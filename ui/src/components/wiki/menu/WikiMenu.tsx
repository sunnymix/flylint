
import { Button, Dropdown, Popconfirm } from "antd";
import WikiApi from "../api/WikiApi";
import { history } from "umi";
import { EllipsisOutlined } from "@ant-design/icons";

export interface WikiMenuProps {
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
      history.push(`/wiki/${updatedName}`);
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
      history.push("/wiki");
    });
  };

  const menuItems = [
    {key: "update-wiki-title", label: <Button size="small" type="link" onClick={clickUpdateTitle}>Update Title</Button>},
    {key: "update-wiki-name", label: <Button size="small" type="link" onClick={clickUpdateName}>Update Name</Button>},
    {key: "delete-wiki", label: <Popconfirm onConfirm={clickDelete} title="Sure to delete this wiki?" okText="Confirm" icon="">
        <Button size="small" type="link">Delete</Button></Popconfirm>},
  ];

  return (
    <Dropdown menu={{items: menuItems}} trigger={['click']} className={props.className}>
      <Button size="small" type="text"><EllipsisOutlined /></Button>
    </Dropdown>
  );
};
