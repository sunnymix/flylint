import CatalogTree from "./tree/CatalogTree";
import "./CatalogStyle.css";
import { useCallback, useEffect, useState } from "react";
import WikiDetail from "../wiki/detail/WikiDetail";
import { history } from "umi";
import EventBus, { WikiCreatedEventData, WikiDeletedEventData, WikiNameUpdatedEventData, WikiTitleUpdatedEventData } from "@/components/common/EventBus";
import { EventType } from "@/components/common/EventBus";
import Time from "@/components/common/Time";
import LocalStore from "../common/LocalStore";

// TODO:
// - wiki create button

export interface CatalogProps {
  defaultName?: string
};

export const Catalog = (props: CatalogProps) => {

  const [refreshSignal, setRefreshSignal] = useState<string>(Time.refreshSignal());

  const onSelect = (names: string[]) => {
    history.push(`/catalog/${names[0]}`);
  };

  const onWikiNameUpdated = useCallback((data: any) => {
    const eventData = data as WikiNameUpdatedEventData;
    if (!eventData) return;
    LocalStore.setCatalogSelectedKeys([eventData.name]);
    setRefreshSignal(Time.refreshSignal());
  }, []);

  const onWikiTitleUpdated = useCallback((data: any) => {
    const eventData = data as WikiTitleUpdatedEventData;
    if (!eventData) return;
    setRefreshSignal(Time.refreshSignal());
  }, []);

  const onWikiCreated = useCallback((data: any) => {
    const eventData = data as WikiCreatedEventData;
    if (!eventData) return;
    LocalStore.setCatalogSelectedKeys([eventData.name]);
    setRefreshSignal(Time.refreshSignal());
  }, []);

  const onWikiDeleted = useCallback((data: any) => {
    const eventData = data as WikiDeletedEventData;
    if (!eventData) return;
    LocalStore.removeCatalogSelectedKeys([eventData.name]);
  }, []);

  useEffect(() => {
    EventBus.on("wiki.name.updated", onWikiNameUpdated);
    EventBus.on("wiki.title.updated", onWikiTitleUpdated);
    EventBus.on("wiki.create", onWikiCreated);
    EventBus.on("wiki.deleted", onWikiDeleted);
    
    return () => {
      EventBus.remove("wiki.name.updated", onWikiNameUpdated);
      EventBus.remove("wiki.title.updated", onWikiTitleUpdated);
      EventBus.remove("wiki.create", onWikiCreated);
      EventBus.remove("wiki.deleted", onWikiDeleted);
    };
  }, []);

  

  return (
    <div>
      <CatalogTree className="catalog_tree" width={400} onSelect={onSelect} refreshSignal={refreshSignal} />
      <div className="catalog_body" style={{marginLeft: 400}}>
        <div className="wiki">
          {props.defaultName && <WikiDetail name={props.defaultName} mode="catalog" />}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
