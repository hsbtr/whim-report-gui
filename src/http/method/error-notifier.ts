type NotifyType = 'message' | 'notification';

/**
 * 单条错误信息结构
 */
interface ErrorItem {
  /**
   * 主标题，一般是“操作失败”或接口行为
   */
  title: string;
  /**
   * 错误说明，一般是后端返回的 message 或自定义描述
   */
  description: string;
  /**
   * 来源，比如接口路径
   */
  source?: string;
  /**
   * 指定当前条错误的提示方式，优先于全局设定
   */
  notifyType?: NotifyType;
}

/**
 * 合并展示多个相似接口错误的通知队列
 */
export class SmartErrorNotifier {
  private buffer: ErrorItem[] = [];
  private timer: ReturnType<typeof setTimeout> | null = null;
  private isNotifying = false;

  /**
   * @param mergeDuration 批量错误合并的时间窗口（毫秒），默认 300ms
   * @param notifyType 默认的提示方式，可选为 'notification' 或 'message'
   */
  constructor(
    private mergeDuration = 300,
    private notifyType: NotifyType = 'notification'
  ) {}

  /**
   * 添加一条错误信息并准备合并展示
   * @param error 错误信息
   */
  notify(error: ErrorItem) {
    this.buffer.push(error);
    if (!this.isNotifying) {
      this.isNotifying = true;
      this.timer = setTimeout(() => this.flush(), this.mergeDuration);
    }
  }

  /**
   * 实际处理通知逻辑：合并、展示并清空缓存
   */
  private flush() {
    const grouped = this.groupByDescription(this.buffer);

    for (const [desc, errors] of grouped.entries()) {
      const [oneErr] = errors;
      const sources = errors.map((err) => `• ${err.source || err.title}`).join('\n');
      const title = `${oneErr?.title}（共 ${errors.length} 条）`;
      const content = sources ? `${desc}\n\n来源：\n${sources}` : desc;

      const notifyType: NotifyType = oneErr?.notifyType ?? this.notifyType;

      if (notifyType === 'notification') {
        window.$notification?.error?.({ title, content });
      } else {
        const compact = `${desc}${errors.length > 1 ? `（共 ${errors.length} 条）` : ''}`;
        window.$message?.error?.(compact);
      }
    }

    this.buffer = [];
    this.isNotifying = false;
  }

  /**
   * 将错误按 description 聚合为 Map
   * @param errors 错误数组
   */
  private groupByDescription(errors: ErrorItem[]): Map<string, ErrorItem[]> {
    const map = new Map<string, ErrorItem[]>();
    for (const err of errors) {
      const key = err.description || '未知错误';
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(err);
    }
    return map;
  }
}
