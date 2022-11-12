
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

const updateContent = (path: string, content: string, cb: (success: boolean) => void) => {
  axios.post(`${Constant.API_BASE}/wiki/${path}`, {content})
    .then(res => {
      const success = res.data?.success || false;
      cb(success);
    });
};

export default {
  query,
  detail,
  updateContent,
};
