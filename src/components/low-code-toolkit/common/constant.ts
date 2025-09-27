/**
 * 物料大类别
 */
export const Pkg = {
  chart: { label: '图表', value: 'chart' },
  control: { label: '控件', value: 'control' },
  exhibit: { label: '展示', value: 'exhibit' },
} as const;
/**
 * ECharts 图表类型全集
 * 对应 series.type 可选值
 */
export const ChartOpts = {
  // 基础图表
  line: { label: '折线图', value: 'line' },
  bar: { label: '柱状图', value: 'bar' },
  pie: { label: '饼图', value: 'pie' },
  scatter: { label: '散点图', value: 'scatter' },
  effectScatter: { label: '涟漪散点图', value: 'effectScatter' },
  radar: { label: '雷达图', value: 'radar' },
  funnel: { label: '漏斗图', value: 'funnel' },
  gauge: { label: '仪表盘', value: 'gauge' },
  pictorialBar: { label: '象形柱图', value: 'pictorialBar' },
  candlestick: { label: 'K线图', value: 'candlestick' },

  // 关系 / 层次结构图
  graph: { label: '关系图', value: 'graph' },
  sankey: { label: '桑基图', value: 'sankey' },
  tree: { label: '树图', value: 'tree' },
  treemap: { label: '矩形树图', value: 'treemap' },
  sunburst: { label: '旭日图', value: 'sunburst' },
  boxplot: { label: '箱线图', value: 'boxplot' },

  // 地理 / 坐标系相关
  map: { label: '地图', value: 'map' },
  lines: { label: '飞线图', value: 'lines' },
  heatmap: { label: '热力图', value: 'heatmap' },
  parallel: { label: '平行坐标系', value: 'parallel' },
  themeRiver: { label: '主题河流图', value: 'themeRiver' },

  // 自定义
  custom: { label: '自定义图表', value: 'custom' }              // 自定义系列，可绘制任意图形
} as const;

export const ControlOpts = {
  frame: { label: '边框', value: 'frame' },
} as const;
export const ExhibitOpts = {
  list: { label: '表格', value: 'list' },
} as const;
export const PkgComponent = {
  ...ChartOpts,
  ...ControlOpts,
  ...ExhibitOpts,
} as const;

export const LowCodeShare = {
  globalState: 'LowCodeState',
  dragKey: 'DragKey',
} as const;
export const LowCodeEvent = {
  select: 'onSelect',
  addNode: 'addNode',
} as const;
