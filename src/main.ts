import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

// 项目下载扩展表；新增键可在 DownloadFileTypeExtensions 中声明以获得类型提示。
window.$fileTypeMaps = {};

async function init() {
  const app = createApp(App);

  app.use(createPinia());
  app.use(router);
  await router.isReady();

  app.mount('#app');
}
init();
