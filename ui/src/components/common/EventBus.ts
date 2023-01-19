import { MovePlace } from "../catalog/CatalogModel";
import { WikiMode, WikiType } from "../wiki/WikiModel";

export type EventType = 
  // __________ wiki __________
  | 'wiki.name.updated'
  | 'wiki.title.updated'
  | 'wiki.create'
  | 'wiki.deleted'
  | 'wiki.moved'
  // __________ sheet __________
  // __________ sheet: cols __________
  | 'sheet.cols.add' | 'sheet.cols.added'
  | 'sheet.cols.delete' | 'sheet.cols.deleted'
  | 'sheet.cols.width.update' | 'sheet.cols.width.updated'
  // __________ sheet: cols __________
  | 'sheet.rows.add' | 'sheet.rows.added'
  | 'sheet.rows.delete' | 'sheet.rows.deleted'
  | 'sheet.rows.height.update' | 'sheet.rows.height.updated'
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

export type SheetTarget = 'col' | 'row' | 'cell';

export type SheetAt = 'self' | 'before' | 'after';

interface SheetUpdate {
  target: SheetTarget,
  col?: number,
  row?: number,
  at?: SheetAt,
  size?: number,
  width?: number,
  height?: number,
};

export interface SheetColsAdd extends SheetUpdate {};

export interface SheetColsDelete extends SheetUpdate {};

export interface SheetColsWidthUpdate extends SheetUpdate {};

export interface SheetRowsAdd extends SheetUpdate {};

export interface SheetRowsDelete extends SheetUpdate {};

export interface SheetRowsHeightUpdate extends SheetUpdate {};

// __________ event data union __________

export type EventData = 
  // __________ wiki __________
  | WikiNameUpdatedEventData
  | WikiTitleUpdatedEventData
  | WikiCreatedEventData
  | WikiDeletedEventData
  | WikiMovedEventData
  // __________ sheet __________
  | SheetColsAdd | SheetColsDelete | SheetColsWidthUpdate
  | SheetRowsAdd | SheetRowsDelete | SheetRowsHeightUpdate
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
