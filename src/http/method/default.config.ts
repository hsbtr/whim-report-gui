import type { AxiosResponse } from 'axios';

type ApiResponse = { success: boolean; data: unknown; message: string };
type DataAdapter<Result = object> = (res: unknown, response?: AxiosResponse) => Result;
type FieldNames = { success: string; message: string };
type DefaultFieldNames = { success: 'success'; message: 'message' };

type AuthOpts = {
  /** 字符串是存储键，函数返回实际 token。 */
  token?: string | (() => string);
  /** 请求头名称。 */
  key?: string;
};
/** 回调直接返回实际 token 和请求头名称。 */
type AuthFn = () => { token: string; key: string };
type CoreCfgOpts = {
  /** 供 HTTP 层读取适配结果，用于业务失败提示和下载校验。 */
  fieldNames?: FieldNames;
  auth?: AuthFn | AuthOpts;
  noAccessRedirectPath?: string;
  dataAdapter?: DataAdapter;
  statusEnum?: Record<number, string>;
};
type CoreCfgReturn<Adapter extends DataAdapter = DataAdapter, Fields extends FieldNames = FieldNames> = {
  fieldNames: Fields;
  getAuth: () => { token?: string; key: string };
  noAccessRedirectPath: string;
  getMessage: (key: string | number | undefined) => string | undefined;
  dataAdapter: Adapter;
};

const defaultDataAdapter: DataAdapter<ApiResponse> = (res) => {
  if (res === null || typeof res !== 'object' || Array.isArray(res)) {
    return {
      success: false,
      data: res ?? undefined,
      message: '响应结构与约定不符'
    };
  }

  const data = res as Record<string, unknown>;
  return {
    success: data.success === true,
    data: data.data ?? undefined,
    message: String(data.message ?? '')
  };
};

export function createCoreCfg<
  const Fields extends FieldNames,
  Adapter extends DataAdapter<Record<Fields['success'], boolean> & Record<Fields['message'], string>>
>(opts: CoreCfgOpts & { fieldNames: Fields; dataAdapter: Adapter }): CoreCfgReturn<Adapter, Fields>;
export function createCoreCfg<Adapter extends DataAdapter<Pick<ApiResponse, 'success' | 'message'>>>(
  opts: CoreCfgOpts & { fieldNames?: undefined; dataAdapter: Adapter }
): CoreCfgReturn<Adapter, DefaultFieldNames>;
export function createCoreCfg(
  opts?: CoreCfgOpts & { fieldNames?: undefined; dataAdapter?: undefined }
): CoreCfgReturn<typeof defaultDataAdapter, DefaultFieldNames>;
export function createCoreCfg(opts: CoreCfgOpts = {}): CoreCfgReturn {
  const { statusEnum, noAccessRedirectPath = '/login', dataAdapter } = opts;

  const getCookie = (name: string): string | undefined => {
    if (typeof document === 'undefined') return undefined;
    for (const item of document.cookie.split(';')) {
      const separator = item.indexOf('=');
      if (separator >= 0 && item.slice(0, separator).trim() === name) {
        return decodeURIComponent(item.slice(separator + 1));
      }
    }
    return undefined;
  };
  const getAuth = () => {
    const { auth } = opts;
    if (typeof auth === 'function') return auth();

    const { token = 'token', key = 'token' } = auth ?? {};
    if (typeof token === 'function') {
      return { key, token: token() };
    }
    const storedToken =
      getCookie(token) || (typeof sessionStorage === 'undefined' ? null : sessionStorage.getItem(token));
    return { key, token: storedToken ?? undefined };
  };

  const getMessage = (key: string | number | undefined) => {
    return typeof key === 'number' ? statusEnum?.[key] : key;
  };

  const hasProjectAdapter = typeof dataAdapter === 'function';
  return {
    fieldNames: (hasProjectAdapter && opts.fieldNames) || { success: 'success', message: 'message' },
    noAccessRedirectPath,
    getMessage,
    getAuth,
    dataAdapter: hasProjectAdapter ? dataAdapter : defaultDataAdapter
  };
}
