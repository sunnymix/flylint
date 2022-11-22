
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

  concat<T>(arr1: T[]|null, arr2: T[]|null) {
    if (!arr1 || !arr1.length) return arr2;

    if (!arr2 || !arr2.length) return arr1;

    return arr1.concat(arr2);
  },

};

export default Arr;
