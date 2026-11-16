/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 开发服务主机
  VITE_DEV_SERVER_HOST: string;
  // 开发服务端口
  VITE_DEV_SERVER_PORT: string;
  // 开发地址
  VITE_DEV_PATH: string;
  // 生产地址
  VITE_PRO_PATH: string;
  // 请求地址前缀
  VITE_APP_HTTP_PREFIX?: string;
  // 标题
  VITE_APP_TITLE: string;
}
