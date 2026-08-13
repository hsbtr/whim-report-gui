# 依赖安全升级设计

## 背景

项目的直接依赖和 `pnpm-lock.yaml` 主要停留在 2024 年版本。使用 npm 官方 registry 执行审计时，全量依赖命中 5 个 critical、58 个 high、58 个 moderate 和 8 个 low 安全公告；仅生产依赖树命中 1 个 critical、22 个 high、34 个 moderate 和 2 个 low 安全公告。

依赖树当前可以被 pnpm 正常解析，没有 peer dependency 冲突。风险主要来自旧版本累积的安全公告，以及 Vite 开发服务在 Windows 上绑定 `0.0.0.0` 后形成的实际网络暴露。

## 目标

- 尽量清零 npm 官方 registry 返回的安全审计告警。
- 保留现有 Vue 3 应用、HTTP 请求、图表和本地 Mock 业务行为。
- 保留并升级 `vue-i18n`，即使当前源码尚未使用它。
- 保留 Mock 能力；将无修复版本的官方 `mockjs` 替换为 API 兼容实现。
- 采用分组升级和逐组验证，便于定位大版本兼容问题。
- 保持 pnpm 作为唯一包管理器，不引入与任务无关的生产依赖。

## 非目标

- 不重构 HTTP 封装、图表组件、低代码编辑器或业务页面。
- 不引入新的国际化业务流程。
- 不重写现有 Mock 接口或更换 Mock 服务架构。
- 不为了追求所有依赖的最新版本而升级与安全审计无关的包。

## 方案

### 1. 构建与测试工具链

协调升级以下依赖，确保 peer dependency 版本一致：

- `vite`：`8.2.1`
- `@vitejs/plugin-vue`：`6.0.8`
- `@vitejs/plugin-vue-jsx`：`5.1.6`
- `vite-plugin-vue-devtools`：`8.2.1`
- `vitest`：`4.1.10`

Vite 8 要求 Node.js `^20.19.0 || >=22.12.0`，`vue-i18n` 11.4.8 要求 Node.js `>=22`，ESLint 10 要求 Node.js `^20.19.0 || ^22.13.0 || >=24`；所选工具链取交集后，`package.json` 的 `engines.node` 调整为 `>=22.13.0`。当前本地 Node.js 22.21.1 满足要求。

`vite.config.ts` 的开发服务默认监听地址从 `0.0.0.0` 改为 `127.0.0.1`。需要局域网访问时，可由开发者通过 Vite CLI 显式传入 `--host 0.0.0.0`，避免默认暴露源码和环境文件。

`vitest.config.ts` 继续合并 Vite 配置。若升级后类型或配置 API 发生变化，只做维持现有 jsdom 测试行为所需的最小调整。

### 2. 运行时依赖

升级直接参与应用运行的依赖：

- `axios`：`1.19.0`
- `qs`：`6.15.3`
- `vue-i18n`：`11.4.8`
- `echarts`：`6.1.0`
- `vue-echarts`：`8.1.0`

`vue-i18n` 仍保留在 `dependencies` 中，不新增 `createI18n` 或业务文案配置。

图表组件继续按需注册 `BarChart`、`LineChart`、Canvas renderer、Title、Tooltip 和 Legend。只有在 ECharts 6 或 vue-echarts 8 的类型、组件属性发生实际不兼容时，才修改 `VBar.vue` 或 `VLine.vue`。

Axios 和 qs 的公共使用方式保持不变：业务接口继续复用 `src/http` 的 Axios 实例，query 参数仍通过 `Qs.stringify(..., { arrayFormat: "repeat" })` 序列化。

### 3. Mock 兼容替换

官方 `mockjs` 最新版本仍为 1.1.0，且安全公告没有修复版本。为满足保留和升级 Mock 能力的要求，`package.json` 中的 `mockjs` 使用 pnpm/npm 包别名指向 `better-mock@0.3.7`：

```json
"mockjs": "npm:better-mock@0.3.7"
```

别名继续向 `vite-plugin-mock` 提供名为 `mockjs` 的依赖入口，使插件和现有 Mock 模板无需改写。现有 `mock/myProject.ts` 的接口、分页查询和 Mock.js 数据模板保持不变。

由于 `vite-plugin-mock` 的 peer dependency 仍声明为 `mockjs >=1.1.0`，而兼容实现自身版本号为 0.3.7，`pnpm-workspace.yaml` 通过 `peerDependencyRules.allowedVersions` 明确允许 `mockjs` 使用 0.3.7。该规则只消除已人工确认兼容的版本号误判，不忽略其他 peer dependency 问题。

`vite-plugin-mock` 当前最新版本仍为 3.0.2，并支持 Vite 4 以上版本，因此暂不改动其版本；升级后通过启动开发服务和请求 Mock 接口验证兼容性。

### 4. 传递依赖与剩余告警

更新直接依赖后重新解析 `pnpm-lock.yaml`，让允许范围内的 `form-data`、`follow-redirects`、`lodash`、`lodash-es`、`postcss`、`nanoid`、`shell-quote` 等传递依赖进入修复版本。

随后重新运行官方 registry 安全审计。若仍有告警，使用 `pnpm why` 追踪到直接依赖，只升级实际根因包。例如剩余告警由 Cypress、ESLint 或其他开发工具固定旧传递依赖引入时，再对对应工具做协调升级；不使用无边界的 `pnpm update --latest`。

如某个公告在上游最新版中仍无修复版本，记录依赖路径、触发条件和剩余风险，不通过不受支持的 `pnpm.overrides` 强行替换不兼容版本。

## 修改范围

预计修改：

- `package.json`：直接依赖、开发依赖和 Node.js engines。
- `pnpm-lock.yaml`：由 pnpm 根据新依赖组合重新解析。
- `pnpm-workspace.yaml`：记录 `mockjs` 兼容实现的 peer dependency 例外。
- `vite.config.ts`：安全的默认监听地址，以及升级所需的最小兼容修改。
- `vitest.config.ts`：仅在 Vitest 4 兼容性要求下修改。
- `src/components/ve-chart/VBar.vue`、`src/components/ve-chart/VLine.vue`：仅在 ECharts 6 类型或 API 确认不兼容时修改。
- `docs/ARCHITECTURE.md`：同步构建、测试、图表和 Mock 依赖说明。

不会主动修改其他业务模块。

## 验证设计

当前失败的 `pnpm audit --registry=https://registry.npmjs.org/` 作为安全基线。依赖和配置升级属于配置变更，不新增只为断言版本号而存在的生产导出或人工业务测试。

验证按以下层次执行：

1. 每个升级分组后运行 `pnpm install`，确认无 peer dependency 告警。
2. 运行现有 Vitest 非 watch 测试，确认测试框架升级可用。
3. 对修改的源码或配置运行项目规定的 ESLint 和 Prettier 检查。
4. 运行 `pnpm type-check` 和 `pnpm build`，验证 TypeScript、Vue SFC、Vite 和图表调用链。
5. 启动开发服务，确认只监听本机地址，页面可访问且控制台无启动错误。
6. 请求 `/api/project/page`，确认 `vite-plugin-mock` 与 `better-mock` 兼容且分页模板仍生效。
7. 再次执行全量和生产依赖安全审计，记录实际剩余告警。

如果某组升级失败，先根据错误定位到该组的直接依赖或配置边界，只调整该组，不叠加其他无关升级。
