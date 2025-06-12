import axios from "axios";
import Qs from "qs";
import { errorMessages } from '@/http/tool.constant';
import { download, getCookie } from "./tool.method";
import { DataConfig, httpConfig, noAccessRedirectPath } from "@/config";
import { getEnvCfg, getQueryParams } from '@/utils';
import { useAccountStore } from '@/stores';
import router from '@/router';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import type { ResponseDataType } from "@/config";

interface CustomConfigMeta {
  /**
   * 跳过默认错误处理
   */
  skipErrorHandler?: boolean;
  /**
   * 接口行为名称
   */
  actionName?: string;
  /**
   * 认证过期后的行为
   * */
  authErrorHandler?: 'redirect' | 'notify' | 'redirectAndStore' | 'redirectAndFull' | 'no';
  [key: string]: any;
}

const { VITE_APP_HTTP_PREFIX } = getEnvCfg();

const http: AxiosInstance = axios.create({
  baseURL: VITE_APP_HTTP_PREFIX || "/api/",
  timeout: 5000,
  // 对params进行序列化
  paramsSerializer: function (params: any): string {
    // indices: false 传入 ids: [1, 2, 3] 体现形式：ids=1&ids=2
    // arrayFormat: 'brackets' 传入 ids: [1, 2, 3] 体现形式：ids[]=1&ids[]=2&ids[]=3
    // arrayFormat: 'repeat' 传入 ids: [1, 2, 3] 体现形式： ids=1&ids=2&ids=3
    // 此项配置 体现形式 ids[0]=1&ids[1]=2
    return Qs.stringify(params, { arrayFormat: "repeat" });
  },
  withCredentials: true,
});
/**
 * 统一响应结果
 * 针对一个项目对应多个服务并且接口的响应数据结构不一致，将由这个来抹平差异
 * @param {Object} data
 */
const dataAdapters = (data: Record<string, any>): ResponseDataType => {
  if (typeof data !== "object") {
    return {
      [DataConfig.CODE]: 209,
      [DataConfig.DATA]: undefined,
      [DataConfig.MESSAGE]: '响应结构与约定不符'
    };
  }
  return {
    [DataConfig.CODE]: data.resultCode ?? data.code,
    // 给予一个undefined默认值，用来抹平null带来的一些问题
    [DataConfig.DATA]: data.resultData ?? data.result ?? data.data ?? undefined,
    [DataConfig.MESSAGE]: data.resultMessage ?? data.msg ?? data.message,
  };
};

// 请求拦截器
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    const authorization: string | null = getCookie(httpConfig.authKey) || sessionStorage.getItem(httpConfig.authKey);
    const method = config.method!.toLocaleLowerCase();
    if (authorization) {
      config.headers[httpConfig.authKey] = authorization;
    }
    if (["post", "put"].includes(method)) {
      // 参数统一处理，请求都使用data传参
      config.data = config.data?.data;
    } else if (["get"].includes(method)) {
      // 参数统一处理
      config.params = config.data;
      config.headers!["Accept"] = "application/json";
      delete config.data;
    }
    if (!config.headers["Content-Type"] && ["post", "put", "patch"].includes(method)) {
      const isUpload = config.data instanceof FormData;
      if (!isUpload) {
        config.headers["Content-Type"] = "application/json; charset=UTF-8";
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截
http.interceptors.response.use(
  async (response: AxiosResponse): Promise<any> => {
    if (response && response.data) {
      if (response.data instanceof Blob) {
        const downloadResult = await download({ response, fileType: 'xlsx' });
        if (downloadResult.code === 1) {
          return dataAdapters(downloadResult);
        }
        window.$notification.error({
          title: "下载失败",
          description: downloadResult.code + "：" + downloadResult.message,
        });
        return dataAdapters(downloadResult);
      }
    }
    const { skipErrorHandler = false, actionName } = response.config?.meta || {};
    const responseData = dataAdapters(response.data);
    if (httpConfig.actionSuccessCode !== responseData[DataConfig.CODE] && !skipErrorHandler) {
      window.$notification.error({
        title: `${actionName || '操作'}失败`,
        description: responseData[DataConfig.MESSAGE],
      });
    }
    return responseData;
  },
  (error: any): any => {
    const { status, data, config } = error.response || {};
    const { skipErrorHandler, authErrorHandler = 'redirectAndStore' } = config?.meta || {};
    const UNAUTHORIZED = 401;
    if (skipErrorHandler) return Promise.reject(error);
    if (status === UNAUTHORIZED) {
      const { pathname } = window.location;
      // 当前页面在登录页的时候不再通知
      if (pathname === noAccessRedirectPath) return Promise.reject();
      // 只有符合其中一个才会通知
      if (authErrorHandler === 'notify' || authErrorHandler === 'redirectAndFull') {
        window.$notification.error({
          title: "授权过期",
          description: "2秒后跳转登录页面",
        });
      }
      // 只有符合其中一个才会清除全局store
      if (authErrorHandler === 'redirectAndStore' || authErrorHandler === 'redirectAndFull') {
        const accountStore = useAccountStore();
        accountStore.clearAccountState();
      }
      if (authErrorHandler === 'redirect' || authErrorHandler === 'redirectAndStore' || authErrorHandler === 'redirectAndFull') {
        const query = getQueryParams();
        router.replace({
          path: noAccessRedirectPath,
          query: {
            ...query,
            redirect: pathname,
          }
        });
        // `${noAccessRedirectPath}?redirect=${pathname}${search.replace("?", "&")}`
      }
      return Promise.reject();
    }
    const errorDescription = data[DataConfig.MESSAGE] ?? error.message ?? errorMessages[status];
    // 优先使用接口返回的错误报告
    window.$notification.error({
      title: `接口错误代码：${status}`,
      description: errorDescription,
    });
    return Promise.reject(error);
  },
);

export const request = axios;

export default http;
