
import CatalogTree from "./tree/CatalogTree";
import "./CatalogStyle.css";
import { useCallback, useEffect, useState } from "react";
import WikiDetail from "../wiki/detail/WikiDetail";
import { history } from "umi";
import { SELECTED_KEYS } from "./tree/CatalogTree";
import EventBus, { WikiCreatedEventData, WikiDeletedEventData, WikiNameUpdatedEventData } from "@/components/common/EventBus";
import { EventType } from "@/components/common/EventBus";
import Time from "@/components/common/Time";

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
    if (!eventData) {
      return;
    }

    localStorage.setItem(SELECTED_KEYS, JSON.stringify([eventData.name]));
    setRefreshSignal(Time.refreshSignal());
  }, []);

  const onWikiCreated = useCallback((data: any) => {
    const eventData = data as WikiCreatedEventData;
    if (!eventData) {
      return;
    }

    localStorage.setItem(SELECTED_KEYS, JSON.stringify([eventData.name]));
    setRefreshSignal(Time.refreshSignal());
  }, []);

  const onWikiDeleted = useCallback((data: any) => {
    const eventData = data as WikiDeletedEventData;
    if (!eventData) {
      return;
    }

    const names = JSON.parse(localStorage.getItem(SELECTED_KEYS) || "[]");
    if (!names || !names.length) {
      return;
    }
    
    if (!names.includes(eventData.name)) {
      return;
    }

    localStorage.removeItem(SELECTED_KEYS);
  }, []);

  useEffect(() => {
    EventBus.on("wiki.name.updated", onWikiNameUpdated);
    EventBus.on("wiki.create", onWikiCreated);
    EventBus.on("wiki.deleted", onWikiDeleted);
    
    return () => {
      EventBus.remove("wiki.name.updated", onWikiNameUpdated);
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
