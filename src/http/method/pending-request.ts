import Qs from 'qs';
import type { InternalAxiosRequestConfig } from 'axios';

/**
 * 请求记录map
 */
const pendingRequest = new Map<any, AbortController>();

/**
 * 用于根据当前请求的信息，生成请求 Key
 * @param config {object} 请求对象
 */
export function generateReqKey(config: InternalAxiosRequestConfig) {
  const { method, url, params, data } = config;
  return [method, url, Qs.stringify(params), Qs.stringify(data)].join('&');
}

/**
 * 用于把当前请求信息添加到pendingRequest对象中
 * @param config {object} 请求对象
 */
export function addPendingRequest(config: InternalAxiosRequestConfig) {
  const requestKey = generateReqKey(config);
  const abortController = new AbortController();
  config.signal = abortController.signal;
  if (!pendingRequest.has(requestKey)) {
    pendingRequest.set(requestKey, abortController);
  }
}

/**
 * 删除请求
 * @param config {object} 请求对象
 */
export function removePendingRequest(config: InternalAxiosRequestConfig) {
  const requestKey = generateReqKey(config);
  if (pendingRequest.has(requestKey)) {
    const abortController = pendingRequest.get(requestKey);
    abortController?.abort();
    pendingRequest.delete(requestKey);
  }
}
