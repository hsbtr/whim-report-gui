export * from './Line/Line.vue';
// export * from './Bar';
// export * from './List';
// export * from './Frame';
import type { LineMeta, LineMetaProps } from './Line/meta';
import type { BarMeta, BarMetaProps } from './Bar/meta';
import type { ListMeta, ListMetaProps } from './List/meta';
import type { FrameMeta, FrameMetaProps } from './Frame/meta';

type NotesType = LineMeta | BarMeta | ListMeta | FrameMeta;
type SeriesType = NotesType['belong'];
type GroupType = Omit<NotesType, 'props'> & { key: NotesType['type'] };
type NodeType = LineMetaProps | BarMetaProps | ListMetaProps | FrameMetaProps;
type PkgsValue= { group: GroupType[], nodes: NodeType[] };
type Pkgs = {
  [K in SeriesType]?: PkgsValue
}

const materialNotes: Record<string, { default: NotesType }> = import.meta.glob('./*/meta.ts', { eager: true });

const packages: Pkgs = {};
Object.keys(materialNotes).forEach((key) => {
  const { props, ...meta } = materialNotes[key].default;
  if (packages[meta.belong]) {
    const groupItem = { ...meta, key: meta.type };
    const pkg = packages[meta.belong] as PkgsValue;
    packages[meta.belong] = {
      group: [...pkg.group, groupItem],
      nodes: [...pkg.nodes, ...props],
    };
  } else {
    packages[meta.belong] = {
      group: [{ title: '全部', key: 'all', type: 'all', belong: meta.belong }, { ...meta, key: meta.type }],
      nodes: [...props]
    };
  }
});

const materialSeries = [
  {
    title: '图表',
    series: 'chart',
  },
  {
    title: '信息',
    series: 'view',
  },
  {
    title: '控件',
    series: 'control',
  },
];

export const createMaterialOptions = () => {
  console.log(materialNotes);
  const series = materialSeries.map(({ series, title }) => {
    return { label: title, key: series };
  });
  return {
    packages,
    series
  };
};
