/* eslint-disable @typescript-eslint/no-explicit-any -- Axios 的动态响应和请求泛型需要保留兼容性 */

import axios from 'axios';
import Qs from 'qs';
import { download } from './method/download';
import { SmartErrorNotifier } from './method/error-notifier';
import { createCoreCfg } from './method/default.config';
import { HTTP_RUNTIME_CONFIG } from '@/app.config';
import { getEnvCfg, getQueryParams } from '@/utils';
import { useAccountStore } from '@/stores';
import router from '@/router';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosRequestConfig } from 'axios';
import type { ApiResponse, ApiReturn } from '@/app.config';

export interface RequestMethods {
  get: <T = unknown, P = any>(url: string, params?: P, config?: AxiosRequestConfig<any, P>) => ApiReturn<T>;

  delete: <T = unknown, P = any>(url: string, params?: P, config?: AxiosRequestConfig<any, P>) => ApiReturn<T>;

  head: <T = unknown, P = any>(url: string, params?: P, config?: AxiosRequestConfig<any, P>) => ApiReturn<T>;

  options: <T = unknown, P = any>(url: string, params?: P, config?: AxiosRequestConfig<any, P>) => ApiReturn<T>;

  post: <T = unknown, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) => ApiReturn<T>;

  put: <T = unknown, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) => ApiReturn<T>;

  patch: <T = unknown, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) => ApiReturn<T>;

  postForm: <T = unknown, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) => ApiReturn<T>;

  putForm: <T = unknown, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) => ApiReturn<T>;
}

const { VITE_APP_HTTP_PREFIX } = getEnvCfg();
const errorNotifier = new SmartErrorNotifier();
const { fieldNames, dataAdapter, getAuth, getMessage, noAccessRedirectPath } = createCoreCfg(HTTP_RUNTIME_CONFIG);

const http: AxiosInstance = axios.create({
  baseURL: VITE_APP_HTTP_PREFIX || '/api/',
  timeout: 5000,
  // 对params进行序列化
  paramsSerializer: function (params: any): string {
    // indices: false 传入 ids: [1, 2, 3] 体现形式：ids=1&ids=2
    // arrayFormat: 'brackets' 传入 ids: [1, 2, 3] 体现形式：ids[]=1&ids[]=2&ids[]=3
    // arrayFormat: 'repeat' 传入 ids: [1, 2, 3] 体现形式： ids=1&ids=2&ids=3
    // 此项配置 体现形式 ids[0]=1&ids[1]=2
    return Qs.stringify(params, { arrayFormat: 'repeat' });
  },
  withCredentials: true
});
// 请求拦截器
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { token, key } = getAuth();
    const method = config.method!.toLocaleLowerCase();
    if (token) {
      config.headers[key] = token;
    }
    if (['get'].includes(method)) {
      // 参数统一处理
      if (!config.params && config.data) {
        config.params = config.data;
        delete config.data;
      }
      config.headers!['Accept'] = 'application/json';
    }
    if (!config.headers['Content-Type'] && ['post', 'put', 'patch'].includes(method)) {
      const isUpload = config.data instanceof FormData;
      if (!isUpload) {
        config.headers['Content-Type'] = 'application/json; charset=UTF-8';
      }
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// 响应拦截
http.interceptors.response.use(
  async (response: AxiosResponse): Promise<any> => {
    const {
      skipErrorHandler,
      apiBehaviorName,
      notifyType = 'notification',
      downFileConfig
    } = response.config.meta || {};
    const isDownload = response.data instanceof Blob;
    let responseData: ReturnType<typeof dataAdapter>;
    if (isDownload) {
      const result = await download(response, {
        ...(downFileConfig || {}),
        fileType: downFileConfig?.fileType || 'xlsx',
        validate: async (source) => {
          const text = await source.text();
          let res: unknown;
          try {
            res = JSON.parse(text);
          } catch {
            // 非 JSON 内容按文件处理；适配器异常不在这里吞掉。
            return { allow: true, message: '' };
          }
          const adapted = dataAdapter(res);
          return {
            allow: adapted[fieldNames.success],
            message: adapted[fieldNames.message]
          };
        }
      });
      responseData = dataAdapter(result);
    } else {
      responseData = dataAdapter(response.data, response);
    }
    if (!responseData[fieldNames.success] && !skipErrorHandler) {
      errorNotifier.notify({
        title: `${apiBehaviorName || (isDownload ? '下载' : '操作')}失败`,
        description: responseData[fieldNames.message],
        notifyType,
        source: response.config?.url || ''
      });
    }
    return responseData;
  },
  (error: any) => {
    // TODO 取消请求错误通知会出现异常，后续加
    const { status, config } = (error.response as AxiosResponse) ?? {};
    const { skipErrorHandler, authErrorHandler = 'redirectAndStore', notifyType = 'notification' } = config?.meta || {};
    const UNAUTHORIZED = 401;
    // 认证不可跳过，
    if (status === UNAUTHORIZED) {
      const { pathname } = window.location;
      console.log(router.currentRoute.value);
      // 当前页面在登录页的时候不再通知
      if (pathname === noAccessRedirectPath) return Promise.reject(error);
      // 只有符合其中一个才会通知
      if (authErrorHandler === 'notify' || authErrorHandler === 'redirectAndFull') {
        errorNotifier.notify({
          notifyType,
          title: '认证过期',
          description: '即将跳转登录页',
          source: config?.url || ''
        });
      }
      // 只有符合其中一个才会清除全局store
      if (
        authErrorHandler === 'redirectAndStore' ||
        authErrorHandler === 'redirectAndFull' ||
        authErrorHandler === 'clearStore'
      ) {
        const accountStore = useAccountStore();
        accountStore.clearAccountState();
        if (authErrorHandler === 'clearStore') return Promise.reject(error);
      }
      if (
        authErrorHandler === 'redirect' ||
        authErrorHandler === 'redirectAndStore' ||
        authErrorHandler === 'redirectAndFull'
      ) {
        const query = getQueryParams();
        router.replace({
          path: noAccessRedirectPath,
          query: {
            ...query,
            redirect: pathname
          }
        });
      }
      return Promise.reject(error);
    }
    // config.meta.skipErrorHandler 为 true 跳过错误处理 ， 该属性可以单独接口中设置
    if (skipErrorHandler) return Promise.reject(error);
    // http status 非2xx情况下，响应体的错误信息不应该暴露给用户
    const errorDescription = getMessage(status) ?? error.message;
    // 优先使用接口返回的错误报告
    errorNotifier.notify({
      notifyType,
      title: `接口错误代码：${status}`,
      description: errorDescription,
      source: config?.url || ''
    });
    return Promise.reject(error);
  }
);

export const request: RequestMethods = {
  get: <T, P>(url: string, params?: P, config: AxiosRequestConfig<any, P> = {}) => {
    return http.get<T, ApiResponse<T>, any, P>(url, {
      ...config,
      params
    });
  },
  delete: <T, P>(url: string, params?: P, config: AxiosRequestConfig<any, P> = {}) => {
    return http.delete<T, ApiResponse<T>, any, P>(url, {
      ...config,
      params
    });
  },
  head: <T, P>(url: string, params?: P, config: AxiosRequestConfig<any, P> = {}) => {
    return http.head<T, ApiResponse<T>, any, P>(url, {
      ...config,
      params
    });
  },
  options: <T, P>(url: string, params?: P, config: AxiosRequestConfig<any, P> = {}) => {
    return http.options<T, ApiResponse<T>, any, P>(url, {
      ...config,
      params
    });
  },
  post: <T, D>(url: string, data?: D, config: AxiosRequestConfig<D> = {}) => {
    return http.post<T, ApiResponse<T>, D>(url, data, config);
  },
  put: <T, D>(url: string, data?: D, config: AxiosRequestConfig<D> = {}) => {
    return http.put<T, ApiResponse<T>, D>(url, data, config);
  },
  patch: <T, D>(url: string, data?: D, config: AxiosRequestConfig<D> = {}) => {
    return http.patch<T, ApiResponse<T>, D>(url, data, config);
  },
  postForm: <T, D>(url: string, data?: D, config: AxiosRequestConfig<D> = {}) => {
    return http.postForm<T, ApiResponse<T>, D>(url, data, config);
  },
  putForm: <T, D>(url: string, data?: D, config: AxiosRequestConfig<D> = {}) => {
    return http.putForm<T, ApiResponse<T>, D>(url, data, config);
  }
};

export default http;
