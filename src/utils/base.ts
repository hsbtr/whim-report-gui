
type RefersToObject = Record<string, any>;
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

