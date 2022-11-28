
export interface Size {
  height: number,
  width: number,
};

const Layout = {
  
  winSize () {
    return {
      height: window.innerHeight,
      width: window.innerWidth,
    };
  },

  zeroSize () {
    return {
      height: 0,
      width: 0,
    };
  },

  refSize (ref: any) {
    if (!ref || !ref.current) return Layout.zeroSize();
    return {
      height: ref.current.offsetHeight || 0,
      width: ref.current.offsetWidth || 0,
    };
  },

};

export default Layout;
