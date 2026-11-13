/**
 * 生成组件的拖拽数据。
 */
export const dragRegisterGraphics = (event: DragEvent, item: object) => {
  event.dataTransfer?.setData('low-code', JSON.stringify(item));
};

/**
 * 将模块配置转化为 Schema。
 */
export const generatedSchemas = <Config, Schema>(
  modules: Record<string, Config>,
  processFn: (item: Config) => Schema
): Schema[] => Object.values(modules).map(processFn);
