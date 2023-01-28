import CatalogTree from "./CatalogTree";
import "./CatalogStyle.css";
import { useCallback, useEffect, useState } from "react";
import WikiPage from "../wiki/WikiPage";
import { history, useModel } from "umi";
import EventBus, { 
  WikiCreatedEventData,
  WikiDeletedEventData,
  WikiMovedEventData,
  WikiNameUpdatedEventData,
  WikiTitleUpdatedEventData } from "@/components/common/EventBus";
import { EventType } from "@/components/common/EventBus";
import Time from "@/components/common/Time";
import LocalStore from "../common/LocalStore";
import { BasicWiki } from "../wiki/WikiModel";
import WikiApi from "../wiki/WikiApi";
import SheetPage from "../sheet/SheetPage";
import Loc from "../common/Loc";

export interface CatalogProps {
  refresh?: string,
  name?: string,
};

export const Catalog = (props: CatalogProps) => {

  // console.log(`Catalog: render: name(${props.name}): refresh(${props.refresh})`);

  // __________ state __________

  const [catalogWidth, setCatalogWidth] = useState<number>(400);
  const [refreshCatalog, setRefreshCatalog] = useState<string>(props.refresh || 'init');
  const [wiki, setWiki] = useState<BasicWiki|null>(null);

  useEffect(() => {
  }, [catalogWidth]);

  // __________ effect: refresh -> CatalogTree __________

  useEffect(() => {
    if (!props.refresh) return;
    setRefreshCatalog(props.refresh);
  }, [props.refresh]);

  // __________ effect: props.name -> wiki __________

  useEffect(() => {
    // console.log(`Catalog: effect: name(${props.name})`)
    setWiki(null);
    if (!props.name) return;
    WikiApi.basic(props.name, (wiki: BasicWiki) => {
      setWiki(wiki);
      // selectSheet(wiki.type == 'sheet' ? wiki.name : null);
    });
  }, [props.name]);

  // __________ event: wiki updates __________

  const onSelect = (names: string[]) => {
    const pathWikiName = Loc.getWikiName();
    const selectWikiName = names[0];
    if (pathWikiName == selectWikiName) return;
    history.push(`/wiki/${selectWikiName}`);
  };

  const onWikiNameUpdated = useCallback((data: any) => {
    const eventData = data as WikiNameUpdatedEventData;
    if (!eventData) return;
    LocalStore.setCatalogSelectedKeys([eventData.name]);
    setRefreshCatalog(Time.refreshSignal());
  }, []);

  const onWikiTitleUpdated = useCallback((data: any) => {
    const eventData = data as WikiTitleUpdatedEventData;
    if (!eventData) return;
    setRefreshCatalog(Time.refreshSignal());
  }, []);

  const onWikiCreated = useCallback((data: any) => {
    const eventData = data as WikiCreatedEventData;
    if (!eventData) return;
    setRefreshCatalog(Time.refreshSignal());
  }, []);

  const onWikiDeleted = useCallback((data: any) => {
    const eventData = data as WikiDeletedEventData;
    if (!eventData) return;
    LocalStore.removeCatalogSelectedKeys([eventData.name]);
    setRefreshCatalog(Time.refreshSignal());
  }, []);

  const onWikiMoved = useCallback((data: any) => {
    const eventData = data as WikiMovedEventData;
    if (!eventData) return;
    setRefreshCatalog(Time.refreshSignal());
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

  // __________ ui __________

  return (
    <div>
      <CatalogTree className="catalog-side" width={catalogWidth} onSelect={onSelect} refreshSignal={refreshCatalog} />
      <div className="catalog-wiki" style={{marginLeft: catalogWidth}}>
        {wiki && (
          wiki.type == 'wiki' ? <WikiPage data={wiki} /> :
          (wiki.type == 'sheet' ? <SheetPage data={wiki} /> :
          (<div>cannot render ${wiki.type}</div>))
        )}
      </div>
    </div>
  );
};

export default Catalog;
