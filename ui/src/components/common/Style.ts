export const className = (className: string, ...args: boolean[]) => {
  if (!args || !args.length || !args.every) return '';
  const allTrue = args.every(a => a === true);
  if (!allTrue) return '';
  return className;
};

export const active = (...args: boolean[]) => {
  return className('active', ...args);
};

export const last = (...args: boolean[]) => {
  return className('last', ...args);
};

export const Style = {
  className,
  active,
  last,
};

export default Style;
