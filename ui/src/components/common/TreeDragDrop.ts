import TreeDataType from "antd/es/tree";
import NodeDragEventParams from "antd/es/tree";
import CatalogApi from "../catalog/api/CatalogApi";
import { MovePlace } from "../catalog/model/CatalogModel";
import EventBus, { WikiMovedEventData } from "./EventBus";

const TreeDragDrop = {

  convertPlace(info: any) {
    if (!info.dropToGap) {
      return "child" as MovePlace;
    }
    if (info.dropToGap && info.dropPosition < 0) {
      return "previous" as MovePlace;
    }
    if (info.dropToGap && info.dropPosition >= 0) {
      return "next" as MovePlace;
    }
    return "unknown" as MovePlace;
  },

  onDrop(info: any) {
    const dragNode = info.dragNode;
    const dropNode = info.node;
    console.log(`DD: ${dragNode.key} -> ${dropNode.key}, isGap = ${info.dropToGap}, info:`, info);
    const name = dragNode.key;
    const toName = dropNode.key;
    const place = TreeDragDrop.convertPlace(info);
    CatalogApi.move(name, toName, place, (success: boolean) => {
      EventBus.dispatch("wiki.moved", {
        mode: "catalog",
        name,
        toName,
        place,
      } as WikiMovedEventData)
    });
  },

};

export default TreeDragDrop;
