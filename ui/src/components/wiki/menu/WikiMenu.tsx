
import { Button, Dropdown, Popconfirm } from "antd";
import { EllipsisOutlined} from "@ant-design/icons";
import WikiApi from "../api/WikiApi";
import { history } from "umi";

export interface WikiMenuProps {
  path: string,
  title: string,
  className?: string,
};

export default (props: WikiMenuProps) => {

  const clickUpdateTitle = () => {
    const newTitle = prompt("Update title of this wiki:", props.title);
    if (!newTitle || newTitle.trim().length < 0) {
      return;
    }
    WikiApi.updateTitle(props.path, newTitle, (success: boolean, updatedTitle: string) => {
      if (!success || !updatedTitle) {
        return;
      }
      location.reload();
    });
  };

  const clickUpdatePath = () => {
    const newPath = prompt("Update path of this wiki:", props.path);
    if (!newPath || newPath.trim().length < 0) {
      return;
    }
    WikiApi.updatePath(props.path, newPath, (success: boolean, updatedPath: string) => {
      if (!success || !updatedPath) {
        return;
      }
      history.push(`/wiki/${updatedPath}`);
    });
  };

  const clickDelete = () => {
    WikiApi.remove(props.path, (success: boolean) => {
      history.push("/wiki");
    });
  };

  const menuItems = [
    {key: "update-wiki-name", label: <Button size="small" type="link" onClick={clickUpdateTitle}>Rename</Button>},
    {key: "update-wiki-path", label: <Button size="small" type="link" onClick={clickUpdatePath}>Change Path</Button>},
    {key: "delete-wiki", label: <Popconfirm onConfirm={clickDelete} title="Sure to delete this wiki?" okText="Confirm" icon="">
        <Button size="small" type="link">Delete</Button></Popconfirm>},
  ];

  return (
    <Dropdown menu={{items: menuItems}} trigger={['click']} className={props.className}>
      <Button size="small" type="text"><EllipsisOutlined /></Button>
    </Dropdown>
  );
};
