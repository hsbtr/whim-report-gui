import type { AxiosResponse } from 'axios';

export type MimeTypeString = `${string}/${string}`;
type DefaultFileType = 'zip' | 'docx' | 'xlsx' | 'pdf' | 'png' | 'jpg' | 'jpeg';
export type DownloadFileType = DefaultFileType | Extract<keyof DownloadFileTypeExtensions, string> | MimeTypeString;

type DownloadOpts = {
  /** 内置扩展名、window.$fileTypeMaps 注册的项目扩展名，或完整 MIME 类型。 */
  fileType: DownloadFileType;
  /** 自定义下载文件名（不含扩展名） */
  customFileName?: string;
  /**
   * 该回调函数用检测伪装成 blob 的数据
   */
  validate?: (res: Blob) => Promise<{ allow: boolean; message: string }>;
};
/**
 * 通用下载工具函数，自动识别文件流、提取文件名，并触发浏览器下载。
 * @param source
 * @param opts
 * @returns 下载结果 Promise；下载失败也正常返回 success: false。
 */
export function download(
  source: AxiosResponse<Blob> | Blob,
  opts: DownloadOpts
): Promise<{ success: boolean; message: string }> {
  const { fileType, customFileName } = opts;
  /**
   * 支持下载多种类型文件（ZIP、XLSX、DOCX、PDF、图片等）的工具方法。
   * 可自动识别后端返回是否为错误 JSON 流，支持自定义文件名与 MIME 类型。
   */
  const defaultFileTypeMaps: Record<DefaultFileType, MimeTypeString> = {
    zip: 'application/zip;charset=utf-8',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xlsx: 'application/vnd.ms-excel',
    pdf: 'application/pdf',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg'
  };
  const getFileName = (): string => {
    if (customFileName) {
      return `${customFileName}${Date.now()}`;
    }
    const disposition = !(source instanceof Blob) ? source?.headers?.['content-disposition'] : undefined;
    if (disposition) {
      const filenameRegex = /filename\*?=(?:UTF-8'')?"?([^";\n]*)/i;
      const match = disposition.match(filenameRegex);
      if (match?.[1]) {
        return decodeURIComponent(match[1]);
      }
    }
    return `新文件${Date.now()}`;
  };
  const getMimeType = (type: DownloadOpts['fileType']): string => {
    const maps: Record<string, MimeTypeString | undefined> = {
      ...defaultFileTypeMaps,
      ...(window.$fileTypeMaps ?? {})
    };
    if (Object.prototype.hasOwnProperty.call(maps, type)) {
      const mime = maps[type];
      if (typeof mime === 'string' && /^[^/\s]+\/[^/\s]+/.test(mime)) return mime;
      throw new Error(`文件扩展名 ${type} 注册的 MIME 类型无效`);
    }
    if (/^[^/\s]+\/[^/\s]+/.test(type)) return type;
    throw new Error(`不支持或尚未注册的文件扩展名：${type}`);
  };

  const down = (blob: Blob, fileName: string) => {
    const link = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    try {
      link.style.display = 'none';
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
    } finally {
      link.remove();
      window.URL.revokeObjectURL(url);
    }
  };

  return new Promise((resolve) => {
    const run = async () => {
      try {
        const blobData = !(source instanceof Blob) ? source?.data : source;
        if (!(blobData instanceof Blob)) {
          return resolve({ success: false, message: '流不存在或格式非法，无法下载' });
        }
        if (opts.validate && typeof opts.validate === 'function') {
          const { allow, message } = await opts.validate(blobData);
          if (!allow) return resolve({ success: false, message: message || '接口返回错误信息' });
        }

        const fileName = getFileName();
        const mimeType = getMimeType(fileType) || blobData.type;
        if (!mimeType) {
          return resolve({
            success: false,
            message: '未能识别文件 MIME 类型，请指定 fileType 或 mimeType'
          });
        }

        const blob = new Blob([blobData], { type: mimeType });
        down(blob, fileName);

        resolve({ success: true, message: '下载成功' });
      } catch (error: unknown) {
        // @ts-expect-error 读取真实错误信息
        resolve({ success: false, message: error?.message || '下载失败，发生未知异常' });
      }
    };
    run();
  });
}
