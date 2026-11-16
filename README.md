# Whim Report GUI

Whim Report GUI 是一个基于 **Vue 3 + Vite** 的低代码数据可视化编辑器界面项目，提供页面导航、主题管理、图表编辑工作台及统一的接口请求体系，帮助团队快速搭建数据报表及交互式可视化页面。

## ✨ 项目特性

- **现代化技术栈**：采用 Vue 3 组合式 API、TypeScript、Pinia 与 Vue Router 构建单页应用，并通过 Vite 提供极速的开发体验。 【F:src/main.ts†L1-L20】【F:package.json†L1-L82】
- **Naive UI 设计体系**提供导航、布局、弹窗和明暗模式切换。主题色和语言的初始值来自 UI 配置。 [布局组件](src/views/BaseLayout.vue) [UI 配置](src/config/ui.ts)
- **低代码图表编辑工作台**提供物料面板和画布，可拖入物料并在画布中查看渲染结果。独立的图表预览页仍待接入。 [编辑器](src/views/ChartEditor.vue) [预览页](src/views/ChartPreview.vue)
- **灵活的接口层**：内置 Axios 实例、响应数据适配器以及认证/错误处理策略，统一管理接口请求与异常提示。 【F:src/http/index.ts†L1-L196】
- **工程化保障**包括 Vitest 单元测试、Cypress 端到端测试、ESLint、Prettier 和 Husky。提交钩子运行暂存文件检查和 TypeScript 类型检查。 [项目脚本](package.json) [提交钩子](.husky/pre-commit)

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

- Node.js 版本范围为 `^22.22.2 || ^24.15.0 || >=26.0.0`，以 [package.json](package.json) 中的 `engines.node` 为准。
- 使用 [pnpm](https://pnpm.io) 安装依赖和运行脚本。

### 安装依赖

```bash
pnpm install
```

### 本地开发

```bash
# 启动开发服务器
pnpm dev

# 启用本地 Mock 服务（设置 VITE_DEV_MOCK=on）
pnpm dev:mock
```

开发服务器默认监听 `0.0.0.0:5173`，可从本机访问 `http://localhost:5173/`。常规开发默认请求同源的 `/api/`，由网关转发时可沿用此路径。直接联调后端时，在 `.env.development.local` 中将 `VITE_APP_HTTP_PREFIX` 设为后端接口的完整基础地址。

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

# 检查应用、工具配置和测试的 TypeScript 类型
pnpm type-check
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

项目新增的前端应用环境变量使用 `VITE_APP_`，由应用代码读取。开发服务器和 Mock 等开发工具变量使用 `VITE_DEV_`，由 `vite.config.ts` 通过 `loadEnv` 读取。

| 当前生效的变量         | 用途与默认值                                                            |
| ---------------------- | ----------------------------------------------------------------------- |
| `VITE_APP_HTTP_PREFIX` | 接口基础地址，默认 `/api/`。                                            |
| `VITE_DEV_SERVER_HOST` | 开发服务器监听地址，默认 `0.0.0.0`。                                    |
| `VITE_DEV_SERVER_PORT` | 开发服务器端口，默认 `5173`。                                           |
| `VITE_DEV_MOCK`        | 设置为 `on` 时开启 Mock，`pnpm dev:mock` 会设置该值。Vitest 禁用 Mock。 |

以下变量保留原名和类型声明，当前代码暂未读取这些配置。

| 保留变量                          | 原用途                         |
| --------------------------------- | ------------------------------ |
| `VITE_GLOB_APP_TITLE`             | 页面标题与默认品牌文案。       |
| `VITE_DEV_PORT`                   | 本地开发服务器端口。           |
| `VITE_DEV_PATH` / `VITE_PRO_PATH` | 开发和生产环境的资源基础路径。 |

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
2. 使用 `pnpm lint`、`pnpm type-check` 和 `pnpm test:unit --run` 检查改动。
3. 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/)。Husky 提交钩子检查暂存文件和 TypeScript 类型。 [提交钩子](.husky/pre-commit)
4. 发起 Pull Request 并详细描述改动内容。

## 📄 许可证

本项目未显式声明许可证，若需在生产环境使用或二次开发，请与项目维护者确认授权策略。

---

如有问题或建议，欢迎提交 Issue 或 Pull Request！
