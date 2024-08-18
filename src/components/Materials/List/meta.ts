export type ListMetaProps = {
  title: string;
  type: string;
};
export type ListMeta = {
  title: string;
  type: 'list';
  belong: 'view';
  props: ListMetaProps[];
};
export default {
  title: '列表',
  type: 'list',
  belong: 'view',
  props: [
    {
      title: '普通列表',
      type: 'list-1',
    }
  ]
};
