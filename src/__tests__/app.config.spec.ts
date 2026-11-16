import { describe, expect, it } from 'vitest';
import { AxiosHeaders, type AxiosResponse } from 'axios';
import { HTTP_RUNTIME_CONFIG } from '@/app.config';

describe('响应适配器', () => {
  it.each([true, false])('保留标准响应的 success=%j', (success) => {
    expect(HTTP_RUNTIME_CONFIG.dataAdapter({ success, code: success ? 500 : 0, message: '下载结果' })).toEqual({
      success,
      data: undefined,
      message: '下载结果'
    });
  });

  it.each([0, '0', ' 0 ', 200, '200'])('将成功业务码 %j 转为布尔结果并隐藏原始码', (code) => {
    expect(HTTP_RUNTIME_CONFIG.dataAdapter({ code, data: { id: 1 }, message: '完成' })).toEqual({
      success: true,
      data: { id: 1 },
      message: '完成'
    });
  });

  it('兼容服务端字段别名及优先级', () => {
    expect(
      HTTP_RUNTIME_CONFIG.dataAdapter({
        resultCode: '0',
        code: 500,
        resultData: false,
        data: 'ignored',
        resultMessage: '完成',
        message: 'ignored'
      })
    ).toEqual({ success: true, data: false, message: '完成' });
  });

  it.each([500, 'ERROR', '', ' ', false, null, undefined, {}, NaN])('业务码 %j 不能被误判为成功', (code) => {
    expect(HTTP_RUNTIME_CONFIG.dataAdapter({ code, message: '失败' })).toMatchObject({
      success: false,
      message: '失败'
    });
  });

  it.each([null, undefined, 'error', [], false, 0])('异常响应 %j 返回失败', (value) => {
    expect(HTTP_RUNTIME_CONFIG.dataAdapter(value)).toMatchObject({ success: false });
  });

  it.each([null, undefined])('缺失数据 %j 统一为 undefined', (data) => {
    expect(HTTP_RUNTIME_CONFIG.dataAdapter({ code: 0, data })).toEqual({
      success: true,
      data: undefined,
      message: ''
    });
  });

  it.each([201, 202, 204])('保留 HTTP %i 的成功语义', (status) => {
    const response: AxiosResponse = {
      data: undefined,
      status,
      statusText: '',
      headers: {},
      config: { headers: new AxiosHeaders() }
    };
    expect(HTTP_RUNTIME_CONFIG.dataAdapter(undefined, response)).toMatchObject({
      success: true,
      data: undefined
    });
  });
});
