import { MovePlace } from "../catalog/CatalogModel";
import { WikiMode, WikiType } from "../wiki/WikiModel";

export type EventType = 
  // __________ wiki __________
  | 'wiki.name.updated'
  | 'wiki.title.updated'
  | 'wiki.create'
  | 'wiki.deleted'
  | 'wiki.moved'
  // __________ sheet: cols __________
  | 'sheet.cols.add' | 'sheet.cols.added'
  | 'sheet.cols.delete' | 'sheet.cols.deleted'
  | 'sheet.cols.move' | 'sheet.cols.moved'
;

// __________ wiki __________

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

// __________ sheet: cols __________

// __________ event data union __________

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
