
import axios from "axios";
import Constant from "@/components/common/Constant";
import { BasicWiki, DetailWiki } from "../model/WikiModel";

const create = (cb: (path: string) => void) => {
  axios.post(`${Constant.API_BASE}/wiki/create`, {})
    .then(res => {
      const path = res.data?.data || null;
      cb(path);
    });
};

const updateTitle = (path: string, title: string, cb: (success: boolean, updatedTitle: string) => void) => {
  axios.post(`${Constant.API_BASE}/wiki/${path}/update/title`, {title})
    .then(res => {
      const success = res.data?.success || false;
      const updatedTitle = res.data?.data || null;
      cb(success, updatedTitle);
    });
};

const updatePath = (path: string, newPath: string, cb: (success: boolean, updatedPath: string) => void) => {
  axios.post(`${Constant.API_BASE}/wiki/${path}/update/path/${newPath}`, {})
    .then(res => {
      const success = res.data?.success || false;
      const updatedPath = res.data?.data || null;
      cb(success, updatedPath);
    });
};

const updateContent = (path: string, content: string, cb: (success: boolean) => void) => {
  axios.post(`${Constant.API_BASE}/wiki/${path}/update/content`, {content})
    .then(res => {
      const success = res.data?.success || false;
      cb(success);
    });
};

const remove = (path: string, cb: (success: boolean) => void) => {
  axios.post(`${Constant.API_BASE}/wiki/${path}/remove`, {})
    .then(res => {
      const success = res.data?.success || false;
      cb(success);
    });
};

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
  create,
  updateTitle,
  updatePath,
  updateContent,
  remove,
  query,
  detail,
};
