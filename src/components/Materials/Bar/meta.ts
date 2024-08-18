export type BarMetaProps = {
  title: string;
  type: string;
};
export type BarMeta = {
  title: string;
  type: 'bar';
  belong: 'chart';
  props: BarMetaProps[];
};
export default {
  title: '柱状图',
  type: 'bar',
  belong: 'chart',
  props: [
    {
      title: '普通柱状图',
      type: 'bar-1',
    },
    {
      title: '普通柱状图',
      type: 'bar-2',
    },
  ]
};
