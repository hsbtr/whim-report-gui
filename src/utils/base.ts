
type RefersToObject = Record<string, any>;
/**
 * 格式化数组对象
 * @param array
 * @param processFn
 * @param conditionKey
 */
export const mapArrayItem = <U extends RefersToObject, T extends RefersToObject = U>(array: U[], processFn: (item: U) => T, conditionKey: keyof U = 'children'): Array<T> => {
  if (!Array.isArray(array) || array.length === 0) return [];
  if (typeof processFn !== "function") return [];
  return array.map((item: U): T => {
    const newItem: T = { ...processFn(item) };
    if (Array.isArray(item[conditionKey])) {
      // @ts-ignore
      newItem[conditionKey] = mapArrayItem(item[conditionKey], processFn);
    }
    return newItem;
  });
};
/**
 * 自动将模块转化为Schema表
 */
export const autoModuleConversionSchema = <U extends RefersToObject, T extends RefersToObject, K extends RefersToObject>(modules: U, processFn: (item: K) => T): T[] => {
  const schemas: T[] = [];
  Object.keys(modules).forEach((key) => {
    const cfg = modules[key].default;
    if (typeof processFn === 'function') {
      const schema = processFn(cfg);
      schemas.push(schema);
    } else {
      schemas.push({ ...cfg });
    }
  });
  return schemas;
};
