import { useRouter, useRoute } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

export function useCurrentRoutes(): RouteRecordRaw[] {
  const { matched} = useRoute();
  const router = useRouter();
  const routes = router.getRoutes();
  const newRoutes: RouteRecordRaw[] = [];
  for (let i = 0; i < matched.length - 1; i++) {
    const current = routes.find((r) => r.name === matched[i].name);
    if (current && Array.isArray(current.children)) {
      newRoutes.push(...current.children);
      return newRoutes;
    }
  }
  return newRoutes;
}

