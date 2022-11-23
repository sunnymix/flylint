
import axios from "axios";
import Constant from "@/components/common/Constant";
import { CatalogTree } from "../model/CatalogModel";
import { MovePlace } from "../model/CatalogModel";

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

export const CatalogApi = {
  query,
  move,
};

export default CatalogApi;
