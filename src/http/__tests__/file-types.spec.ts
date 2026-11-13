import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { download } from '../method/download';

declare global {
  interface DownloadFileTypeExtensions {
    csv: `text/${string}`;
  }
}

let downloaded: Blob | undefined;
it('校验不通过时通过返回值表达失败', async () => {
  await expect(
    download(new Blob(['file']), {
      fileType: 'pdf',
      validate: async () => ({ allow: false, message: '无权限' })
    })
  ).resolves.toEqual({ success: false, message: '无权限' });
  expect(downloaded).toBeUndefined();
});

it('校验抛出异常时也返回失败结果', async () => {
  await expect(
    download(new Blob(['file']), {
      fileType: 'pdf',
      validate: async () => {
        throw new Error('校验失败');
      }
    })
  ).resolves.toEqual({ success: false, message: '校验失败' });
  expect(downloaded).toBeUndefined();
});

it('非法文件流返回失败结果', async () => {
  await expect(download({} as Blob, { fileType: 'pdf' })).resolves.toEqual({
    success: false,
    message: '流不存在或格式非法，无法下载'
  });
  expect(downloaded).toBeUndefined();
});
beforeEach(() => {
  class DownloadURL extends URL {
    static createObjectURL = vi.fn((blob: Blob) => {
      downloaded = blob;
      return 'blob:test';
    });
    static revokeObjectURL = vi.fn();
  }
  downloaded = undefined;
  vi.stubGlobal('URL', DownloadURL);
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it('从全局表解析项目扩展名', async () => {
  vi.stubGlobal('$fileTypeMaps', { csv: 'text/csv;charset=utf-8' });
  await download(new Blob(['a,b']), { fileType: 'csv' });
  expect(downloaded?.type).toBe('text/csv;charset=utf-8');
});

it('项目配置覆盖内置映射', async () => {
  vi.stubGlobal('$fileTypeMaps', { pdf: 'text/plain' });
  await download(new Blob(['pdf']), { fileType: 'pdf' });
  expect(downloaded?.type).toBe('text/plain');
});

it('未配置时使用内置映射', async () => {
  vi.stubGlobal('$fileTypeMaps', undefined);
  await download(new Blob(['pdf']), { fileType: 'pdf' });
  expect(downloaded?.type).toBe('application/pdf');
});

it('覆盖值无效时拒绝下载，不回退默认值', async () => {
  vi.stubGlobal('$fileTypeMaps', { pdf: '' });
  await expect(download(new Blob(['pdf']), { fileType: 'pdf' })).resolves.toMatchObject({
    success: false,
    message: '文件扩展名 pdf 注册的 MIME 类型无效'
  });
  expect(downloaded).toBeUndefined();
});

it('没有全局表时允许直接传 MIME', async () => {
  vi.stubGlobal('$fileTypeMaps', undefined);
  await download(new Blob(['a,b']), { fileType: 'text/csv' });
  expect(downloaded?.type).toBe('text/csv');
});

it('扩展名已声明但未注册时阻止下载', async () => {
  vi.stubGlobal('$fileTypeMaps', undefined);
  await expect(download(new Blob(['a,b']), { fileType: 'csv' })).resolves.toMatchObject({ success: false });
  expect(downloaded).toBeUndefined();
});
