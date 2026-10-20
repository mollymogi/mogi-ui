# 暖色工作台：总览、列表、详情

本次探索参考 Lisso / HALO LAB 的暖色工作台、Dude Studios 的模块比例，以及紧凑任务表格的信息密度；重新组合为 mogi 的奶油、姜橘、摩卡视觉。没有复制第三方图片、素材或代码。

- [Lisso](https://dribbble.com/shots/27207466-Dashboard-for-a-Productivity-Product-Lisso)
- [Dashboard UI Bento Cards](https://dribbble.com/shots/26300624-Dashboard-UI-Bento-Cards)
- [Renza Tasks](https://dribbble.com/shots/27514201-Task-Management-Dashboard-Tasks-Screen-UI-Design)

## 页面组织

总览用主要任务和项目作为视觉中心，统计只作辅助。右侧强调一件值得继续的事，下面放活动记录。列表提供紧凑表格、状态筛选和搜索。详情以摘要、正文、清单与参考来源连续排版，任务属性和完成操作放在侧栏。窄屏按主要内容到辅助内容排列，表格保留自身横向滚动，不挤压整页。

默认预览为工作台；`?preview=dashboard` 可直达；`?preview=components` 保留组件展览；`?preview=detail-layout` 保留原规则详情。日期、任务、动态全部明确标为演示。完成状态、计数、项目进度在本次页面内联动，刷新后恢复。没有真实持久化或服务连接。

## 可复用布局

```tsx
import { DashboardLayout } from "@mogi-ui/ui/components/dashboard-layout"

<DashboardLayout
  navigation={<nav aria-label="工作空间">{/* 链接 */}</nav>}
  header={<header>{/* 面包屑、主题操作 */}</header>}
  aside={<section>{/* 辅助内容，可省略 */}</section>}
>
  {/* 总览、列表或详情 */}
</DashboardLayout>
```

壳包含一个主内容 `main#dashboard-main`，不要在其中再嵌套 main，也不要在同一文档渲染多个 DashboardLayout。导航在 `lg` 下变为顶部内容，辅助栏在 `xl` 下移到主内容之后。导航是否折叠、路由、搜索和业务状态由使用方管理。示例特有的视觉样式位于 docs 的 dashboard.css，不会进入安装方的全局主题。现有颜色与字体 token 保持不变。

安装：`npx shadcn add https://mollymogi.github.io/mogi-ui/r/dashboard-layout.json`。主线发布前请使用本分支本地 registry 验证，此链接尚不代表线上可安装。

## 交互动效与动态卡片

参考 Obsidian 的《Flip Card - Inspira UI》与《AI 前端设计 / 动效 / 3D Skills 合集》，并复核 [Inspira UI Flip Card](https://inspira-ui.com/docs/en/components/cards/flip-card) 的交互说明。mogi 使用自己的 React 实现，不安装 Vue、GSAP 或新的动效依赖。

- 精确指针悬停：项目卡片轻抬 4px、图标轻转、任务箭头右移；按压时轻微收缩。
- 导航切换：内容短距离淡入；统计、进度条和完成勾选在进入或状态变化时反馈，没有持续循环的装饰动画。
- 今日重点：点击“翻看行动清单”沿 Y 轴翻转，背面展示与任务详情同步的清单和进度，正面保留打开任务的入口。正反面共用同一个网格单元，高度由较高的一面撑开，避免翻面时页面跳动。
- 完成任务：实际状态更新后短暂提示，再自动消失。任务完成与清单勾选是独立演示操作，勾选清单不会自动声称任务完成。
- 触屏使用点击翻面；隐藏面 `inert` 且 `aria-hidden`，不能聚焦或误点。翻面按钮始终在卡片外保留焦点。
- 系统开启“减弱动态效果”时去掉位移和旋转，卡片直接切换，交互功能仍保留。

`FlipCard` 也加入了组件展览和 registry：

```tsx
import { FlipCard } from "@mogi-ui/ui/components/flip-card"

<FlipCard
  front={<section>当前重点与主要操作</section>}
  back={<section>补充信息或行动清单</section>}
  showBackLabel="翻看行动清单"
  showFrontLabel="返回今日重点"
/>
```

不要给两面固定同一高度来截断长内容。不要在背面藏唯一的必要操作、错误或待确认信息。卡片周围应留出焦点环空间。
