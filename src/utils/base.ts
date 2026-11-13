
type TypeofProValue = "array" | "string" | "boolean" | "number" | "function" | "object" | "undefined" | "null";
/**
 * 精准类型识别
 * @param value
 */
export const typeofs = (value: unknown): TypeofProValue => {
  // 直接排除 null 和 undefined，避免不必要的调用
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  // 使用 Object.prototype.toString 判断类型
  const type = Object.prototype.toString.call(value).slice(8, -1).toLowerCase() as TypeofProValue;

  // 特殊处理 array 类型
  if (type === "array") return "array";

  return type;
};

/**
 * 格式化数组对象
 * @param array
 * @param processFn
 * @param conditionKey
 */
export const mapArrayItem = <U extends object, T extends object = U>(
  array: U[],
  processFn: (item: U) => T,
  conditionKey: keyof U | 'children' = 'children'
): Array<T> => {
  if (!Array.isArray(array) || array.length === 0) return [];
  if (typeof processFn !== 'function') return [];
  return array.map((item: U): T => {
    const newItem: T = { ...processFn(item) };
    const children: unknown = Reflect.get(item, conditionKey);
    if (Array.isArray(children)) {
      Object.assign(newItem, { [conditionKey]: mapArrayItem(children, processFn) });
    }
    return newItem;
  });
};

type MinimalImportMetaEnv = Pick<ImportMetaEnv, 'MODE' | 'DEV' | 'PROD' | 'SSR'> & Record<string, unknown>;

function isImportMetaEnv(v: unknown): v is ImportMetaEnv {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.MODE === 'string' &&
    typeof o.DEV === 'boolean' &&
    typeof o.PROD === 'boolean' &&
    typeof o.SSR === 'boolean'
  );
}
function toImportMetaEnvFromProcess(procEnv: unknown): MinimalImportMetaEnv {
  const env = (procEnv && typeof procEnv === 'object' ? procEnv : {}) as Record<string, never>;

  // 只把 VITE_ 前缀映射过去（符合 Vite 的暴露规则），同时补齐必要字段
  const mode = typeof env.NODE_ENV === 'string' ? env.NODE_ENV : 'production';
  const PROD = mode === 'production';
  const DEV = !PROD;

  const viteLike: MinimalImportMetaEnv = {
    MODE: mode,
    DEV,
    PROD,
    SSR: typeof env.SSR === 'boolean' ? env.SSR : false
  };

  for (const k of Object.keys(env)) {
    if (k.startsWith('VITE_')) viteLike[k] = env[k];
  }
  return viteLike;
}
/**
 * 检索特定于运行时环境的环境配置对象。
 * @returns {Object} 包含环境变量的键值对的环境配置对象。
 */
export function getEnvCfg(): ImportMetaEnv {
  // 1) Vite：最可靠
  const viteEnv = import.meta.env;
  if (isImportMetaEnv(viteEnv)) return viteEnv;

  // 2) 兼容：可能在 SSR / 测试 / webpack 场景
  // @ts-expect-error 环境变量是未知的
  const procEnv = (globalThis as unknown)?.process?.env;
  // 这里返回的是“Vite-like + 必要字段齐全”，满足 ImportMetaEnv 结构
  return toImportMetaEnvFromProcess(procEnv) as ImportMetaEnv;
}

/**
 * 获取当前地址栏中的查询参数并解析为对象
 * 一个包含所有查询参数的对象
 * @returns {Object}
 */
export const getQueryParams = (): Record<string, string> => {
  const queryString = window.location.search; // "?a=1&b=2"
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};

  for (const [key, value] of params.entries()) {
    result[key] = value;
  }

  return result;
};

/**
 * 获取指定 key 的 cookie
 * @param name cookie 名称
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie ? document.cookie.split("; ") : [];

  for (const item of cookies) {
    const [key, value] = item.split("=");
    if (key === decodeURIComponent(name) && value) {
      return decodeURIComponent(value);
    }
  }

  return null;
}
