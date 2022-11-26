import CatalogTree from "./CatalogTree";
import "./CatalogStyle.css";
import { useCallback, useEffect, useState } from "react";
import WikiDetail from "../wiki/WikiDetail";
import { history } from "umi";
import EventBus, { WikiCreatedEventData, WikiDeletedEventData, WikiMovedEventData, WikiNameUpdatedEventData, WikiTitleUpdatedEventData } from "@/components/common/EventBus";
import { EventType } from "@/components/common/EventBus";
import Time from "@/components/common/Time";
import LocalStore from "../common/LocalStore";

export interface CatalogProps {
  defaultName?: string,
  refreshSignal?: string,
};

export const Catalog = (props: CatalogProps) => {

  const [refreshSignal, setRefreshSignal] = useState<string>('');

  useEffect(() => {
    if (!props.refreshSignal) return;
    setRefreshSignal(props.refreshSignal);
  }, [props.refreshSignal]);

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
    setRefreshSignal(Time.refreshSignal());
  }, []);

  const onWikiDeleted = useCallback((data: any) => {
    const eventData = data as WikiDeletedEventData;
    if (!eventData) return;
    LocalStore.removeCatalogSelectedKeys([eventData.name]);
    setRefreshSignal(Time.refreshSignal());
  }, []);

  const onWikiMoved = useCallback((data: any) => {
    const eventData = data as WikiMovedEventData;
    if (!eventData) return;
    setRefreshSignal(Time.refreshSignal());
  }, []);

  useEffect(() => {
    EventBus.on("wiki.name.updated", onWikiNameUpdated);
    EventBus.on("wiki.title.updated", onWikiTitleUpdated);
    EventBus.on("wiki.create", onWikiCreated);
    EventBus.on("wiki.deleted", onWikiDeleted);
    EventBus.on("wiki.moved", onWikiMoved);
    
    return () => {
      EventBus.remove("wiki.name.updated", onWikiNameUpdated);
      EventBus.remove("wiki.title.updated", onWikiTitleUpdated);
      EventBus.remove("wiki.create", onWikiCreated);
      EventBus.remove("wiki.deleted", onWikiDeleted);
      EventBus.remove("wiki.moved", onWikiMoved);
    };
  }, []);

  return (
    <div>
      <CatalogTree className="catalog_side" width={400} onSelect={onSelect} refreshSignal={refreshSignal} />
      <div className="catalog_wiki" style={{marginLeft: 400}}>
        <div className="wiki">
          {props.defaultName && <WikiDetail name={props.defaultName} mode="catalog" />}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
