import 'axios';
import type { DownloadFileType } from './method/download';

/**
 * 请求 元 ，用于配置全局响应处理
 * 如： http.get('/user/info', undefined, { meta: { skipErrorHandler: true } })
 *     http.post('/user/edit', {}, { meta: { skipErrorHandler: true }})
 */
export interface CustomAxiosRequestConfigMeta {
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
  downFileConfig?: { fileType: DownloadFileType; customFileType?: string };
}

declare module 'axios' {
  interface AxiosRequestConfig {
    meta?: CustomAxiosRequestConfigMeta;
  }
}
