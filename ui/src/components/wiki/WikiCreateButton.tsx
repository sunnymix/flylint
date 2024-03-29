import { Button } from "antd";
import { FileTextFilled, FileExcelFilled } from "@ant-design/icons";
import WikiApi from "./WikiApi";
import { history } from "umi";
import { useCallback } from "react";
import { WikiMode } from "./WikiModel";
import EventBus, { WikiCreatedEventData } from "@/components/common/EventBus";
import LocalStore from "@/components/common/LocalStore";
import { WikiType } from "./WikiModel";

export interface WikiCreateButtonProps {
  mode: WikiMode,
  catalogName?: string,
  className?: string,
};

export default (props: WikiCreateButtonProps) => {

  const create = useCallback((event: any, type: WikiType) => {
    event.stopPropagation();

    if (props.mode === "wiki") {
      WikiApi.create(type, (name: string) => {
        history.push(`/wiki/${name}`);
      });
    }

    if (props.mode === "catalog" && !!props.catalogName) {
      WikiApi.createByCatalogName(props.catalogName, type, (name) => {
        const eventData = {
          type,
          mode: props.mode,
          name,
          catalogName: props.catalogName,
        } as WikiCreatedEventData;

        EventBus.dispatch("wiki.create", eventData);
        LocalStore.appendCatalogExpandKeys(props.catalogName ? [props.catalogName] : []);

        LocalStore.setCatalogSelectedKeys([name]);
        history.push(`/wiki/${name}`);
      });
    }
  }, [props.catalogName]);

  return <div style={{display: 'inline-flex'}}>
    <Button className={props.className} onClick={(event) => create(event, 'wiki')} size="small" type="text"><FileTextFilled style={{color: '#1677ff'}} /></Button>
    <Button className={props.className} onClick={(event) => create(event, 'sheet')} size="small" type="text"><FileExcelFilled style={{color: '#52c41a'}} /></Button>
  </div>;
};
