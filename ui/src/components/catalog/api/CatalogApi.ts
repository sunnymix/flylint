
import axios from "axios";
import Constant from "@/components/common/Constant";
import { CatalogTree } from "../model/CatalogModel";

const query = (cb: (trees: CatalogTree[]) => void) => {
  axios.get(`${Constant.API_BASE}/catalog/query`)
    .then(res => {
      const trees = res.data?.data || [];
      cb(trees);
    });
};

export const CatalogApi = {
  query,
};

export default CatalogApi;
