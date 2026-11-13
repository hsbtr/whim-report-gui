import { afterEach, beforeEach, expect, expectTypeOf, it, vi } from 'vitest';
import { AxiosHeaders, type AxiosResponse } from 'axios';
import { download } from '../method/download';

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

it('按指定文件类型下载，使用响应头中的文件名', async () => {
  let filename = '';
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
    filename = this.download;
  });
  const result = await download(response(), { fileType: 'pdf' });

  expectTypeOf(result).toEqualTypeOf<{ success: boolean; message: string }>();
  expect(result).toEqual({ success: true, message: '下载成功' });
  expect(filename).toBe('report.pdf');
  expect(revoke).toHaveBeenCalledWith('blob:test');
  expect(document.querySelector('a[download]')).toBeNull();
});

it('给自定义文件名追加时间戳', async () => {
  vi.spyOn(Date, 'now').mockReturnValue(1700000000000);
  let filename = '';
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
    filename = this.download;
  });

  await download(response(), { fileType: 'pdf', customFileName: '自定义' });
  expect(filename).toBe('自定义1700000000000');
});

it('点击下载失败时返回失败结果并释放链接与 URL', async () => {
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {
    throw new Error('下载失败');
  });

  expect(await download(response(), { fileType: 'pdf' })).toEqual({ success: false, message: '下载失败' });
  expect(revoke).toHaveBeenCalledWith('blob:test');
  expect(document.querySelector('a[download]')).toBeNull();
});
