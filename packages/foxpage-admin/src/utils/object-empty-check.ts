export const objectEmptyCheck = (
  ele: null | undefined | Array<unknown> | Record<string | number | symbol, unknown>,
) => {
  if (!ele) return true;
  const type = Array.isArray(ele) ? 'arr' : typeof ele;
  return type === 'arr' ? ele.length === 0 : Object.keys(ele).length === 0;
};
