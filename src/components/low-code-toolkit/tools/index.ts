import { Pkg } from '../common/constant';
import type { PkgModule, PkgComponentMeta } from '../types';
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface';

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
 * 将一组配置转化为下拉选择框options
 * @param array
 * @param propsHandle
 */
export const formatPkgOptions = <P>(array: PkgComponentMeta, propsHandle?: (item: PkgComponentMeta) => P): SelectMixedOption[] => {
  const options = [];
  for (const item of array) {
    const exist = options.findIndex((it) => it.value === item.pkgType);
    const fieldProps = propsHandle ? propsHandle(item) : item.fieldProps;
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

/**
 * 执行一个字符串函数
 * @param fn
 */
export const evalFn = (fn: string) => {
  return new Function(`return ${fn}`)();
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

/**
 * * JSON反序列化，支持函数和 undefined
 * @param data
 * @param opts
 */
export const JSONParse = <T>(data: string, opts: { exclude: Array } = []): T => {
  const { exclude = [] } = opts;
  return JSON.parse(data, (k, v) => {
    // 过滤函数字符串
    if (exclude.includes(k)) return v;
    // 过滤函数值表达式
    if (typeof v === 'string') {
      const someValue = exclude.some(excludeValue => v.indexOf(excludeValue) > -1);
      if (someValue) return v;
    }
    // 还原函数值
    if (typeof v === 'string' && v.indexOf && (v.indexOf('function') > -1 || v.indexOf('=>') > -1)) {
      return evalFn(`(function(){return ${v}})()`);
    } else if (typeof v === 'string' && v.indexOf && v.indexOf('return ') > -1) {
      const baseLeftIndex = v.indexOf('(');
      if (baseLeftIndex > -1) {
        const newFn = `function ${v.substring(baseLeftIndex)}`;
        return evalFn(`(function(){return ${newFn}})()`);
      }
    }
    return v;
  });
};
