<script setup lang="ts">
import { reactive, onMounted, watch } from 'vue';
import { NGrid, NGridItem, NPagination, NCard, NImage, NText } from 'naive-ui';
import { CodeStatus } from '@/config';
import { getProjectPage } from '@/api/myProject';
import type { ProjectInfo, ProjectPageQuery } from '@/api/myProject';

type SearchOpt = { dataSource: ProjectInfo[]; total: number };
type OptionType = { label: string; value: string | number };
type RenderTextConfig = { options: OptionType[]; };

const fitterQuery = reactive<ProjectPageQuery>({ current: 1, pageSize: 15, });
const searchOpt = reactive<SearchOpt>({
  dataSource: [],
  total: 0,
});
const pagination = reactive({ current: 1, pageSize: 15 });

const projectStatusOptions = [
  { label: '未发布', value: 'unpublished' },
  { label: '已发布', value: 'published' },
];

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
const renderText = (text: string, { options }: RenderTextConfig) => {
  if (options && Array.isArray(options)) {
    const findItem = options.find((v) => v.value === text);
    return findItem ? findItem.label : '-';
  }
  return '-';
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
      <n-card content-class="customize-card-content" size="small" hoverable>
        <n-image :src="val.src" height="200" />
        <template #footer>
          <n-text>{{val.title || val.id || '未命名'}}</n-text>
          <n-text>
            {{renderText(val.status, { options: projectStatusOptions })}}
          </n-text>
        </template>
        <template #action>

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
