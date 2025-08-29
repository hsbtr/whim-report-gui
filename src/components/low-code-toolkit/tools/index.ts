import { Pkg } from '../common/constant';
import type { PkgModule } from '../types';

/**
 * 将模块配置转化为Schema
 */
export const moduleToArray = <M extends PkgModule, S>(modules: M, processFn: (item: M[keyof M]['default']) => S): S[] => {
  return Object.keys(modules).map((key) => {
    const cfg = modules[key]?.default || {};
    if (typeof processFn === 'function') return processFn(cfg);
    return { ...cfg };
  });
};

/**
 * * JSON序列化，支持函数和 undefined
 * @param data
 */
export const jsonStringify = <T>(data: T): string => {
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
export const pkgsToGroup = <T extends Record<string, any>, U extends Record<string, any>>(array: T[]): U[] => {
  const options = [];
  for (const item of array) {
    const exist = options.findIndex((it) => it.value === item.pkgType);
    const fieldProps = item.fieldProps.map((v) => ({ ...v, type: item.type, }));
    if (exist !== -1) {
      options[exist].opts.push({ ...item, fieldProps, label: item.title, value: item.type });
      continue;
    }
    options.push({
      label: Pkg[item.pkgType].label,
      value: item.pkgType,
      opts: [{ ...item, fieldProps, label: item.title, value: item.type }],
    });
  }
  return options;
};

