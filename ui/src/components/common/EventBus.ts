
export type EventType = 
  | "wiki.name.updated"
  | "wiki.title.updated"
;

const EventBus = {
  on(eventType: EventType, cb: (data: any) => void) {
    document.addEventListener(eventType, (data: any) => cb(data));
  },

  dispatch(eventType: EventType, data: any) {
    const event = new CustomEvent<any>(eventType, data)
    document.dispatchEvent(event);
  },

  remove(eventType: EventType, cb: (data: any) => void) {
    document.removeEventListener(eventType, cb);
  },

};

export default EventBus;
