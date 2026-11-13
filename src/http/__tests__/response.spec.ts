import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import type { AxiosAdapter, AxiosRequestConfig } from 'axios';
import http, { request } from '@/http';
import { SmartErrorNotifier } from '../method/error-notifier';
import { createCoreCfg } from '../method/default.config';

// 隔离路由页面加载；HTTP 实例、拦截器、适配器和下载工具均使用真实实现。
vi.mock('@/router', () => ({ default: { replace: vi.fn(), currentRoute: { value: {} } } }));

function responseConfig(data: unknown, meta?: AxiosRequestConfig['meta']): AxiosRequestConfig {
  return {
    meta,
    adapter: async (config) => ({ data, status: 200, statusText: 'OK', headers: {}, config })
  };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('HTTP 核心配置', () => {
  it('每次请求按存储键读取最新 token，并优先使用 cookie', async () => {
    const cookie = vi.spyOn(document, 'cookie', 'get').mockReturnValue('Token=cookie=value');
    const storedToken = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('session-value');
    const adapter = vi.fn<AxiosAdapter>(async (config) => ({
      data: { code: 0 },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    }));

    await request.get('/test', undefined, { adapter });
    expect(adapter.mock.calls[0]?.[0].headers.get('Token')).toBe('cookie=value');

    cookie.mockReturnValue('');
    await request.get('/test', undefined, { adapter });
    expect(storedToken).toHaveBeenCalledWith('Token');
    expect(adapter.mock.calls[1]?.[0].headers.get('Token')).toBe('session-value');
  });

  it('每次调用取 token 函数，并保留配置的请求头名称', () => {
    const token = vi
      .fn(() => '')
      .mockReturnValueOnce('first')
      .mockReturnValueOnce('second');
    const { getAuth } = createCoreCfg({ auth: { token, key: 'Authorization' } });

    expect(token).not.toHaveBeenCalled();
    expect(getAuth()).toEqual({ token: 'first', key: 'Authorization' });
    expect(getAuth()).toEqual({ token: 'second', key: 'Authorization' });
    expect(getAuth()).toEqual({ token: '', key: 'Authorization' });
  });

  it('直接采用 auth 回调返回的 token 和请求头名称', () => {
    const auth = vi.fn(() => ({ token: 'Token', key: 'Authorization' }));
    const cookie = vi.spyOn(document, 'cookie', 'get').mockReturnValue('Token=stored-value');
    const { getAuth } = createCoreCfg({ auth });

    expect(auth).not.toHaveBeenCalled();
    expect(getAuth()).toEqual({ token: 'Token', key: 'Authorization' });
    auth.mockReturnValue({ token: 'refreshed', key: 'X-Token' });
    expect(getAuth()).toEqual({ token: 'refreshed', key: 'X-Token' });
    expect(cookie).not.toHaveBeenCalled();
  });

  it('保留项目适配器的泛型签名和读取字段', () => {
    const dataAdapter = <T>(value: T) => ({ ok: true, payload: value, msg: '完成' });
    const config = createCoreCfg({
      fieldNames: { success: 'ok', message: 'msg' },
      dataAdapter
    });

    expect(config.dataAdapter).toBe(dataAdapter);
    const result = config.dataAdapter<{ id: number }>({ id: 1 });
    expectTypeOf(result.payload).toEqualTypeOf<{ id: number }>();
    expect(result[config.fieldNames.success]).toBe(true);
    expect(result[config.fieldNames.message]).toBe('完成');
    expect(createCoreCfg().dataAdapter({ success: true, data: 1, message: '完成' })).toEqual({
      success: true,
      data: 1,
      message: '完成'
    });
  });
});

describe('HTTP 统一响应', () => {
  it.each([
    { body: { code: 500, message: '导出失败' }, success: false, skip: false },
    { body: { code: 500, message: '导出失败' }, success: false, skip: true },
    { body: { code: 0, message: '成功' }, success: true, skip: false },
    { body: { name: '缺少业务码的 JSON', message: '导出失败' }, success: false, skip: false }
  ])('下载校验与统一提示：$body，skip=$skip', async ({ body, success, skip }) => {
    const notify = vi.spyOn(SmartErrorNotifier.prototype, 'notify').mockImplementation(() => {});
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    class DownloadURL extends URL {
      static createObjectURL = vi.fn(() => 'blob:test');
      static revokeObjectURL = vi.fn();
    }
    vi.stubGlobal('URL', DownloadURL);
    const blob = new Blob([JSON.stringify(body)], { type: 'application/json' });
    Object.defineProperty(blob, 'text', { value: async () => JSON.stringify(body) });
    const result = await request.get('/download', undefined, responseConfig(blob, { skipErrorHandler: skip }));
    expect(result).toEqual({ success, data: undefined, message: success ? '下载成功' : '导出失败' });
    expect(click).toHaveBeenCalledTimes(success ? 1 : 0);
    expect(notify).toHaveBeenCalledTimes(!success && !skip ? 1 : 0);
    if (!success && !skip)
      expect(notify).toHaveBeenCalledWith(expect.objectContaining({ title: '下载失败', description: '导出失败' }));
  });

  it('适配器异常不能被当作非 JSON 放行下载', async () => {
    vi.resetModules();
    const { HTTP_RUNTIME_CONFIG } = await import('@/app.config');
    vi.spyOn(HTTP_RUNTIME_CONFIG, 'dataAdapter').mockImplementationOnce(() => {
      throw new Error('适配失败');
    });
    const { request: configuredRequest } = await import('@/http');
    const { SmartErrorNotifier: ConfiguredNotifier } = await import('../method/error-notifier');
    const notify = vi.spyOn(ConfiguredNotifier.prototype, 'notify').mockImplementation(() => {});
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const blob = new Blob(['{"code":0}']);
    Object.defineProperty(blob, 'text', { value: async () => '{"code":0}' });
    expect(await configuredRequest.get('/download', undefined, responseConfig(blob))).toEqual({
      success: false,
      data: undefined,
      message: '适配失败'
    });
    expect(click).not.toHaveBeenCalled();
    expect(notify).toHaveBeenCalledOnce();
  });

  it.each([
    { input: { success: true, data: 0, message: '完成' }, expected: { success: true, data: 0, message: '完成' } },
    {
      input: { success: false, data: null, message: '失败' },
      expected: { success: false, data: undefined, message: '失败' }
    },
    { input: null, expected: { success: false, data: undefined, message: '响应结构与约定不符' } }
  ])('未配置自定义适配器时仍返回统一结果：$input', ({ input, expected }) => {
    expect(createCoreCfg().dataAdapter(input)).toEqual(expected);
  });

  it('成功响应返回 success 和业务数据，不提示失败', async () => {
    const notify = vi.spyOn(SmartErrorNotifier.prototype, 'notify').mockImplementation(() => {});
    const result = await request.get('/test', {}, responseConfig({ code: '0', data: { id: 1 } }));
    expect(result).toEqual({ success: true, data: { id: 1 }, message: '' });
    expect(notify).not.toHaveBeenCalled();
  });

  it('业务失败仍返回结果，并用适配后的消息提示一次', async () => {
    const notify = vi.spyOn(SmartErrorNotifier.prototype, 'notify').mockImplementation(() => {});
    const result = await request.post(
      '/test',
      {},
      responseConfig({ resultCode: 500, resultMessage: '余额不足' }, { apiBehaviorName: '支付' })
    );
    expect(result).toEqual({ success: false, data: undefined, message: '余额不足' });
    expect(notify).toHaveBeenCalledExactlyOnceWith({
      title: '支付失败',
      description: '余额不足',
      notifyType: 'notification',
      source: '/test'
    });
  });

  it('skipErrorHandler 仅抑制提示，仍返回失败结果', async () => {
    const notify = vi.spyOn(SmartErrorNotifier.prototype, 'notify').mockImplementation(() => {});
    const result = await request.get(
      '/test',
      {},
      responseConfig({ code: 500, message: '失败' }, { skipErrorHandler: true })
    );
    expect(result).toMatchObject({ success: false });
    expect(notify).not.toHaveBeenCalled();
  });

  it('网络错误继续 reject，不伪装成业务成功', async () => {
    vi.spyOn(SmartErrorNotifier.prototype, 'notify').mockImplementation(() => {});
    const error = new Error('offline');
    await expect(
      request.get(
        '/test',
        {},
        {
          adapter: async () => {
            throw error;
          }
        }
      )
    ).rejects.toBe(error);
  });

  it('下载成功返回 success=true', async () => {
    const notify = vi.spyOn(SmartErrorNotifier.prototype, 'notify').mockImplementation(() => {});
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    class DownloadURL extends URL {
      static createObjectURL = vi.fn(() => 'blob:test');
      static revokeObjectURL = vi.fn();
    }
    vi.stubGlobal('URL', DownloadURL);
    const blob = new Blob(['file'], { type: 'application/octet-stream' });
    Object.defineProperty(blob, 'text', { value: async () => 'file' });
    const result = await http.get('/download', undefined, responseConfig(blob));
    expect(result).toEqual({ success: true, data: undefined, message: '下载成功' });
    expect(click).toHaveBeenCalledOnce();
    expect(notify).not.toHaveBeenCalled();
  });

  it('业务错误使用 Naive UI 的 title/content 字段显示', () => {
    vi.useFakeTimers();
    const error = vi.fn();
    vi.stubGlobal('$notification', { error });
    new SmartErrorNotifier().notify({ title: '支付失败', description: '余额不足', source: '/pay' });
    vi.advanceTimersByTime(300);
    expect(error).toHaveBeenCalledExactlyOnceWith({
      title: '支付失败（共 1 条）',
      content: '余额不足\n\n来源：\n• /pay'
    });
  });
});
