# Dependency Security Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade vulnerable runtime and development dependencies, retain vue-i18n and Mock behavior, secure the default Vite listener, and reduce the npm official-registry audit to zero where upstream fixes exist.

**Architecture:** Apply the upgrade in three independently verifiable dependency groups: runtime/Mock, Vite/Vitest, and remaining development tooling. Re-resolve the pnpm lockfile after each group, run the checks closest to that group, and use the final audit to trace any residual advisory to its direct dependency instead of forcing transitive overrides.

**Tech Stack:** Vue 3, TypeScript, Vite, Vitest, Cypress, ECharts, vue-echarts, Axios, qs, vue-i18n, vite-plugin-mock, better-mock, ESLint, Prettier, pnpm.

## Global Constraints

- Use pnpm only; do not run npm or yarn.
- Preserve existing HTTP, chart, internationalization-package, and Mock behavior.
- Keep `vue-i18n` and upgrade it to `11.4.8`; do not introduce a new i18n application flow.
- Keep the package name `mockjs` for `vite-plugin-mock`, but resolve it to `better-mock@0.3.7` through a package alias.
- Use `peerDependencyRules.allowedVersions` only for the reviewed `mockjs`/better-mock compatibility exception.
- Set `engines.node` to `>=22.13.0`, which satisfies Vite 8, vue-i18n 11, ESLint 10, and the selected jsdom version.
- Do not use `pnpm update --latest`, `pnpm audit --fix --force`, or unsupported transitive overrides.
- Dependency and configuration changes use the approved configuration-file TDD exception: security audit, dependency resolution, existing tests, type checking, build, development server, and real Mock requests are the red/green evidence.
- Do not refactor business modules or fix the existing template Cypress assertion as part of this task.

---

### Task 1: Upgrade Runtime and Mock Dependencies

**Files:**

- Modify: `package.json`
- Modify: `pnpm-workspace.yaml`
- Modify: `pnpm-lock.yaml`

**Interfaces:**

- Consumes: Existing imports from `axios`, `qs`, `echarts`, `vue-echarts`, and the `mockjs` package name loaded internally by `vite-plugin-mock`.
- Produces: The same public import names and runtime behavior on patched package versions.

- [ ] **Step 1: Capture the failing production-security baseline**

Run:

```powershell
pnpm audit --prod --json --registry=https://registry.npmjs.org/
```

Expected: non-zero exit and the established production counts of 1 critical, 22 high, 34 moderate, and 2 low advisories.

- [ ] **Step 2: Update the runtime dependency declarations**

Use `apply_patch` to set these entries in `package.json`:

```json
"axios": "^1.19.0",
"echarts": "^6.1.0",
"mockjs": "npm:better-mock@0.3.7",
"naive-ui": "^2.44.1",
"qs": "^6.15.3",
"vue": "^3.5.41",
"vue-echarts": "^8.1.0",
"vue-i18n": "^11.4.8"
```

Keep all other production dependency declarations unchanged.

- [ ] **Step 3: Add the reviewed peer-version exception**

Use `apply_patch` to add this block to `pnpm-workspace.yaml`, preserving `allowBuilds`:

```yaml
peerDependencyRules:
  allowedVersions:
    mockjs: 0.3.7
```

This allows only the version-number mismatch between `vite-plugin-mock`'s `mockjs >=1.1.0` peer declaration and the compatible alias implementation.

- [ ] **Step 4: Resolve the runtime dependency group**

Run:

```powershell
pnpm install --strict-peer-dependencies
```

Expected: exit 0; no unresolved peer dependency error; `pnpm-lock.yaml` records `mockjs` as the `better-mock@0.3.7` alias.

- [ ] **Step 5: Verify runtime compilation and production audit**

Run:

```powershell
pnpm type-check
pnpm audit --prod --json --registry=https://registry.npmjs.org/
```

Expected: type check exits 0. The production audit count drops materially; any remaining entries are retained for Task 4 tracing rather than hidden.

- [ ] **Step 6: Commit the runtime group**

```powershell
git add package.json pnpm-workspace.yaml pnpm-lock.yaml
git commit -m "fix: 升级运行时依赖并替换 Mock 实现"
```

### Task 2: Upgrade Vite, Vitest, and the TypeScript Toolchain

**Files:**

- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `vite.config.ts`
- Modify only if required by verified API incompatibility: `vitest.config.ts`
- Modify only if required by verified type incompatibility: `src/components/ve-chart/VBar.vue`
- Modify only if required by verified type incompatibility: `src/components/ve-chart/VLine.vue`

**Interfaces:**

- Consumes: `vite.config.ts` through both the Vite CLI and `vitest.config.ts`'s `mergeConfig` call.
- Produces: A Vite 8 development/build configuration, Vitest 4 jsdom test environment, and unchanged Bar/Line chart APIs.

- [ ] **Step 1: Update coordinated build-tool declarations**

Use `apply_patch` to set these `devDependencies` in `package.json`:

```json
"@types/node": "^22.20.1",
"@vitejs/plugin-vue": "^6.0.8",
"@vitejs/plugin-vue-jsx": "^5.1.6",
"@vue/tsconfig": "^0.9.1",
"jsdom": "^29.1.1",
"sass": "^1.102.0",
"typescript": "~5.9.3",
"vite": "^8.2.1",
"vite-plugin-vue-devtools": "^8.2.1",
"vitest": "^4.1.10",
"vue-tsc": "^3.3.9"
```

Set:

```json
"engines": {
  "node": ">=22.13.0"
}
```

- [ ] **Step 2: Secure the Vite listener**

Use `apply_patch` in `vite.config.ts`:

```ts
server: {
  host: '127.0.0.1',
  port: 5173,
}
```

Do not alter Mock enablement, plugin order, aliases, or port.

- [ ] **Step 3: Resolve the build-tool dependency group**

Run:

```powershell
pnpm install --strict-peer-dependencies
```

Expected: exit 0 and a single compatible Vite 8 dependency graph for Vite, Vitest, Vue plugins, and DevTools.

- [ ] **Step 4: Run the upgraded unit-test and type pipelines**

Run:

```powershell
pnpm run test:unit:run
pnpm type-check
```

Expected: the existing HelloWorld Vitest test passes and type checking exits 0. If Vitest 4 reports a config API error, change only the incompatible import or option in `vitest.config.ts`, then rerun both commands.

- [ ] **Step 5: Build the production application**

Run:

```powershell
pnpm build
```

Expected: type check and Vite production build both exit 0. If ECharts 6 or vue-echarts 8 reports a concrete type/API incompatibility, make the smallest change in `VBar.vue` or `VLine.vue` that preserves the existing props, provide/inject theme, and Bar/Line registrations; then rerun the file-specific lint/format checks, type check, and build.

- [ ] **Step 6: Verify local-only development serving and Mock output**

Start the server:

```powershell
pnpm dev -- --strictPort
```

Confirm its startup output advertises `http://127.0.0.1:5173` and does not advertise a network URL. Then request:

```powershell
Invoke-RestMethod 'http://127.0.0.1:5173/api/project/page?page=1&pageSize=2'
```

Expected: HTTP 200 and a Mock response containing `code: 200`, `data.total: 56`, and two generated rows.

- [ ] **Step 7: Commit the build-tool group**

```powershell
git add package.json pnpm-lock.yaml vite.config.ts vitest.config.ts src/components/ve-chart/VBar.vue src/components/ve-chart/VLine.vue
git commit -m "fix: 升级 Vite 测试与图表工具链"
```

Stage only files that were actually modified.

### Task 3: Upgrade Remaining Security-Relevant Development Tools

**Files:**

- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `eslint.config.js`
- Delete: `.eslintrc.cjs`

**Interfaces:**

- Consumes: Existing `lint`, `lint:check`, Cypress, build orchestration, and preview-test scripts.
- Produces: Equivalent Vue/TypeScript/Cypress lint coverage using ESLint 10 flat config, plus patched Cypress and process-runner dependency trees.

- [ ] **Step 1: Update security-relevant development dependencies**

Use `apply_patch` to remove `@rushstack/eslint-patch` and set:

```json
"@vue/eslint-config-prettier": "^10.2.0",
"@vue/eslint-config-typescript": "^14.9.0",
"cypress": "^15.20.1",
"eslint": "^10.8.1",
"eslint-plugin-cypress": "^7.0.0",
"eslint-plugin-vue": "^10.10.0",
"npm-run-all2": "^8.0.4",
"prettier": "^3.9.6",
"start-server-and-test": "^3.0.12"
```

Change the fix script to flat-config-compatible syntax:

```json
"lint": "eslint . --fix"
```

Keep `lint:check` as `eslint` so AGENTS.md can pass explicit modified paths.

- [ ] **Step 2: Replace the legacy ESLint configuration**

Delete `.eslintrc.cjs` with `apply_patch` and create `eslint.config.js` with:

```js
import { defineConfig, globalIgnores } from 'eslint/config';
import pluginCypress from 'eslint-plugin-cypress';
import pluginVue from 'eslint-plugin-vue';
import { withVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import skipFormattingConfig from '@vue/eslint-config-prettier/skip-formatting';

export default withVueTs(
  globalIgnores(['dist/**', 'dist-ssr/**', 'coverage/**', 'cypress/videos/**', 'cypress/screenshots/**']),
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    rules: {
      semi: ['error', 'always'],
      eqeqeq: ['error', 'always'],
      'object-curly-spacing': ['error', 'always'],
      'comma-spacing': ['error', { before: false, after: true }]
    }
  },
  {
    files: ['cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}', 'cypress/support/**/*.{js,ts,jsx,tsx}'],
    extends: [pluginCypress.configs.recommended]
  },
  skipFormattingConfig
);
```

This preserves the legacy essential Vue, recommended TypeScript, Cypress recommended, and custom rule intent.

- [ ] **Step 3: Resolve with strict peers**

Run:

```powershell
pnpm install --strict-peer-dependencies
```

Expected: exit 0; ESLint 10 uses only `eslint.config.js`; no dependency requires the removed Rushstack patch.

- [ ] **Step 4: Verify lint, formatting, and Cypress installation**

Run:

```powershell
pnpm run lint:check -- eslint.config.js vite.config.ts vitest.config.ts cypress.config.ts src/components/ve-chart/VBar.vue src/components/ve-chart/VLine.vue
pnpm run format:check -- package.json pnpm-workspace.yaml eslint.config.js vite.config.ts vitest.config.ts cypress.config.ts src/components/ve-chart/VBar.vue src/components/ve-chart/VLine.vue
pnpm exec cypress verify
pnpm exec cypress version
```

Expected: lint and format checks exit 0; Cypress binary verification exits 0 and reports package/binary version 15.20.1. Do not modify the stale template E2E assertion in this dependency task.

- [ ] **Step 5: Commit the development-tool group**

```powershell
git add package.json pnpm-lock.yaml eslint.config.js .eslintrc.cjs
git commit -m "chore: 升级开发工具并迁移 ESLint 配置"
```

### Task 4: Trace and Resolve Residual Audit Findings

**Files:**

- Modify only when evidence identifies a direct root: `package.json`
- Modify when dependency resolution changes: `pnpm-lock.yaml`

**Interfaces:**

- Consumes: The dependency graph produced by Tasks 1–3 and npm official security advisories.
- Produces: A documented zero-audit graph, or an exact list of upstream-unfixed residual advisories with paths and trigger conditions.

- [ ] **Step 1: Run fresh full and production audits**

Run:

```powershell
pnpm audit --json --registry=https://registry.npmjs.org/
pnpm audit --prod --json --registry=https://registry.npmjs.org/
```

Expected target: both exit 0 with zero vulnerabilities.

- [ ] **Step 2: Trace every residual module if the target is not met**

Use this PowerShell snippet to enumerate and trace each distinct module named by the audit:

```powershell
$auditText = (& pnpm audit --json --registry=https://registry.npmjs.org/ 2>$null) -join "`n"
$audit = $auditText | ConvertFrom-Json -AsHashtable
$moduleNames = $audit.advisories.Values.module_name | Sort-Object -Unique
foreach ($moduleName in $moduleNames) {
  pnpm why $moduleName
}
```

Record the direct root and compare its installed range with the advisory's `patched_versions`. Do not change any package until this path proves which direct dependency controls it.

- [ ] **Step 3: Apply only supported residual fixes**

For a residual whose direct root has a compatible published release, update that direct dependency in `package.json` with `apply_patch`, then run:

```powershell
pnpm install --strict-peer-dependencies
pnpm run test:unit:run
pnpm type-check
pnpm build
```

For a residual with no upstream fix or only an incompatible forced override, leave the graph unchanged and capture the advisory ID, dependency path, affected environment, and trigger condition for the final report.

- [ ] **Step 4: Re-run audits after each supported fix**

```powershell
pnpm audit --json --registry=https://registry.npmjs.org/
pnpm audit --prod --json --registry=https://registry.npmjs.org/
```

Expected: zero advisories, or only the explicitly documented upstream-unfixed set.

- [ ] **Step 5: Commit any evidence-driven residual upgrades**

If `package.json` or `pnpm-lock.yaml` changed in this task:

```powershell
git add package.json pnpm-lock.yaml
git commit -m "fix: 清理剩余依赖安全告警"
```

### Task 5: Synchronize Documentation and Run Final Verification

**Files:**

- Modify: `docs/ARCHITECTURE.md`
- Modify: `docs/superpowers/specs/2026-08-13-dependency-security-upgrade-design.md`
- Create: `docs/superpowers/plans/2026-08-13-dependency-security-upgrade.md`

**Interfaces:**

- Consumes: Verified package versions, Node engine floor, Vite host behavior, Mock alias, and actual final audit results.
- Produces: Repository documentation that matches the installed and verified toolchain.

- [ ] **Step 1: Update architecture facts**

Use `apply_patch` in `docs/ARCHITECTURE.md` to reflect:

- Vite 8 and Vitest 4.
- ECharts 6 and vue-echarts 8.
- Node.js `>=22.13.0`.
- Local Mock using `vite-plugin-mock` with the `mockjs` alias backed by better-mock.
- Default development listener `127.0.0.1:5173`; network exposure requires explicit `--host`.
- Remove any obsolete statement that the current Prettier `arrowParens` value is invalid.

- [ ] **Step 2: Synchronize the design engine constraint**

Ensure the design document states `engines.node` as `>=22.13.0`, matching the executed ESLint 10 and jsdom 29 toolchain.

- [ ] **Step 3: Run repository-required targeted checks**

Run with the actual modified-file list:

```powershell
pnpm run lint:check -- vite.config.ts vitest.config.ts cypress.config.ts eslint.config.js src/components/ve-chart/VBar.vue src/components/ve-chart/VLine.vue
pnpm run format:check -- package.json pnpm-workspace.yaml vite.config.ts vitest.config.ts cypress.config.ts eslint.config.js src/components/ve-chart/VBar.vue src/components/ve-chart/VLine.vue docs/ARCHITECTURE.md docs/superpowers/specs/2026-08-13-dependency-security-upgrade-design.md docs/superpowers/plans/2026-08-13-dependency-security-upgrade.md
pnpm run test:unit:run
pnpm type-check
pnpm build
```

Expected: all commands exit 0.

- [ ] **Step 4: Verify dependency structure and security one final time**

Run:

```powershell
pnpm list --depth 0
pnpm install --frozen-lockfile --strict-peer-dependencies
pnpm audit --json --registry=https://registry.npmjs.org/
pnpm audit --prod --json --registry=https://registry.npmjs.org/
git diff --check
git status --short
```

Expected: top-level versions match the plan, frozen install exits 0 without peer errors, audits are zero or match the explicitly documented upstream-unfixed set, diff check exits 0, and status contains only intentional task files.

- [ ] **Step 5: Commit documentation and the implementation plan**

```powershell
git add docs/ARCHITECTURE.md docs/superpowers/specs/2026-08-13-dependency-security-upgrade-design.md docs/superpowers/plans/2026-08-13-dependency-security-upgrade.md
git commit -m "docs: 同步依赖升级与安全验证说明"
```
