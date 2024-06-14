import axios from "axios";
import Qs from "qs";
import { Download, getCookie } from "./tool.method";
import { codeMessage } from "./tool.constant";
import { DataConfig, failureCodeGroup, cookieKey, noAccessRedirectPath } from "@/config";
import type { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import type { ResponseDataType } from "@/config";

let env;
try {
  // @ts-ignore
  env = process.env;
} catch (e) {
  env = import.meta.env;
}
// const mode = env.NODE_ENV || env.MODE;
const APP_BASE_URL = env.VITE_APP_HTTP_PREFIX;

const http = axios.create({
  baseURL: APP_BASE_URL || "/api/",
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

// 此处判断用来更改基础 url前缀
// if (mode === "production") {
//   // 生产环境 production
//   http.defaults.baseURL = APP_BASE_URL || "/api/";
// } else if (mode === "test") {
//   // 测试环境 test
//   http.defaults.baseURL = APP_BASE_URL || "/api/";
// } else {
//   // 开发环境 development
//   http.defaults.baseURL = APP_BASE_URL || "/api/";
// }

// 请求拦截器
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    // const token = store.state.token;
    // token && (config.headers.Authorization = token);
    const authorization: string | null = getCookie(cookieKey) || sessionStorage.getItem(cookieKey);
    if (authorization) {
      config.headers[cookieKey] = authorization;
    }
    if (["post", "put"].includes(config.method!.toLocaleLowerCase())) {
      // 参数统一处理，请求都使用data传参
      config.data = config.data?.data;
    } else if (["get"].includes(config.method!.toLocaleLowerCase())) {
      // 参数统一处理
      config.params = config.data;
      config.headers!["Accept"] = "application/json";
      delete config.data;
    } else if (["delete"].includes(config.method!.toLocaleLowerCase())) {
      // 此项判断为兼容后端使用body接收参数
      if (config.data) {
        config.params = config.data;
      }
    } else {
      alert("不允许的请求方法：" + config.method);
    }
    const headersExtra = { "Content-Type": "application/json; charset=UTF-8" };
    // 根据请求方式更改请求头
    config.headers = Object.assign(headersExtra, config.headers);
    // removePendingRequest(config);
    // addPendingRequest(config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截
http.interceptors.response.use(
  async (response: AxiosResponse<ResponseDataType>): Promise<any> => {
    // removePendingRequest(response.config);
    if (response && response.data) {
      if (response.data instanceof Blob) {
        const down = new Download(response);
        const { resultCode: code, resultMsg: msg } = await down.inspect();
        if (code === 200) {
          down.xlsx();
          return { [DataConfig.CODE]: code, [DataConfig.MESSAGE]: msg };
        }
        window.$notification.error({
          title: "下载失败",
          description: code + "：" + msg,
        });
        return { [DataConfig.CODE]: code, [DataConfig.MESSAGE]: msg };
      } else {
        if (typeof response.data === "string") {
          return {
            [DataConfig.DATA]: response.data,
            [DataConfig.CODE]: 200,
            [DataConfig.MESSAGE]: "",
          };
        }
        const responseData = response.data || {};
        // 此处做一个接口成功响应 但操作失败全局提示
        if (failureCodeGroup.length > 0 && failureCodeGroup.includes(responseData[DataConfig.CODE])) {
          window.$notification.error({
            title: "操作失败",
            description: responseData[DataConfig.MESSAGE],
          });
        }
      }
    }
    // 此行为避免响应为null
    const responseData = response.data || {};
    return {
      // 避免返回值为null 解构 赋默认值失效问题
      [DataConfig.DATA]: responseData[DataConfig.DATA] || undefined,
      [DataConfig.CODE]: responseData[DataConfig.CODE],
      [DataConfig.MESSAGE]: responseData[DataConfig.MESSAGE],
    };
  },
  (error: any): any => {
    const { status, data } = error.response || {};
    const { responseAction } = error.config.params || error.config.data || {};
    if (responseAction === 4) return Promise.reject(error);
    // removePendingRequest(error.config || {});
    if (axios.isCancel(error)) {
      console.log("已取消的重复请求： " + error.message);
    } else {
      if (status === 401) {
        const { pathname } = window.location;
        if (typeof responseAction !== "number" || responseAction === 1 || responseAction === 2) {
          window.$notification.error({
            title: "授权过期",
            description: "请重新登录！",
          });
        }
        if (pathname === noAccessRedirectPath) return Promise.reject();
        // sessionStorage.removeItem("Authorization");
        // sessionStorage.removeItem("userId");
        if (typeof responseAction !== "number" || responseAction === 2 || responseAction === 3) {
          // store.dispatch(upUserInfo(undefined)); // 没有使用 redux-toolkit 就不存在此句
        }
        if (
          typeof responseAction !== "number" ||
          responseAction === 1 ||
          responseAction === 2 ||
          responseAction === 3
        ) {
          // router.navigate(`${noAccessRedirectPath}?redirect=${pathname}${search.replace("?", "&")}`, { replace: true });
        }
        return Promise.reject();
      } else {
        if (!data || typeof data === "string") {
          const mess = codeMessage[status];
          window.$notification.error({
            title: `请求状态：${status}`,
            description: mess,
          });
        } else {
          // 优先使用接口返回的错误报告
          window.$notification.error({
            title: `${data[DataConfig.CODE]} ${data[DataConfig.MESSAGE]}`,
            description: typeof data[DataConfig.DATA] !== "string" ? "请求有误" : data[DataConfig.DATA],
          });
        }
        // BLOCKED 标记此次error事件已经报告了错误，不需要再次出发提示模块
        return Promise.reject({ code: "BLOCKED" });
      }
    }
    return Promise.reject(error);
  },
);

export const request = axios;

export default http;
