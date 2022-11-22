import { WikiMode } from "../wiki/model/WikiModel";

export type EventType = 
  | "wiki.name.updated"
  | "wiki.title.updated"
  | "wiki.create"
  | "wiki.deleted"
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
  mode: WikiMode,
  name: string,
  catalogName: string,
};

export interface WikiDeletedEventData {
  mode: WikiMode,
  name: string,
};

export type EventData = 
  | WikiNameUpdatedEventData
  | WikiTitleUpdatedEventData
  | WikiCreatedEventData
  | WikiDeletedEventData
;

const EventBus = {
  on(eventType: EventType, cb: (data: any|EventData) => void) {
    document.addEventListener(eventType, (data: any|EventData) => cb(data));
  },

  dispatch(eventType: EventType, data: any|EventData) {
    const event = new CustomEvent<any>(eventType, data)
    document.dispatchEvent(event);
  },

  remove(eventType: EventType, cb: (data: any|EventData) => void) {
    document.removeEventListener(eventType, cb);
  },

};

export default EventBus;
