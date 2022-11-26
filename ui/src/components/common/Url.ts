import { history } from 'umi';

export const isInternal = (url: string) => {
  if (!url) return true;
  if (url.startsWith('/wiki/')) return true;
  if (url.startsWith('/catalog/')) return true;
  return false;
};

export const gotoInternal = (url: string) => {
  history.push(url);
};

export const gotoOutside = (url: string) => {
  window.open(url, '_blank');
};

export const goto = (url: string) => {
  if (isInternal(url)) return gotoInternal(url);
  return gotoOutside(url);
};

export const Url = {
  isInternal,
  goto,
};

export default Url;
