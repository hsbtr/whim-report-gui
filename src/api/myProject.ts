import http from '@/http';
import type { PagingQuery, PagingType, ApiDataType } from '@/config';

export interface ProjectPageQuery extends PagingQuery {}
type ResourceStatus = 'unpublished' | 'published';
export type ProjectInfo = {
  id: string | number;
  title: string;
  src: string,
  status: ResourceStatus;
  createName: string;
  updateTime: string;
};
export function getProjectPage(params: ProjectPageQuery): PagingType<ProjectInfo> {
  return http.get('project/page', { data: params });
}
