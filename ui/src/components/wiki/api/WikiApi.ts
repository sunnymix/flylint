
import axios from "axios";
import Constant from "@/components/common/Constant";
import { BasicWiki, DetailWiki } from "../model/WikiModel";

const query = (keyword: string|null, cb: (wikis: BasicWiki[]) => void) => {
  axios.get(`${Constant.API_BASE}/wiki/query?keyword=${keyword || ''}`)
    .then(res => {
      const wikis = res.data?.data || [];
      cb(wikis);
    });
};

const detail = (path: string, cb: (wiki: DetailWiki) => void) => {
  axios.get(`${Constant.API_BASE}/wiki/${path}`)
    .then(res => {
      const wiki = res.data?.data || null;
      cb(wiki);
    });
};

export default {
  query,
  detail,
};
