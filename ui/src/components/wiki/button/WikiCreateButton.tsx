
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import WikiApi from "../api/WikiApi";
import { history } from "umi";
import { useCallback } from "react";

export interface WikiCreateButtonProps {
  className?: string,
};

export default (props: WikiCreateButtonProps) => {
  const onClick = useCallback(() => {
    WikiApi.create((path: string) => {
      history.push(`/wiki/${path}`);
    });
  }, []);

  return <Button className={props.className} onClick={onClick} size="small" type="text"><PlusOutlined /></Button>;
};
