import { afterEach, beforeEach, expect, expectTypeOf, it, vi } from 'vitest';
import { AxiosHeaders, type AxiosResponse } from 'axios';
import { download } from '../method/download';

// 独立工具不应读取应用配置。
vi.mock('@/app.config', () => {
  throw new Error('下载工具不应依赖应用配置');
});

const response = (): AxiosResponse<Blob> => ({
  data: new Blob(['file'], { type: 'application/pdf' }),
  status: 200,
  statusText: 'OK',
  headers: { 'content-disposition': 'attachment; filename="report.pdf"' },
  config: { headers: new AxiosHeaders() }
});
const revoke = vi.fn();
beforeEach(() => {
  class DownloadURL extends URL {
    static createObjectURL = vi.fn(() => 'blob:test');
    static revokeObjectURL = revoke;
  }
  vi.stubGlobal('URL', DownloadURL);
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  revoke.mockClear();
});

it('无需应用适配器，使用独立契约和响应中的文件名', async () => {
  let filename = '';
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
    filename = this.download;
  });
  expect(await download(response())).toEqual({ success: true, message: '下载成功' });
  expect(filename).toBe('report.pdf');
  expect(revoke).toHaveBeenCalledWith('blob:test');
  expect(document.querySelector('a[download]')).toBeNull();
});

it('仅在显式传入回调时转换最终结果，并推断返回类型', async () => {
  const result = await download(response(), {
    dataAdapter: async (value) => ({ ok: value.success, text: value.message })
  });
  expectTypeOf(result).toEqualTypeOf<{ ok: boolean; text: string }>();
  expect(result).toEqual({ ok: true, text: '下载成功' });
});

it('保留自定义完整文件名，不追加时间戳', async () => {
  let filename = '';
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
    filename = this.download;
  });
  await download(response(), { customFileName: '自定义.pdf' });
  expect(filename).toBe('自定义.pdf');
});

it('下载失败仍转换结果，且清理链接和 URL', async () => {
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {
    throw new Error('下载失败');
  });
  const adapter = vi.fn((value: { success: boolean; message: string }) => value.success);
  expect(await download(response(), { dataAdapter: adapter })).toBe(false);
  expect(adapter).toHaveBeenCalledExactlyOnceWith({ success: false, message: '下载失败' });
  expect(revoke).toHaveBeenCalledWith('blob:test');
  expect(document.querySelector('a[download]')).toBeNull();
});

it('适配回调异常直接传播，不重复调用回调', async () => {
  const error = new Error('adapter error');
  const adapter = vi.fn(() => {
    throw error;
  });
  await expect(download(response(), { dataAdapter: adapter })).rejects.toBe(error);
  expect(adapter).toHaveBeenCalledOnce();
});
