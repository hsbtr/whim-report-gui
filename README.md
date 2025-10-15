# Whim Report GUI

Whim Report GUI 是一个基于 **Vue 3 + Vite** 的低代码数据可视化编辑器界面项目，提供页面导航、主题管理、图表编辑工作台及统一的接口请求体系，帮助团队快速搭建数据报表及交互式可视化页面。

## ✨ 项目特性

- **现代化技术栈**：采用 Vue 3 组合式 API、TypeScript、Pinia 与 Vue Router 构建单页应用，并通过 Vite 提供极速的开发体验。 【F:src/main.ts†L1-L20】【F:package.json†L1-L82】
- **Naive UI 设计体系**：借助 Naive UI 组件库构建导航、布局、弹窗等常用界面元素，同时支持主题色与明暗模式的切换。 【F:src/views/BaseLayout.vue†L3-L76】【F:src/config/ui.ts†L1-L31】
- **低代码图表编辑工作台**：提供包含素材面板（StencilArea）与画布（SketchpadArea）的编辑界面，便于在浏览器中构建并预览图表布局。 【F:src/views/ChartEditor.vue†L1-L64】
- **灵活的接口层**：内置 Axios 实例、响应数据适配器以及认证/错误处理策略，统一管理接口请求与异常提示。 【F:src/http/index.ts†L1-L196】
- **工程化保障**：配置 Vitest 单元测试、Cypress 端到端测试、ESLint + Prettier 规范以及 Husky/Commitlint 提交钩子，保障代码质量。 【F:package.json†L7-L64】

## 📁 项目结构

```
whim-report-gui/
├── src/
│   ├── api/                 # 业务接口封装
│   ├── assets/              # 静态资源
│   ├── components/          # 通用组件（含 low-code 工具集、表单、弹窗等）
│   ├── config/              # UI & 请求相关的全局配置
│   ├── hooks/               # 组合式函数
│   ├── http/                # Axios 实例与工具函数
│   ├── router/              # 路由定义
│   ├── stores/              # Pinia 状态管理
│   ├── utils/               # 工具函数
│   └── views/               # 页面视图（首页、数据源、图表编辑/预览等）
├── public/                  # 静态公共资源
├── cypress/                 # 端到端测试
├── mock/                    # 本地 Mock 数据
├── vite.config.ts           # Vite 主配置
└── package.json             # 项目脚本与依赖
```

> 提示：以上结构为常用目录概览，可根据业务需要继续扩展。

## 🚀 快速开始

### 环境要求

- Node.js >= 20.8.1
- 推荐使用 [pnpm](https://pnpm.io)（也可使用 npm/yarn）。

### 安装依赖

```bash
pnpm install
```

如需使用 npm：

```bash
npm install
```

### 本地开发

```bash
# 常规开发，默认使用后端接口
pnpm dev

# 启用本地 Mock 服务
pnpm dev:mock
```

开发服务器默认运行在 `http://localhost:5173/`。

### 构建与预览

```bash
# 进行类型检查并构建产物
pnpm build

# 预览打包结果
pnpm preview
```

### 代码检查与格式化

```bash
# ESLint 规则检查
pnpm lint

# 自动修复常见问题
pnpm lint:fix

# 使用 Prettier 格式化 src 目录
pnpm format

# 仅执行 TypeScript 类型检查
pnpm lint:tsc
```

### 测试

```bash
# 运行单元测试（Vitest）
pnpm test:unit

# 在开发服务器上运行 Cypress E2E 测试（交互模式）
pnpm test:e2e:dev

# 在生产构建上运行 Cypress E2E 测试（CI 场景推荐）
pnpm build && pnpm test:e2e
```

## 🔧 配置说明

### 环境变量

| 变量名                            | 说明                               |
| --------------------------------- | ---------------------------------- |
| `VITE_GLOB_APP_TITLE`             | 页面标题与默认品牌文案             |
| `VITE_DEV_PORT`                   | 本地开发服务器端口                 |
| `VITE_DEV_PATH` / `VITE_PRO_PATH` | 开发/生产的资源基础路径            |
| `VITE_APP_HTTP_PREFIX`            | 接口基础前缀，未配置时默认 `/api/` |

> 环境变量需以 `VITE_` 前缀命名，可在 `.env.*` 文件中配置，并通过 `import.meta.env` 访问。 【F:env.d.ts†L1-L13】【F:src/http/index.ts†L51-L66】

### UI 设置

`src/config/ui.ts` 中维护了项目级别的主题、语言、品牌等配置，可结合 Pinia 的 `useUiStore` 进行运行时切换。 【F:src/config/ui.ts†L1-L31】【F:src/stores/ui.ts†L1-L33】

### 接口请求

- 统一在 `src/http/index.ts` 中创建 Axios 实例，并封装请求/响应拦截器。
- 通过 `meta` 配置可控制错误提示、认证失败后的处理策略、文件下载等高级能力。
- `SmartErrorNotifier` 将接口异常转化为统一的提示体验，避免重复代码。 【F:src/http/index.ts†L1-L196】

## 🧩 核心模块一览

| 模块               | 说明                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------ |
| `BaseLayout`       | 顶部导航、主题切换与菜单逻辑的主布局组件。 【F:src/views/BaseLayout.vue†L1-L94】                       |
| `ChartEditor`      | 低代码可视化编辑界面，集成素材面板与画布区域。 【F:src/views/ChartEditor.vue†L1-L64】                  |
| `low-code-toolkit` | 提供绘图标尺、节点懒加载、框选等编辑器基础能力。 【F:src/components/low-code-toolkit/index.ts†L1-L23】 |
| `stores/ui`        | 管理主题、品牌色与多语言设置的 Pinia Store。 【F:src/stores/ui.ts†L1-L33】                             |
| `router/routes.ts` | 定义基础页面、图表编辑/预览等路由结构。 【F:src/router/routes.ts†L1-L71】                              |

## 🤝 贡献指南

1. Fork 仓库并创建特性分支：`git checkout -b feat/my-feature`。
2. 使用 `pnpm lint`、`pnpm test:unit` 等命令确保通过质量检查。
3. 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/)，仓库已配置 Husky 与 Commitlint 自动校验。 【F:package.json†L49-L63】
4. 发起 Pull Request 并详细描述改动内容。

## 📄 许可证

本项目未显式声明许可证，若需在生产环境使用或二次开发，请与项目维护者确认授权策略。

---

如有问题或建议，欢迎提交 Issue 或 Pull Request！
