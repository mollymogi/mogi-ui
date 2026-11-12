# PR 工作台与纸感主题

此模式把 PR Pilot 实际页面的视觉层级同步到 mogi-ui：纸感主题 + 紧凑项目树，而非空旷的多列看板。

## 接入

- 预览：`?preview=pr-workspace&theme=paper`；`theme=light` 看默认暖色，暗色按钮切换基础暗色。
- 安装基础 `mogi-theme` 后安装 `mogi-theme-paper`，在根元素上设置 `data-palette="paper"`。
- workspace CSS 已包含可选主题；直接设置属性即可。字体接入沿用 README。
- 布局示例：`apps/docs/src/demo-pr-workspace.tsx` 与 `apps/docs/src/pr-workspace.css`。
  CSS 只作用于 `.pr-demo` 和抽屉 `.pr-demo-detail`，不会覆盖其他页面。

## 页面层级

1. 顶部品牌、主题切换，正文一句话说明与便签提示。
2. 三个摘要指标；独立折叠巡检记录，避免抢占主列表空间。
3. 四阶段统计条；搜索和项目筛选共同作用于当前 tab。
4. 进行中/已归档两个 tab；每页至多两个项目，每个项目先显示两条，再按需展开。
5. 项目标题是紧凑折叠触发器；PR 使用树枝连接，状态同时带图标与文字。
6. 详情在 Sheet 展开，正文独立滚动；关闭或 Escape 后返回原触发按钮。

示例所有项目、PR、进度和时间都是合成数据，不读取本地服务、不调用 GitHub、不触发评审/修复/合并。
使用方保留自己的状态机与数据接口，复用颜色、组件及布局规则即可。

## 来源与验证

paper 来自 mogi-ui `0f0de6f`，PR Pilot 的 vendored provenance 绑定此提交。
旧 #38 仅合入先决分支，paper 没有进入当前 main；此次回流不携带该旧分支的其他组件变更。
布局参考本地 PR Pilot `frontend/src/style.css`，用主线组件重组；受众无须安装 PR Pilot。

对比度包含基础亮/暗和 paper，发布变量与源码逐项比对。
浏览器检查脚本：`scripts/browser/pr-workspace.cjs`，覆盖 320/390/768/1440px、亮暗、筛选、折叠、分页、抽屉与焦点、减弱动态效果。
结果记录：`docs/validation/pr-workspace-browser.json`。
