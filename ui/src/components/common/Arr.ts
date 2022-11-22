
const Arr = {
  
  includeArr<T>(arr: T[]|null, includeArr: T[]|null) {
    if (!includeArr || !includeArr.length) {
      return true;
    }

    if (!arr || !arr.length) {
      return false;
    }

    for (let i = 0; i < includeArr.length; i++) {
      const ele = includeArr[i];
      if (!arr.includes(ele)) {
        return false;
      }
    }
    
    return true;
  },

};

export default Arr;
