import axios from "axios";
import Constant from "@/components/common/Constant";
import { CatalogTree } from "./CatalogModel";
import { MovePlace } from "./CatalogModel";

const query = (cb: (trees: CatalogTree[]) => void) => {
  axios.get(`${Constant.API_BASE}/catalog/query`)
    .then(res => {
      const trees = res.data?.data || [];
      cb(trees);
    });
};

const move = (name: string, toName: string, place: MovePlace, cb: (success: boolean) => void) => {
  axios.post(`${Constant.API_BASE}/catalog/move`, { name, toName, place})
    .then(res => {
      const success = res.data?.success || false;
      cb(success);
    });
};

const nodes = (cb: (nodeNames: string[]) => void) => {
  axios.get(`${Constant.API_BASE}/catalog/nodes`)
    .then(res => {
      const nodeNames = res.data?.data || [];
      cb(nodeNames);
    });
};

const CatalogApi = {
  query,
  move,
  nodes,
};

export default CatalogApi;
