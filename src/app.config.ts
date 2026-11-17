import type { AxiosResponse } from 'axios';

// API 请求与响应协议类型
/** 通用分页请求参数，分页接口会将其与业务参数合并。 */
type ApiPagingParams = {
  pageSize: number;
  current: number;
  keyword?: string;
};
/** 分页接口返回的数据结构。 */
export type PagingDataType<T = unknown> = {
  total: number;
  current: number;
  pageSize: number;
  data: T[];
};
/** API 请求类型：`'common'` 普通请求，`'paging'` 分页请求。 */
type DataType = 'paging' | 'common';
/**
 * API 请求参数工具类型。
 *
 * 根据请求类型，自动组合业务参数与通用分页参数。
 *
 * @template P - 接口业务参数类型，默认为 `unknown`。
 * @template T - 请求类型，默认为 `'common'`。
 *   - `'common'`：普通请求，直接返回业务参数类型 `P`。
 *   - `'paging'`：分页请求，将业务参数 `P` 与 `ApiPagingParams` 合并。
 *
 * @example
 * // 普通请求
 * type DetailParams = ApiParams<{ id: number }>;
 *
 * @example
 * // 分页请求
 * type ListParams = ApiParams<{ status?: number }, 'paging'>;
 * // 结果：{ status?: number; current: number; pageSize: number; keyword?: string }
 *
 * @example
 * // 仅使用分页参数
 * type ListParams = ApiParams<unknown, 'paging'>;
 */
export type ApiParams<P = unknown, T extends DataType = 'common'> = T extends 'paging' ? P & ApiPagingParams : P;
/**
 * API 分页请求参数工具类型。
 *
 * `ApiParams` 的分页快捷类型，自动合并通用分页参数，
 * 无需显式指定请求类型为 `'paging'`。
 *
 * @template P - 分页接口的额外业务参数类型，默认为 `unknown`。
 *
 * @example
 * // 仅使用通用分页参数
 * type ListParams = ApiPagingQuery;
 * // 结果：{ current: number; pageSize: number; keyword?: string }
 *
 * @example
 * // 分页参数与业务参数合并
 * type ListParams = ApiPagingQuery<{
 *   status?: number;
 *   categoryId?: string;
 * }>;
 * // 结果：{
 * //   current: number;
 * //   pageSize: number;
 * //   keyword?: string;
 * //   status?: number;
 * //   categoryId?: string;
 * // }
 */
export type ApiPagingQuery<P = unknown> = ApiParams<P, 'paging'>;
/** API 统一响应结构，`data` 用 `undefined` 抹平后端返回 `null` 的情况。 */
export type ApiResponse<T = unknown> = {
  success: boolean;
  data: T | undefined;
  message: string;
};
/** 接口方法的返回值类型：解析为 `ApiResponse` 的 Promise。 */
export type ApiReturn<T = unknown> = Promise<ApiResponse<T>>;
/** 分页接口方法的返回值类型。 */
export type ApiPagingReturn<T = unknown> = ApiReturn<PagingDataType<T>>;

// HTTP 层业务协议与全局处理策略配置
export const httpConfig = {
  /** 供 HTTP 层读取适配结果，用于业务失败提示和下载校验。 */
  fieldNames: { success: 'success', message: 'message' } as const,
  auth: {
    token: 'Token',
    key: 'Token'
  },
  noAccessRedirectPath: '/login',
  statusEnum: {
    // 2xx 成功
    200: '操作成功',
    201: '数据创建成功',
    202: '请求已接受，正在处理中',
    204: '操作成功，但没有返回数据',

    // 3xx 重定向
    301: '资源已永久移动，请刷新后重试',
    302: '资源已临时移动，请刷新后重试',
    304: '数据未修改，使用缓存加载',

    // 4xx 客户端错误
    400: '请求无效，请检查输入',
    401: '请先登录后再操作',
    403: '您没有权限执行此操作',
    404: '未找到相关资源',
    405: '请求方式不被允许',
    408: '请求超时，请稍后重试',
    409: '数据冲突，请刷新后再试',
    422: '请求数据格式有误，请检查输入',

    // 5xx 服务端错误
    500: '服务器开小差了，请稍后再试',
    501: '服务器未实现该功能',
    502: '网关错误，请稍后再试',
    503: '服务器暂时不可用，请稍后再试',
    504: '服务器响应超时，请检查网络或稍后再试',
    505: 'HTTP版本不支持，请升级浏览器'
  },
  dataAdapter: <T = unknown>(res: unknown, response?: AxiosResponse): ApiResponse<T> => {
    const { status } = response || { status: 200 };
    if (status === 201 || status === 202 || status === 204)
      return {
        success: true,
        data: undefined,
        message: httpConfig.statusEnum[status] || ''
      };
    if (res === null || typeof res !== 'object' || Array.isArray(res)) {
      return {
        success: false,
        data: (res ?? undefined) as T | undefined,
        message: '响应结构与约定不符'
      };
    }
    const data = res as Record<string, unknown>;
    const code = data.resultCode ?? data.code;
    // 兼容 dev 接口的业务码 200 和通用接口的业务码 0。
    const businessCode = typeof code === 'string' && code.trim() ? Number(code) : code;
    const success = typeof data.success === 'boolean' ? data.success : businessCode === 0 || businessCode === 200;
    return {
      success,
      // 给予一个undefined默认值，用来抹平null带来的一些问题
      data: (data.resultData ?? data.result ?? data.data ?? undefined) as T | undefined,
      message: String(data.resultMessage ?? data.resultMsg ?? data.msg ?? data.message ?? '')
    };
  }
};

// UI 外观与品牌配置
/** 应用主题模式。 */
export enum ThemeEnum {
  DARK = 'dark',
  LIGHT = 'light'
}
/** 界面语言。 */
export enum LanguageEnum {
  ZH = 'zh',
  EN = 'en'
}
/** 主题色信息，包含多格式的颜色值与名称。 */
export type ThemeColorInfo = {
  CMYK: number[];
  RGB: number[];
  hex: string;
  name: string;
  pinyin: string;
};
/** UI 配置结构，作为 `uiConfig` 的类型并供运行时设置状态复用。 */
export type UiConfig = {
  title?: string;
  logo?: string;
  lang: LanguageEnum.EN | LanguageEnum.ZH;
  theme: ThemeEnum.LIGHT | ThemeEnum.DARK;
  primaryColor: string;
  themeInfo?: ThemeColorInfo;
};

export const uiConfig: UiConfig = {
  logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  lang: LanguageEnum.ZH,
  theme: ThemeEnum.DARK,
  primaryColor: '#51d6a9'
};

// 低代码与预览共用的公共枚举
/** 物料数据来源：静态数据、HTTP 接口或数据池。 */
export enum DataTypeEnum {
  STATIC = 0,
  HTTP = 1,
  POND
}
/** 预览页画布的缩放模式。 */
export enum PreviewEnum {
  FIT = '',
  SCROLL_Y = 'scrollY',
  SCROLL_X = 'scrollX',
  FULL = 'full'
}
