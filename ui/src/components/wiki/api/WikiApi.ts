
import axios from "axios";
import Constant from "@/components/common/Constant";
import { BasicWiki } from "../model/WikiModel";

const basicQuery = (keyword?: string, cb?: (data: BasicWiki[]) => void) => {
  axios.get(`${Constant.API_BASE}/wiki/query?keyword=${keyword || ''}`)
    .then(res => {
      const wikis = res.data?.data || [];
      cb?.call(null, wikis);
    });
};

export default {
  basicQuery,
};
