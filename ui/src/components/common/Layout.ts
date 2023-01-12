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
