
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import WikiApi from "../api/WikiApi";
import { history } from "umi";
import { useCallback } from "react";

export default () => {
  const onClick = useCallback(() => {
    WikiApi.create((path: string) => {
      history.push(`/wiki/${path}`);
    });
  }, []);

  return <Button onClick={onClick} size="small" type="text"><PlusOutlined /></Button>;
};
