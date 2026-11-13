import { cloneDeep } from 'lodash-es';
import { Pkg } from '../common/constant';
import { commonNodeProps } from '../common/node.props';
import type { PkgType, ComponentAttr, NodeProps, ComponentPropsExtra } from '../types';

type PkgSelectOption = { label: string; value: PkgType };
/**
 * 将一组配置转化为下拉选择框options
 */
export const transformPkgOptions = (): PkgSelectOption[] => {
  return Object.keys(Pkg).map((key) => {
    return {
      label: Pkg[key as PkgType].label,
      value: key as PkgType
    };
  });
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
export const JSONParse = <T>(data: string, opts: { exclude: string[] } = { exclude: [] }): T => {
  const { exclude = [] } = opts;
  return JSON.parse(data, (k, v) => {
    // 过滤函数字符串
    if (exclude.includes(k)) return v;
    // 过滤函数值表达式
    if (typeof v === 'string') {
      const someValue = exclude.some((excludeValue) => v.indexOf(excludeValue) > -1);
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

/**
 * 合并NodeProps
 * 将物料中定义的FieldProps 与 公共的NodeProps 合并
 */
export const mergeNodeProps = (props: ComponentPropsExtra, { uuid }: { uuid: string }): NodeProps => {
  return { ...cloneDeep(commonNodeProps), ...cloneDeep(props), uuid };
};

/**
 * 获取节点定位样式
 * @param attr
 * @param index
 */
export const getPositionStyle = (attr: ComponentAttr, index: number) => {
  if (!attr) return {};
  return {
    zIndex: index + 1,
    left: `${attr.x}px`,
    top: `${attr.y}px`
  };
};
/**
 * 获取节点大小样式
 * @param attr
 */
export const getNodeSizeStyle = (attr: ComponentAttr) => {
  if (!attr) return {};
  return {
    width: `${attr.w}px`,
    height: `${attr.h}px`
  };
};
/**
 * 生成 uuid
 */
export const createUuid = (prefix?: string) => {
  const id =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random() * 1000}`;
  return prefix ? `${prefix}-${id}` : id;
};
