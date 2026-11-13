import { request } from '@/http';
import type { ApiPagingQuery, ApiPagingReturn, PagingDataType } from '@/app.config';

export type ProjectPageQuery = ApiPagingQuery;
type ResourceStatus = 'unpublished' | 'published';
export type ProjectInfo = {
  id: string | number;
  title: string;
  src: string;
  status: ResourceStatus;
  createName: string;
  updateTime: string;
};
export function getProjectPage(params: ProjectPageQuery): ApiPagingReturn<ProjectInfo> {
  return request.get<PagingDataType<ProjectInfo>>('project/page', params);
}
