
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import WikiApi from "../api/WikiApi";
import { history } from "umi";
import { useCallback } from "react";
import { WikiMode } from "../model/WikiModel";

export interface WikiCreateButtonProps {
  mode: WikiMode,
  className?: string,
};

export default (props: WikiCreateButtonProps) => {
  const onClick = useCallback(() => {
    WikiApi.create((path: string) => {
      history.push(`/${props.mode}/${path}`);
    });
  }, []);

  return <Button className={props.className} onClick={onClick} size="small" type="text">
    <PlusOutlined />
  </Button>;
};
