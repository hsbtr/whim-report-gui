import axios from "axios";
import Qs from "qs";
import { errorMessages } from '@/http/tool.constant';
import { download, getCookie, SmartErrorNotifier } from "./tool.method";
import { DataConfig, httpConfig, noAccessRedirectPath } from "@/config";
import { getEnvCfg, getQueryParams } from '@/utils';
import { useAccountStore } from '@/stores';
import router from '@/router';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosRequestConfig } from "axios";
import type { ResponseDataType } from "@/config";

/**
 * 请求 元 ，用于配置全局响应处理
 * 如： http.get('/user/info', { meta: { skipErrorHandler: true } })
 *     http.post('/user/edit', {}, { meta: { skipErrorHandler: true }})
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface CustomAxiosRequestConfigMeta {
  /**
   * 跳过默认错误处理
   */
  skipErrorHandler?: boolean;
  /**
   * 接口错误提示的方式；默认使用notification
   */
  notifyType?: 'message' | 'notification';
  /**
   * 接口行为名称
   */
  apiBehaviorName?: string;
  /**
   * 认证过期后的行为
   *
   * 可选值：
   * - 'redirect'          重定向到登录页
   * - 'notify'            弹出通知提示
   * - 'clearStore'        清空本地 store 中的用户信息
   * - 'redirectAndStore'  重定向并清空 store 的用户信息，登录后返回之前的页面
   * - 'redirectAndFull'   重定向并 弹窗通知 清除store用户信息
   * - 'no'                不做任何处理
   */
  authErrorHandler?: 'redirect' | 'notify' | 'clearStore' | 'redirectAndStore' | 'redirectAndFull' | 'no';
  /**
   * 下载接口使用此属性；
   * 声明文件类型与文件名称; 文件类型为必须
   */
  downFileConfig?: ({ mimeType: string } | { fileType: 'zip' | 'docx' | 'xlsx' | 'pdf' | 'png' | 'jpg' | 'jpeg'; }) & { customFileType?: string };
  [key: string]: any;
}

const { VITE_APP_HTTP_PREFIX } = getEnvCfg();
const errorNotifier = new SmartErrorNotifier();

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
 * 数据适配器
 * 针对一个项目对应多个服务并且接口的响应数据结构不一致，将由这个来抹平差异
 * @param {Object} data
 * @param {import('axios').Axios.AxiosResponse} [response] 响应体
 */
const dataAdapters = (data: Record<string, any>, response?: AxiosResponse): ResponseDataType => {
  const { status } = response || { status: 200 };
  if ([201, 202, 204].includes(status)) return { [DataConfig.CODE]: 200, [DataConfig.DATA]: undefined, [DataConfig.MESSAGE]: errorMessages[status] };
  if (typeof data !== "object") {
    return {
      [DataConfig.CODE]: 203,
      [DataConfig.DATA]: data || undefined,
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
    if (["get"].includes(method)) {
      // 参数统一处理
      if (!config.params && config.data) {
        config.params = config.data;
        delete config.data;
      }
      config.headers!["Accept"] = "application/json";
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
    // 接口 200 进入接口畅通业务（通过/不通过）的处理，
    // 其余接口状态将请求体抛入 rejected 避免其中逻辑失效
    if (![200, 201, 202, 204].includes(response.status)) return response;
    const notifyType = response.config?.meta?.notifyType ?? 'notification';
    if (response && response.data) {
      if (response.data instanceof Blob) {
        const customFileConfig = response.config?.meta?.downFileConfig ?? { fileType: 'xlsx' };
        const downloadResult = await download({ ...customFileConfig, response });
        if (downloadResult.code === 1) {
          return dataAdapters(downloadResult);
        }
        errorNotifier.notify({
          notifyType,
          title: '下载失败',
          description: downloadResult.message,
          source: response.config?.url || ''
        });
        return dataAdapters(downloadResult);
      }
    }
    const { skipErrorHandler, apiBehaviorName } = response.config?.meta || {};
    // 此处 适配器 内部应该对 http status 201 202 204等做特殊处理；
    // 因为他们的返回 data 可能是空或者是字符串，但他们是已经通过业务逻辑的
    const responseData = dataAdapters(response.data, response);
    if (httpConfig.actionSuccessCode !== responseData[DataConfig.CODE] && !skipErrorHandler) {
      errorNotifier.notify({
        title: `${apiBehaviorName || '操作'}失败`,
        description: responseData[DataConfig.MESSAGE],
        notifyType,
        source: response.config?.url || '',
      });
    }
    return responseData;
  },
  (error: any): any => {
    // TODO 取消请求错误通知会出现异常，后续加
    const { status, config } = (error.response as AxiosResponse) ?? {};
    const { skipErrorHandler, authErrorHandler = 'redirectAndStore', notifyType = 'notification' } = config?.meta || {};
    const UNAUTHORIZED = 401;
    // 认证不可跳过，
    if (status === UNAUTHORIZED) {
      const { pathname } = window.location;
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
      if (authErrorHandler === 'redirectAndStore' || authErrorHandler === 'redirectAndFull' || authErrorHandler === 'clearStore') {
        const accountStore = useAccountStore();
        accountStore.clearAccountState();
        if (authErrorHandler === 'clearStore') return Promise.reject(error);
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
      }
      return Promise.reject(error);
    }
    // config.meta.skipErrorHandler 为 true 跳过错误处理 ， 该属性可以单独接口中设置
    if (skipErrorHandler) return Promise.reject(error);
    // http status 非2xx情况下，响应体的错误信息不应该暴露给用户
    const errorDescription = errorMessages[status as number] ?? error.message;
    // 优先使用接口返回的错误报告
    errorNotifier.notify({
      notifyType,
      title: `接口错误代码：${status}`,
      description: errorDescription,
      source: config?.url || ''
    });
    return Promise.reject(error);
  },
);
/**
 * 创建统一封装的 HTTP 请求方法，支持 Axios 全功能，并自动补全自定义 meta 类型提示
 *
 * @template T 返回数据类型（未包装）
 * @template R Axios 返回 Promise 类型（默认 AxiosResponse<T>）
 * @template D 请求体/参数类型
 */
const createRequest = () => {
  return {
    /**
     * 发送 GET 请求（使用 `params` 传参）
     */
    get: <T = any, R = AxiosResponse<T>, D = any>(
      url: string,
      params?: D,
      config?: AxiosRequestConfig<D>
    ): Promise<R> => {
      return http.get(url, { ...config, params });
    },

    /**
     * 发送 DELETE 请求（使用 `params` 传参）
     */
    delete: <T = any, R = AxiosResponse<T>, D = any>(
      url: string,
      params?: D,
      config?: AxiosRequestConfig<D>
    ): Promise<R> => {
      return http.delete(url, { ...config, params });
    },

    /**
     * 发送 HEAD 请求（使用 `params` 传参）
     */
    head: <T = any, R = AxiosResponse<T>, D = any>(
      url: string,
      params?: D,
      config?: AxiosRequestConfig<D>
    ): Promise<R> => {
      return http.head(url, { ...config, params });
    },

    /**
     * 发送 OPTIONS 请求（使用 `params` 传参）
     */
    options: <T = any, R = AxiosResponse<T>, D = any>(
      url: string,
      params?: D,
      config?: AxiosRequestConfig<D>
    ): Promise<R> => {
      return http.options(url, { ...config, params });
    },

    /**
     * 发送 POST 请求（使用 `data` 传参）
     */
    post: <T = any, R = AxiosResponse<T>, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>
    ): Promise<R> => {
      return http.post(url, data, config);
    },

    /**
     * 发送 PUT 请求（使用 `data` 传参）
     */
    put: <T = any, R = AxiosResponse<T>, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>
    ): Promise<R> => {
      return http.put(url, data, config);
    },

    /**
     * 发送 PATCH 请求（使用 `data` 传参）
     */
    patch: <T = any, R = AxiosResponse<T>, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>
    ): Promise<R> => {
      return http.patch(url, data, config);
    },

    /**
     * 发送 `application/x-www-form-urlencoded` POST 请求
     */
    postForm: <T = any, R = AxiosResponse<T>, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>
    ): Promise<R> => {
      return http.postForm(url, data, config);
    },

    /**
     * 发送 `application/x-www-form-urlencoded` PUT 请求
     */
    putForm: <T = any, R = AxiosResponse<T>, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>
    ): Promise<R> => {
      return http.putForm(url, data, config);
    },

    /**
     * 发送 `application/x-www-form-urlencoded` PATCH 请求
     */
    patchForm: <T = any, R = AxiosResponse<T>, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>
    ): Promise<R> => {
      return http.patchForm(url, data, config);
    }
  };
};
export const request = createRequest();

export default http;
