import type { MockMethod } from 'vite-plugin-mock';

export default function(): MockMethod[] {

  return [
    {
      url: '/api/project/page',
      method: 'get',
      response: ({ query }) => {
        return {
          code: 200,
          message: '请求成功',
          data: {
            total: 56,
            [`data|${query.pageSize}`]: [{ id: '@id', title: '@title', src: '@image(200,#ff6600)', status: 'unpublished', createName: '@name', updateTime: '@time' }],
          },
        };
      }
    }
  ];
}
