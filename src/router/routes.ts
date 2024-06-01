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
    children: [],
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue')
  }
]
export default routes;
