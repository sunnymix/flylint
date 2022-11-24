import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import WikiApi from "./WikiApi";
import { history } from "umi";
import { useCallback } from "react";
import { WikiMode } from "./WikiModel";
import EventBus, { WikiCreatedEventData } from "@/components/common/EventBus";
import LocalStore from "@/components/common/LocalStore";

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
      WikiApi.createByCatalogName(props.catalogName, (name) => {
        const eventData = {
          mode: props.mode,
          name,
          catalogName: props.catalogName,
        } as WikiCreatedEventData;

        EventBus.dispatch("wiki.create", eventData);
        LocalStore.appendCatalogExpandKeys(props.catalogName ? [props.catalogName] : []);

        if (props.mode == "catalog") return;

        history.push(`/${props.mode}/${name}`);
      });
    }
  }, [props.catalogName]);

  return <Button className={props.className} onClick={onClick} size="small" type="text">
    <PlusOutlined />
  </Button>;
};
