import { MovePlace } from "../catalog/CatalogModel";
import { WikiMode, WikiType } from "../wiki/WikiModel";

export type EventType = 
  | "wiki.name.updated"
  | "wiki.title.updated"
  | "wiki.create"
  | "wiki.deleted"
  | "wiki.moved"
;

export interface WikiNameUpdatedEventData {
  mode: WikiMode,
  name: string,
  oldName: string,
};

export interface WikiTitleUpdatedEventData {
  mode: WikiMode,
  name: string,
  title: string,
};

export interface WikiCreatedEventData {
  type: WikiType,
  mode: WikiMode,
  name: string,
  catalogName: string,
};

export interface WikiDeletedEventData {
  mode: WikiMode,
  name: string,
};

export interface WikiMovedEventData {
  mode: WikiMode,
  name: string,
  toName: string,
  place: MovePlace,
};

export type EventData = 
  | WikiNameUpdatedEventData
  | WikiTitleUpdatedEventData
  | WikiCreatedEventData
  | WikiDeletedEventData
  | WikiMovedEventData
;

const EventBus = {
  on(eventType: EventType, cb: (data: any|EventData) => void) {
    document.addEventListener(eventType, (data: any) => cb(data.detail));
  },

  dispatch(eventType: EventType, data: any|EventData) {
    const event = new CustomEvent<any>(eventType, { detail: data })
    document.dispatchEvent(event);
  },

  remove(eventType: EventType, cb: (data: any|EventData) => void) {
    document.removeEventListener(eventType, cb);
  },

};

export default EventBus;
