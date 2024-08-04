import BaseLayout from '@/views/BaseLayout.vue';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'root',
    redirect(_to) {
      return { path: '/base' };
    },
  },
  {
    path: '/base',
    name: 'base',
    component: BaseLayout,
    redirect() {
        return { path: '/base/home', };
    },
    children: [
      {
        path: 'home',
        name: 'home',
        meta: {
          title: '首页',
        },
        component: () => import('@/views/HomeView.vue'),
      },
      {
        path: 'test',
        name: 'test',
        meta: {
          title: '测试',
        },
        redirect() {
            return { path: '/base/test/about' };
        },
        children: [
          {
            path: 'about',
            name: 'about',
            meta: {
              title: '关于',
            },
            component: () => import('@/views/AboutView.vue'),
          }
        ],
      },
      {
        path: 'project',
        name: 'project',
        meta: {
          title: '项目',
        },
        component: () => import('@/views/MyProject.vue'),
      },
      {
        path: 'data/source',
        name: 'data_source',
        meta: {
          title: '数据源',
        },
        component: () => import('@/views/DataSource.vue'),
      },
    ],
  },
  {
    path: '/chart/editor',
    name: 'chart_editor',
    meta: {
      title: '项目编辑',
    },
    component: () => import('@/views/ChartEditor.vue'),
  },
  {
    path: '/chart/preview',
    name: 'chart_preview',
    meta: {
      title: '项目预览',
    },
    component: () => import('@/views/ChartPreview.vue'),
  },
]
export default routes;
