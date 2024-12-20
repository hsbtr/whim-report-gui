
type TypeofProValue = "array" | "string" | "boolean" | "number" | "function" | "object" | "undefined" | "null";
/**
 * 精准类型识别
 * @param value
 */
export const typeofs = (value: any): TypeofProValue => {
  // 直接排除 null 和 undefined，避免不必要的调用
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  // 使用 Object.prototype.toString 判断类型
  const type = Object.prototype.toString.call(value).slice(8, -1).toLowerCase() as TypeofProValue;

  // 特殊处理 array 类型
  if (type === "array") return "array";

  return type;
};

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

