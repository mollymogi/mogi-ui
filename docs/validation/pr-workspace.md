# PR 工作台样式回流验证 · 2026-11-11

- 从最新 main `b26c5bc` 开始，只提取旧分支 paper 主题；其他主线语义色和组件继续沿用。
- `pnpm typecheck`、docs 生产构建、registry 重建通过。
- `node scripts/check-contrast.mjs`：444 次检查、0 失败；现有亮/暗门槛保留，paper 的墨色卡片轮廓另行检查。
- 对比度测试含 paper 低对比度和安装条目漂移的失败用例；组件仓库现有 Node 检查通过。
- Chrome 浏览器 18 项检查，0 页面异常：共享 token、硬阴影与独立焦点、跳转链接、搜索/筛选、折叠、分页、抽屉关闭后的焦点恢复、暗色、减弱动态效果。
- 320 / 390 / 768 / 1440px 的 paper 和暗色均无横向溢出。

证据：`pr-workspace-browser.json`；截图 `../images/pr-workspace-1440-paper.png` 和 `../images/pr-workspace-390-paper.png`。
示例不连接本地服务，不操作真实 PR；线上是否可见以主线合并后的 Pages 部署为准。
