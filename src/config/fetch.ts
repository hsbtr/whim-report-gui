import type { AxiosError } from "axios";
// 该属性直接确定从 本地缓存中以什么key娶token
// export const cookieKey = "Authorization";
export const cookieKey = "Token";

// 改变 此三个常量值及直接操作请求响应返回值
export enum DataConfig {
  CODE = "code",
  MESSAGE = "msg",
  DATA = "data",
}
export enum CodeStatus {
  SUCCESS = 200,
  SERVER_ERROR = 500,
}

export enum DataTypeEnum {
  STATIC = 0,
  HTTP = 1,
  POND
}

type FailureCodeGroupType = string | number;
/**
 * 在请求代码成功时  该参数拦截response.data[CODE] 指定代号
 * 为空拦截即是不生效
 */
export const failureCodeGroup: FailureCodeGroupType[] = [500, 400];

type BasePrivateDomain = string | number;

/**
 * 请求的响应的 data 类型
 */
export interface ResponseDataType<T = any> {
  [DataConfig.CODE]: BasePrivateDomain;
  [DataConfig.MESSAGE]: string;
  [DataConfig.DATA]: T;
}

/**
 * 所有接口返回类型
 */
export type ApiDataType<T = any> = Promise<ResponseDataType<T>>;

/**
 * 分页参数类型
 */
export interface PagingQuery {
  pageSize?: number;
  current?: number;
  keyword?: string;
}
interface PagingData<T> {
  total: number;
  current: number;
  pageSize: number;
  data: T[];
}

/**
 * 分页返回类型
 */
export type PagingType<T> = ApiDataType<PagingData<T>>;

/**
 * 响应错误功能处理的额外参数项目
 */
export type BaseFunctionQuery = {
  /**
   * 没有值就是默认动作
   * 1 代表重定向
   * 2 代表 重定向 重置store
   * 3 代表 重定向 重置store 通知
   * 4 无任何动作
   */
  responseAction: 1 | 2 | 3 | 4;
};
