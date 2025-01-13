
type ItemType = Record<string, any>;

/**
 * 将模块配置转化为Schema
 */
export const generatedSchemas = <U extends ItemType, T extends ItemType, K extends ItemType>(modules: U, processFn: (item: K, path?: string) => T): T[] => {
  const schemas: T[] = [];
  Object.keys(modules).forEach((key) => {
    const [_placeholder, partialPath] = key.split('/');
    const cfg = modules[key].default;
    if (typeof processFn === 'function') {
      const schema = processFn(cfg, partialPath);
      schemas.push(schema);
    } else {
      schemas.push({ ...cfg });
    }
  });
  return schemas;
};

/**
 * * JSON序列化，支持函数和 undefined
 * @param data
 */
export const jsonStringify = <T>(data: T) => {
  return JSON.stringify(
    data,
    (_key, val) => {
      // 处理函数丢失问题
      if (typeof val === 'function') {
        return `${val}`;
      }
      // 处理 undefined 丢失问题
      if (typeof val === 'undefined') {
        return null;
      }
      return val;
    },
    2
  );
};


