# whim-report-gui 架构说明

## 1. 项目定位与成熟度

`whim-report-gui` 是一个面向低代码报表场景的 Vue 3 前端。仓库当前已经具备基础后台布局、项目分页列表、HTTP 请求封装、Mock 数据、主题切换和物料面板；图表编辑器、画布解析、配置持久化和预览渲染仍处于搭建阶段。

本文描述的是仓库当前代码，而不是目标蓝图。空组件或尚未串联的模块会明确标注，后续实现不应依赖未落地行为。

## 2. 技术栈

| 领域     | 选型                                   | 作用                               |
| -------- | -------------------------------------- | ---------------------------------- |
| 应用框架 | Vue 3                                  | Composition API 与 Vue SFC         |
| 语言     | TypeScript                             | 应用、配置、测试和物料类型         |
| 构建工具 | Vite 8                                 | 开发服务、构建、别名和模块自动发现 |
| UI       | Naive UI                               | 布局、菜单、表单、弹窗和主题       |
| 路由     | Vue Router 4                           | 静态页面路由                       |
| 状态管理 | Pinia 3                                | UI 主题、语言和账户状态            |
| HTTP     | Axios                                  | 统一请求、响应和错误拦截           |
| 图表     | ECharts 6 + vue-echarts 8              | 图表基础组件                       |
| 画布     | HTML Drag and Drop + vue3-sketch-ruler | 物料拖入画布、标尺和缩放           |
| Mock     | vite-plugin-mock + better-mock         | 本地接口模拟                       |
| 单元测试 | Vitest 4 + Vue Test Utils              | jsdom 环境下的组件测试             |
| E2E      | Cypress 16                             | 浏览器端流程测试                   |
| 包管理   | pnpm                                   | 依赖与脚本执行                     |

Node.js 版本要求以 `package.json` 为准，当前为 `>=22.13.0`。Vite 的主机和端口由 `VITE_DEV_SERVER_HOST`、`VITE_DEV_SERVER_PORT` 配置。`.env.development` 默认监听 `0.0.0.0:5173`。

## 3. 运行时启动流程

应用入口是 `src/main.ts`：

1. 导入全局样式 `src/assets/main.css`。
2. 通过 `createApp` 创建根应用。
3. 注册启用了持久化插件的 Pinia。
4. 注册 Vue Router，并等待 `router.isReady()`。
5. 将应用挂载到 `#app`。

根组件 `src/App.vue` 负责两个全局横切能力：

- `AppConfigProvider` 根据 `uiStore` 配置 Naive UI 的明暗主题、语言和 Highlight.js 实例。
- `PopupsInit` 在 Provider 内初始化 dialog、modal、notification 和 message，并把对应 API 暴露到 `window`。

因此，HTTP 错误通知等依赖 `window.$notification` 的逻辑只有在根 Provider 初始化后才可用。

## 4. 目录与职责

```text
.
├─ cypress/                         # Cypress E2E 用例、fixture 与支持代码
├─ mock/                            # vite-plugin-mock 接口定义
├─ public/                          # 原样复制的静态资源
├─ src/
│  ├─ api/                          # 面向业务域的接口函数与返回类型
│  ├─ assets/                       # 全局样式、基础样式和图片
│  ├─ components/
│  │  ├─ low-code-toolkit/          # 物料、编辑器上下文、画布和工具函数
│  │  ├─ popups/                    # Naive UI 全局反馈 Provider 初始化
│  │  ├─ pro-form/                  # 表单封装
│  │  └─ ve-chart/                  # ECharts 展示组件
│  ├─ config/                       # UI、请求字段、状态码等共享配置
│  ├─ hooks/                        # 可复用 Composition API hooks
│  ├─ http/                         # Axios 实例、拦截器和下载工具
│  ├─ router/                       # 路由实例与静态路由表
│  ├─ stores/                       # Pinia stores
│  ├─ utils/                        # 通用函数和 VNode 辅助方法
│  ├─ views/                        # 路由级页面
│  ├─ App.vue                       # 根 Provider 与 RouterView
│  └─ main.ts                       # 应用入口
├─ vite.config.ts                   # Vite、Vue、Mock、DevTools 与别名配置
├─ vitest.config.ts                 # Vitest 配置
└─ cypress.config.ts                # Cypress 配置
```

`@/` 在 Vite 和 TypeScript 中都映射到 `src/`。新增源码应继续使用该别名，避免深层相对路径。

## 5. 页面与路由

路由使用 `createWebHistory(import.meta.env.BASE_URL)`，路由表集中在 `src/router/routes.ts`。

主要页面关系如下：

```text
/
└─ /base
   ├─ /base/home          首页
   ├─ /base/test/about    关于页
   ├─ /base/project       项目列表
   └─ /base/data/source   数据源

/chart/editor             图表编辑器
/chart/preview            图表预览
```

`/base` 使用 `BaseLayout.vue`，其子路由通过嵌套 `RouterView` 渲染。顶部菜单由 `useCurrentRoutes()` 根据当前 matched routes 和静态路由表生成。

编辑器和预览页位于基础布局之外，适合承载独立的全屏工作区。目前：

- `ChartEditor.vue` 在 `LowCode` 上下文中挂载左侧物料面板和画布。画布支持拖放、标尺和框选。
- `ChartPreview.vue` 仍为空壳。
- `MyProject.vue` 的“编辑”操作会把项目 ID 放入 `/chart/editor?id=...` 并打开新标签页；“预览”当前未传项目 ID。

当前没有路由守卫、鉴权路由、动态菜单或自动路由注册。新增此类机制前应先明确后端协议和访问控制需求。

## 6. UI 状态与全局反馈

### 6.1 Pinia

`src/stores/ui.ts` 管理：

- 当前语言 `lang`；
- 主题 `light` / `dark`；
- 主色 `primaryColor`。

初始值来自 `src/config/ui.ts` 的 `setting`。当前语言切换只影响根组件传给 Naive UI 的 locale，没有注册完整的业务文案 i18n 流程。

`src/stores/account.ts` 管理账户状态和登录、退出操作，并通过 Pinia 持久化插件保存账户状态。

### 6.2 Naive UI Provider

`src/components/popups/AppConfigProvider.vue` 建立 Naive UI Provider。`PopupsInit.vue` 初始化 `window.$dialog`、`window.$modal`、`window.$notification` 和 `window.$message`。

这些全局对象的类型声明位于 `src/global.d.ts`。需要全局反馈时应复用现有对象，不要在模块顶层自行创建脱离 Provider 的实例。

## 7. HTTP 与数据协议

### 7.1 Axios 实例

`src/http/index.ts` 的默认导出是项目公共 HTTP 实例：

- `baseURL`：`VITE_APP_HTTP_PREFIX`，缺省为 `/api/`；
- `timeout`：5 秒；
- `withCredentials`：`true`；
- 数组 query 参数使用 `repeat` 形式序列化；
- 从 Cookie 或 `sessionStorage` 读取 `Token`，并写入同名请求头。

具名导出 `request` 封装同一个实例，提供带响应类型的方法和 Axios 配置式调用。业务 API 使用该封装。

```ts
import { request } from '@/http';
```

### 7.2 请求参数改写

请求拦截器当前约定如下：

| 调用                          | 实际发送位置 |
| ----------------------------- | ------------ |
| `request.get(url, params)`    | 查询字符串   |
| `request.delete(url, params)` | 查询字符串   |
| `request.post(url, data)`     | 请求体       |

示例：

```ts
export function getProjectPage(params: ProjectPageQuery): ApiPagingReturn<ProjectInfo> {
  return request.get<PagingDataType<ProjectInfo>>('project/page', params);
}
```

不要在接口路径中再次拼接 `/api/`，否则会与默认 `baseURL` 重复。

### 7.3 响应约定

`src/app.config.ts` 将业务响应整理为以下字段。

```text
success  业务是否成功
message  消息
data     业务数据
```

适配器兼容业务码 `0` 和 `200`，并优先使用响应中的布尔型 `success`。Blob 响应进入下载流程。错误通知可按请求配置。HTTP 401 默认清理账户状态并跳转到 `/login`，登录页路由有待接入。

### 7.4 Mock

`pnpm dev:mock` 设置 `VITE_DEV_MOCK=on`，启用 `vite-plugin-mock` 从 `mock/` 加载接口。Vitest 禁用 Mock 文件监听。`mockjs` 依赖通过包别名指向 `better-mock@0.3.7`。`pnpm-workspace.yaml` 为该别名放宽 `mockjs` peer 版本，并将插件使用的 `path-to-regexp` 固定到 6.3.0。

`mock/myProject.ts` 提供 `/api/project/page` 的 GET 分页数据，用于项目列表本地开发。响应适配器兼容该 Mock 返回的 `message`。

修改真实接口联调方式前，应先确认 Mock 是否仍会拦截相同 URL。

## 8. 低代码物料机制

低代码相关代码集中在 `src/components/low-code-toolkit/`。

```text
low-code-toolkit/
├─ common/     上下文键、分类和节点默认属性
├─ core/       编辑器上下文、物料面板、画布和标尺
├─ hooks/      上下文、框选和窗口尺寸监听
├─ packages/   物料元数据和组件
├─ tools/      节点属性合并、序列化和尺寸位置计算
└─ types/      物料和画布状态类型
```

### 8.1 自动发现

物料元数据和组件通过 `import.meta.glob` 收集。

- `packages/index.ts` 读取 `./*/meta.ts` 的默认导出，生成 `pkgMetas`。
- `LazyLoadNode.vue` 通过 `../packages/*/*.vue` 生成加载函数。只有节点进入画布时才加载对应组件。

现有分类包括图表 `chart`、控件 `control` 和展示 `exhibit`。每份 `meta.ts` 声明分类 `pkgType`、物料系列 `type` 和物料模板 `fieldProps`。模板的 `uuid` 必须唯一，前缀与组件文件名一致。

### 8.2 编辑器上下文

`LowCode.vue` 提供画布、节点和选中项等响应式状态，以及添加和选择节点的操作。画布组件通过 `useLowCodeContext()` 读取这些状态和操作。

### 8.3 物料面板与拖拽

`StencilArea.vue` 从 `pkgMetas` 按分类、系列和名称筛选物料。拖拽时，它将模板及 `loadPath` 写入 `LowCodeShare.dragKey`。`SketchpadArea.vue` 读取数据，生成节点标识和画布位置，交给 `LazyLoadNode.vue` 加载组件。

### 8.4 当前未闭环部分

仍待接通的流程包括项目配置的保存、读取、发布和删除，以及 `ChartPreview.vue` 的配置加载与渲染。

保存与预览依赖稳定的 Schema 类型和持久化协议。

## 9. 测试与构建

### 9.1 常用命令

```sh
pnpm dev
pnpm type-check
pnpm build
pnpm test:unit --run
pnpm test:e2e
```

`pnpm build` 会并行执行类型检查和 Vite 构建。`pnpm test:e2e` 会启动构建后的 preview 服务，并由 Cypress 访问 `http://localhost:4173`。

### 9.2 修改型脚本

以下脚本会改写文件：

```sh
pnpm lint:fix # ESLint --fix，范围是整个仓库
pnpm format   # Prettier --write src/
```

`.prettierrc.json` 当前使用 Prettier 3 支持的 `"arrowParens": "always"`，格式化和格式检查脚本可以直接使用。

只检查本次修改时应使用：

```sh
pnpm run lint:check -- <modified files>
pnpm run format:check -- <modified files>
```

### 9.3 当前测试覆盖

Vitest 覆盖响应适配、请求配置和文件下载。Cypress 覆盖首页导航、物料筛选和拖入画布后的组件渲染。

## 10. 变更边界与扩展原则

- 页面级功能放在 `src/views`，可复用 UI 放在 `src/components`。
- 业务接口放在 `src/api`，统一使用 `request`。
- 跨页面 UI 状态放在 Pinia；编辑器内部状态优先留在低代码上下文中，除非确实需要跨路由共享。
- 物料定义应保持声明式，避免让物料面板依赖具体组件内部实现。
- 在 Schema 格式稳定前，不要过早设计复杂插件系统、版本迁移层或远程物料协议。
- 修改 `vite.config.ts` 中的 Mock、别名或插件时，应同时检查 Vitest 对该配置的合并使用。
- 涉及浏览器交互的改动不能只依赖类型检查；拖拽、Provider、路由新窗口和主题行为需要实际页面验证。
