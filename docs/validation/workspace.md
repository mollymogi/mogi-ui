# 暖色工作台首版验证

范围：新增 DashboardLayout、总览/任务列表/任务详情演示，默认预览入口及使用文档。基于 origin/main d303e57，分支 feat/warm-workspace-dashboard。未连接真实业务服务，日期和记录均为示例，交互状态仅存在于当前页面。

## 结果

- UI 与 docs TypeScript 检查通过。
- Vite 生产构建通过；完整组件展览仍与演示共用包，存在 >500KB 的打包提醒，未在本次布局探索中拆包。
- 现有 token 对比度脚本：129 项、0 失败。此结果为 token 检查，不是完整页面无障碍认证。
- Chrome / Playwright 浏览器检查：25 项通过，无 pageerror。原始结果见 workspace-browser.json。
- 检查亮暗主题下 320、390、768、1024、1440px 的总览、列表、详情：无整页横向溢出。窄屏表格可独立横向滚动。
- 验证搜索与状态组合、空状态、清除筛选、查看详情、任务完成/重新开始、列表与总览计数更新、任务独立清单及跨视图保留。
- 检查原组件展览、原规则详情入口及首个键盘跳转链接。切换页面后焦点转移到标题。
- 人工查看桌面亮暗、移动亮色、任务列表和详情截图。

## 本次执行方式

```sh
node node_modules/typescript/bin/tsc --noEmit -p packages/ui/tsconfig.json
node node_modules/typescript/bin/tsc --noEmit -p apps/docs/tsconfig.json
node scripts/check-contrast.mjs
# apps/docs 目录
node node_modules/vite/bin/vite.js build
```

当前运行环境提供的 pnpm 为较新版本，会对已声明 onlyBuiltDependencies 的 esbuild 仍生成未决 allowBuilds 配置并拒绝执行。该自动生成的工作区配置变动已还原。registry 脚本已生成 .registry 输入，随后直接执行 `node node_modules/shadcn/dist/index.js build .registry/registry.json --output apps/docs/public/r`，成功产出 registry。没有为本次改动调整依赖版本、锁文件或构建信任配置。

## 截图

- ../images/workspace-desktop-light.png
- ../images/workspace-desktop-dark.png
- ../images/workspace-mobile-light.png
- ../images/workspace-mobile-dark.png
- ../images/workspace-tasks-light.png
- ../images/workspace-detail-light.png

验收范围为本地可交互设计首版；这些检查不代表已在线上发布。
