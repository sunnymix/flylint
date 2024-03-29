export const isArr = (o: any) => Array.isArray(o);

export const isArrEmpty = (o: any) => isArr(o) && o.length === 0;

export const isArrNotEmpty = (o: any) => isArr(o) && o.length > 0;

export const isStr = (o: any) => typeof o === 'string';

export const isUndef = (o: any) => typeof o === 'undefined';

export const isDef = (o: any) => !isUndef(o);

export const isNull = (o: any) => isDef(o) && o === null;

export const isNotNull = (o: any) => isDef(o) && o !== null;

export const isEmpty = (o: any) => isUndef(o) || isNull(o);

export const isNotEmpty = (o: any) => !isEmpty(o);

export const randomKey = () => `${Math.floor(Math.random()*100000000)}`;

export const isNum = (o: any) => typeof o === 'number';

export const isNotNum = (o: any) => !isNum(o);

export const parseNum = (o: any, defaultValue: number): number => {
  if (!isNotNum(o)) return defaultValue;
  return +o;
};

export const Ts = {
  isArr, isArrEmpty, isArrNotEmpty,
  isStr,
  isUndef,
  isDef,
  isNull,
  isNotNull,
  isEmpty, isNotEmpty,
  randomKey,
  isNum, isNotNum,
};
export default Ts;
