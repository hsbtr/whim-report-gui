<script setup lang="ts">
import { reactive, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { NGrid, NGridItem, NPagination, NCard, NImage, NText, NEllipsis, NDropdown, NButton, NIcon } from 'naive-ui';
import { EllipsisHorizontal, HammerOutline, BrowsersOutline, PaperPlaneOutline, TrashBinOutline } from '@vicons/ionicons5';
import { CodeStatus } from '@/config';
import { renderIcon } from '@/utils';
import { getProjectPage } from '@/api/myProject';
import type { ProjectInfo, ProjectPageQuery } from '@/api/myProject';
import type { DropdownProps, MenuOption } from 'naive-ui';

type SearchOpt = { dataSource: ProjectInfo[]; total: number };
type OptionType = { label: string; value: string | number };
type RenderTextConfig = { options: OptionType[]; };

const router = useRouter();
const fitterQuery = reactive<ProjectPageQuery>({ current: 1, pageSize: 15, });
const searchOpt = reactive<SearchOpt>({
  dataSource: [],
  total: 0,
});
const pagination = reactive({ current: 1, pageSize: 15 });
console.log(router)
const projectStatusOptions = [
  { label: '未发布', value: 'unpublished' },
  { label: '已发布', value: 'published' },
];

const dropdownMenuItems: DropdownProps['options'] = [
  {
    label: '编辑',
    key: 'edit',
    icon: renderIcon(HammerOutline),
  },
  {
    label: '预览',
    key: 'preview',
    icon: renderIcon(BrowsersOutline),
  },
  {
    label: '发布',
    key: 'release',
    icon: renderIcon(PaperPlaneOutline),
  },
  {
    label: '删除',
    key: 'delete',
    icon: renderIcon(TrashBinOutline),
  },
];

const renderText = (text: string, { options }: RenderTextConfig) => {
  if (options && Array.isArray(options)) {
    const findItem = options.find((v) => v.value === text);
    return findItem ? findItem.label : '-';
  }
  return '-';
};
const getProjectDataSource = async (params: ProjectPageQuery) => {
  try {
    const { code, data } = await getProjectPage(params);
    if (code === CodeStatus.SUCCESS) {
      const { total, data: rows } = data;
      searchOpt.dataSource = rows;
      searchOpt.total = total;
      return;
    }
  } catch (e) {
    searchOpt.dataSource = [];
    searchOpt.total = 0;
  }
};
const onPaginationChange = (page: number, pageSize: number) => {
  pagination.current = page;
  pagination.pageSize = pageSize;
};
const onMenuSelect = (key: string | number, option: MenuOption, item: ProjectInfo) => {
  if (key === 'edit') return router.push({ path: '/chart/edit', query: { id: item.id }, });
};
watch(pagination, (newValue) => {
  getProjectDataSource({ ...newValue });
})
onMounted(() => {
  getProjectDataSource({  pageSize: pagination.pageSize, current: 1 });
})

</script>

<template>
<div class="project-wrapper">
  <n-grid :x-gap="20" :y-gap="20" :cols="5" responsive="screen">
    <n-grid-item v-for="val in searchOpt.dataSource" :key="val.id">
      <n-card content-class="customize-card-content" size="small" footer-class="project-item-footer" hoverable>
        <n-image :src="val.src" height="200" />
        <template #footer>
          <n-ellipsis class="title">
            {{val.title || val.id || '未命名'}}
          </n-ellipsis>
          <n-text>
            {{renderText(val.status, { options: projectStatusOptions })}}
          </n-text>
          <n-dropdown :options="dropdownMenuItems" @select="(key, option) => onMenuSelect(key, option, val)">
            <n-button size="small">
              <template #icon>
                <n-icon size="small">
                  <EllipsisHorizontal />
                </n-icon>
              </template>
            </n-button>
          </n-dropdown>
        </template>
      </n-card>
    </n-grid-item>
  </n-grid>
  <n-pagination
    class="customize-pagination"
    :item-count="searchOpt.total"
    :page="pagination.current"
    :page-size="pagination.pageSize"
    :page-sizes="[15, 25, 55, 100]"
    @update:page="(page) => onPaginationChange(page, pagination.pageSize)"
    @update:pageSize="(pageSize) => onPaginationChange(pagination.current, pageSize)"
    show-size-picker
  >
    <template #prefix="{ itemCount, pageSize }">
      第1-{{pageSize}}条/总共{{itemCount}}条
    </template>
  </n-pagination>
</div>
</template>

<style scoped lang="scss">
.project-wrapper {
  width: 100%;
  :deep(.project-item-footer) {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .title {
      width: 40%;
      max-width: 40%;
    }
  }
  :deep(.customize-pagination) {
    margin: 16px 0 0 0;
    justify-content: right;
  }
  :deep(.customize-card-content) {
    display: flex;
    justify-content: center;
    align-content: center;
  }

}
</style>
