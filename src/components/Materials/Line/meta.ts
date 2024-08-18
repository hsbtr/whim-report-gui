
export type LineMetaProps = {
  title: string;
  type: string;
};
export type LineMeta = {
  title: string;
  type: 'line';
  belong: 'chart';
  props: LineMetaProps[];
};

export default {
  title: '折线图',
  type: 'line',
  belong: 'chart',
  props: [
    {
      title: '普通折线图',
      type: 'line-1',
    }
  ]
};
