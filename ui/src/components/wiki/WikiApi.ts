
import axios from "axios";
import Constant from "@/components/common/Constant";
import { BasicWiki, DetailWiki, WikiType } from "./WikiModel";

const create = (type: WikiType, cb: (name: string) => void) => {
  axios.post(`${Constant.API_BASE}/wiki/create`, { type })
    .then(res => {
      const name = res.data?.data || null;
      cb(name);
    });
};

const createByCatalogName = (catalogName: string, type: WikiType, cb: (name: string) => void) => {
  axios.post(`${Constant.API_BASE}/wiki/create`, { catalogName, type })
    .then(res => {
      const name = res.data?.data || null;
      cb(name);
    });
};

const updateName = (name: string, newName: string, cb: (success: boolean, updatedName: string) => void) => {
  axios.post(`${Constant.API_BASE}/wiki/${name}/update/name/${newName}`, {})
    .then(res => {
      const success = res.data?.success || false;
      const updatedName = res.data?.data || null;
      cb(success, updatedName);
    });
};

const updateTitle = (name: string, title: string, cb: (success: boolean, updatedTitle: string) => void) => {
  axios.post(`${Constant.API_BASE}/wiki/${name}/update/title`, {title})
    .then(res => {
      const success = res.data?.success || false;
      const updatedTitle = res.data?.data || null;
      cb(success, updatedTitle);
    });
};

const updateContent = (name: string, content: string, cb: (success: boolean) => void) => {
  axios.post(`${Constant.API_BASE}/wiki/${name}/update/content`, {content})
    .then(res => {
      const success = res.data?.success || false;
      cb(success);
    });
};

const remove = (name: string, cb: (success: boolean) => void) => {
  axios.post(`${Constant.API_BASE}/wiki/${name}/remove`, {})
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

const detail = (name: string, cb: (wiki: DetailWiki) => void) => {
  axios.get(`${Constant.API_BASE}/wiki/${name}`)
    .then(res => {
      const wiki = res.data?.data as DetailWiki || null;
      console.log('wikiapi: detail, wiki=', wiki);
      cb(wiki);
    });
};

export default {
  create,
  createByCatalogName,
  updateName,
  updateTitle,
  updateContent,
  remove,
  query,
  detail,
};
