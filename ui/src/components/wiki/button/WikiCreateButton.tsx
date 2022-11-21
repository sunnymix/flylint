
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import WikiApi from "../api/WikiApi";
import { history } from "umi";
import { useCallback } from "react";
import { WikiMode } from "../model/WikiModel";
import EventBus, { WikiCreateEventData } from "@/components/common/EventBus";

export interface WikiCreateButtonProps {
  mode: WikiMode,
  catalogName?: string,
  className?: string,
};

export default (props: WikiCreateButtonProps) => {
  const onClick = useCallback(() => {
    if (props.mode === "wiki") {
      WikiApi.create((name: string) => {
        history.push(`/${props.mode}/${name}`);
      });  
    }

    if (props.mode === "catalog" && !!props.catalogName) {
      console.log("create catalog: ", props.catalogName);

      WikiApi.createByCatalogName(props.catalogName, (name) => {
        EventBus.dispatch("wiki.create", {
          mode: props.mode,
          name,
          catalogName: props.catalogName,
        } as WikiCreateEventData);

        history.push(`/${props.mode}/${name}`);
      });
    }
  }, []);

  return <Button className={props.className} onClick={onClick} size="small" type="text">
    <PlusOutlined />
  </Button>;
};
