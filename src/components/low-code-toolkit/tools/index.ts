
type ItemType = Record<string, any>;
/**
 * 拖拽开始注册图形
 * @param event
 * @param item
 */
export const dragRegisterGraphics = <T extends ItemType>(event: DragEvent, item: T) => {
  event.dataTransfer?.setData('low-code', JSON.stringify(item));
};


/**
 * 将模块配置转化为Schema
 */
export const generatedSchemas = <U extends ItemType, T extends ItemType, K extends ItemType>(modules: U, processFn: (item: K) => T): T[] => {
  const schemas: T[] = [];
  Object.keys(modules).forEach((key) => {
    const cfg = modules[key].default;
    if (typeof processFn === 'function') {
      const schema = processFn(cfg);
      schemas.push(schema);
    } else {
      schemas.push({ ...cfg });
    }
  });
  return schemas;
};


