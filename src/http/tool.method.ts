import Qs from "qs";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import axios from "axios";

/**
 * 请求记录map
 * @type {Map<any, any>}
 */
const pendingRequest = new Map();

/**
 * 用于把当前请求信息添加到pendingRequest对象中
 * @param config {object} 请求对象
 */
export function addPendingRequest(config: InternalAxiosRequestConfig) {
  const requestKey = generateReqKey(config);
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      if (!pendingRequest.has(requestKey)) {
        pendingRequest.set(requestKey, cancel);
      }
    });
}

/**
 * 用于根据当前请求的信息，生成请求 Key
 * @param config {object} 请求对象
 */
export function generateReqKey(config: InternalAxiosRequestConfig) {
  const { method, url, params, data } = config;
  return [method, url, Qs.stringify(params), Qs.stringify(data)].join("&");
}

/**
 * 删除请求
 * @param config {object} 请求对象
 */
export function removePendingRequest(config: InternalAxiosRequestConfig) {
  const requestKey = generateReqKey(config);
  if (pendingRequest.has(requestKey)) {
    const cancelToken = pendingRequest.get(requestKey);
    cancelToken(requestKey);
    pendingRequest.delete(requestKey);
  }
}
type ResultType = { result?: any; resultCode: string | number; resultMsg: string };
/**
 * 下载类
 * setName 根据请求体自动设置文件名 如 需要自定义 请直接使用 实列filename赋值
 * zip 压缩包 传入blob文件流 完成后自动执行下载方法
 * xlsx exel表格文件 传入blob文件流 完成后自动执行下载方法
 * down 下载方法
 *
 */
export class Download {
  private readonly response: AxiosResponse;
  private filename: string;
  private blob: Blob | null;

  constructor(response: AxiosResponse) {
    this.blob = null;
    this.filename = "";
    this.response = response;
  }

  /**
   * 检测是否为 文件流
   * @param {Object|Blob} [responseData]
   */
  inspect(responseData?: NonNullable<unknown> | Blob): Promise<ResultType> {
    return new Promise((resolve) => {
      let { data } = this.response || {};
      if (!data && responseData) {
        data = responseData;
      } else if (!data && !responseData) {
        resolve({
          resultCode: 600,
          resultMsg: "检测到必要变量不存在",
        });
      }
      const file = new FileReader();
      file.onload = function (event: ProgressEvent<FileReader>) {
        const { result } = event.target || {};
        const success = {
          resultCode: 200,
          resultMsg: "下载成功",
        };
        if (!result) return resolve(success);
        try {
          const value: ResultType = JSON.parse(result as string);
          resolve(value);
        } catch (e) {
          // 此处表示 当前为数据流
          resolve(success);
        }
      };
      file.readAsText(data);
    });
  }

  /**
   * 默认自动设置文件名 需要传一个备选文件名；
   * @param {Object} [request] 请求体
   * @param {string} [customName] 备选文件名 默认值新文件
   */
  autoFileName(request?: InternalAxiosRequestConfig, customName = "新文件") {
    let disposition = null;
    if (this.response && !request) {
      disposition = this.response.headers ? this.response.headers["content-disposition"] : null;
    } else if (request && !this.response) {
      disposition = request.headers ? request.headers["content-disposition"] : null;
    }

    if (disposition) {
      const name = disposition.split("=")[1];
      if (name) {
        if (name.includes(";")) return (this.filename = decodeURI(name.split(";")[0]));
        return (this.filename = decodeURIComponent(escape(name)));
      }
      this.filename = customName + new Date().getTime();
    }
  }

  /**
   * 压缩包
   * @param {Blob} [blobData] 文件流
   */
  zip(blobData?: Blob) {
    let { data } = this.response || {};
    if (!data && blobData) {
      data = blobData;
    }
    this.blob = new Blob([data], { type: "zip;charset=utf-8" });
    this.autoFileName();
    this.down();
  }

  /**
   * xlsx 文件格式
   * @param {Blob} [blobData] 文件流
   */
  xlsx(blobData?: Blob) {
    let { data } = this.response || {};
    if (!data && blobData) {
      data = blobData;
    }
    this.blob = new Blob([data], { type: "application/vnd.ms-excel" });
    this.autoFileName();
    this.down();
  }

  /**
   * 下载 最终调用
   */
  down() {
    if (!this.blob) return;
    const url = window.URL.createObjectURL(this.blob as Blob);
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    link.download = `${this.filename}`;
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
  }
}

export const getCookie = (key: string): string | undefined => {
  //获取所有的cookie "psw=1234we; rememberme=true; user=Annie"
  const totalCookie = document.cookie;
  //获取参数所在的位置
  const cookieStartAt = totalCookie.indexOf(key + "=");
  //判断参数是否存在 不存在直接返回
  if (cookieStartAt === -1) {
    return;
  }
  //获取参数值的开始位置
  const valueStartAt = totalCookie.indexOf("=", cookieStartAt) + 1;
  //以;来获取参数值的结束位置
  let valueEndAt = totalCookie.indexOf(";", cookieStartAt);
  //如果没有;则是最后一位
  if (valueEndAt === -1) {
    valueEndAt = totalCookie.length;
  }
  //截取参数值的字符串
  return unescape(totalCookie.substring(valueStartAt, valueEndAt));
};
