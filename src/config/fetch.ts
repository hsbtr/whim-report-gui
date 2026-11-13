import type { ApiPagingReturn, ApiResponse } from '@/app.config';
// 该属性直接确定从 本地缓存中以什么key娶token
// export const cookieKey = "Authorization";
export const cookieKey = 'Token';

export enum DataTypeEnum {
  STATIC = 0,
  HTTP = 1,
  POND
}

/**
 * 请求的响应的 data 类型
 */
export type ResponseDataType<T = unknown> = ApiResponse<T>;

/**
 * 所有接口返回类型
 */
export type { ApiReturn as ApiDataType } from '@/app.config';

/**
 * 分页参数类型
 */
export interface PagingQuery {
  pageSize?: number;
  current?: number;
  keyword?: string;
}

/**
 * 分页返回类型
 */
export type PagingType<T> = ApiPagingReturn<T>;

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
