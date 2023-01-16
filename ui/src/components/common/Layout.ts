export interface Size {
  height: number,
  width: number,
};

const Layout = {
  
  winSize() {
    return {
      height: window.innerHeight,
      width: window.innerWidth,
    };
  },

  winWidth() {
    return window.innerWidth;
  },

  winHeight() {
    return window.innerHeight;
  },

  zeroSize() {
    return {
      height: 0,
      width: 0,
    };
  },

  refSize(ref: any) {
    if (!ref || !ref.current) return Layout.zeroSize();
    return {
      height: ref.current.offsetHeight || 0,
      width: ref.current.offsetWidth || 0,
    };
  },

  refWidth(ref: any) {
    if (!ref || !ref.current) return 0;
    return ref.current.offsetWidth || 0;
  },

  refHeight(ref: any) {
    if (!ref || !ref.current) return 0;
    return ref.current.offsetHeight || 0;
  },

  // __________ set ref style __________

  setRefBackgroundColor(ref: any, color: string) {
    if (!ref || !ref.current) return;
    ref.current.style.backgroundColor = color;
  },

  setRefHeight(ref: any, height: number) {
    if (!ref || !ref.current) return;
    ref.current.style.height = height + 'px';
  },

  setRefTop(ref: any, top: number) {
    if (!ref || !ref.current) return;
    ref.current.style.top = top + 'px';
  },

  setRefMarginLeft(ref: any, marginLeft: number) {
    if (!ref || !ref.current) return;
    ref.current.style.marginLeft = marginLeft + 'px';
  },

  classHeight(className: string) {
    const headerEle = document.getElementsByClassName(className);
    if (!headerEle || !headerEle.length) return 0;
    const header: any = headerEle[0];
    return header.offsetHeight;
  },

  headerHeight() {
    return Layout.classHeight('header');
  },

};

export default Layout;
