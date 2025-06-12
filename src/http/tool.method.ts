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
 * 支持下载多种类型文件（ZIP、XLSX、DOCX、PDF、图片等）的工具方法。
 * 可自动识别后端返回是否为错误 JSON 流，支持自定义文件名与 MIME 类型。
 */

type DownloadWithinFileType = 'zip' | 'docx' | 'xlsx' | 'pdf' | 'png' | 'jpg' | 'jpeg';

type DownloadWithinFileMaps = {
  [K in DownloadWithinFileType]: string;
};

const fileTypeMaps: DownloadWithinFileMaps = {
  zip: 'application/zip;charset=utf-8',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.ms-excel',
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
};

// fileType 和 mimeType 二选一
type TypeOption =
  | { fileType: DownloadWithinFileType; mimeType?: never }
  | { mimeType: string; fileType?: never }

interface BaseOptions {
  /** 自定义下载文件名（不含扩展名） */
  customFileName?: string;
}

// response 与 stream 二选一，配合 TypeOption
type DownloadOptions =
  | ({ response: AxiosResponse; stream?: never } & BaseOptions & TypeOption)
  | ({ stream: Blob; response?: never } & BaseOptions & TypeOption);

interface DownloadResult {
  code: number;
  message: string;
}

/**
 * 通用下载工具函数，自动识别文件流、提取文件名，并触发浏览器下载。
 * @param options 下载选项
 * @returns 下载结果 Promise
 */
export function download(options: DownloadOptions): Promise<DownloadResult> {
  const getFileName = (): string => {
    if (options.customFileName) {
      return `${options.customFileName}${Date.now()}`;
    }

    const disposition = options?.response?.headers?.['content-disposition'];
    if (disposition) {
      const filenameRegex = /filename\*?=(?:UTF-8'')?"?([^";\n]*)/i;
      const match = disposition.match(filenameRegex);
      if (match?.[1]) {
        return decodeURIComponent(match[1]);
      }
    }

    return `新文件${Date.now()}`;
  };

  const down = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return new Promise((resolve, reject) => {
    const run = async () => {
      try {
        const blobData = 'response' in options ? options.response?.data : options.stream;

        if (!(blobData instanceof Blob)) {
          return reject({ code: 0, message: '流不存在或格式非法，无法下载' });
        }

        // 检测是否为错误 JSON（如错误响应包装成 Blob 返回）
        const text = await blobData.text();
        try {
          const value: ResultType = JSON.parse(text);
          if (typeof value?.resultCode === 'number' && value?.resultCode !== 200) {
            return reject({ code: value.resultCode, message: value.resultMsg || '接口返回错误信息' });
          }
        } catch (_) {
          // 不是 JSON，说明是合法流
        }

        const fileName = getFileName();
        const mimeType = options.mimeType || (options.fileType && fileTypeMaps[options.fileType]) || blobData.type;

        if (!mimeType) {
          return reject({ code: 0, message: '未能识别文件 MIME 类型，请指定 fileType 或 mimeType' });
        }

        const blob = new Blob([blobData], { type: mimeType });
        down(blob, fileName);

        resolve({ code: 1, message: '下载成功' });
      } catch (error: any) {
        reject({ code: -1, message: error?.message || '下载失败，发生未知异常' });
      }
    };
    run();
  });
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
