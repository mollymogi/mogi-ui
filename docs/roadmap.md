# 基于 shadcn/ui 搭建自有组件库：评估与方案

## 一、为什么 shadcn/ui 适合做底座

| 优点 | 说明 |
|---|---|
| 代码归你所有 | 不是 npm 依赖，组件源码直接复制进项目，改样式、改结构都不受限，正好符合"在成熟库上改造"的思路 |
| 行为层成熟 | 底层是 Radix UI（新版也支持 Base UI），可访问性、键盘交互、焦点管理都已解决，你只需管"长什么样" |
| 主题机制清晰 | Tailwind + CSS 变量（`--primary`、`--radius` 等），换一套变量就能整体换风格 |
| 自带分发能力 | 官方 Registry 机制：你可以发布自己的 registry，团队用 `npx shadcn add @你的库/button` 安装你改造后的组件 |
| 生态大 | 有大量社区 block、主题生成器、Figma 资源可以参考 |

## 二、需要提前想清楚的代价

1. **技术栈锁定**：React + Tailwind。如果将来要支持 Vue，需要另起一套（可参考 shadcn-vue，但两边要分别维护）。
2. **上游更新要手动合并**：因为代码是复制过来的，shadcn 修 bug 或升级 Radix/Tailwind 时不会自动跟进。改得越深，合并成本越高。
3. **不是"装上就用"的包**：使用方拿到的是源码，好处是可改，坏处是各项目可能各改各的，风格会再次漂移。需要约定"只改 token，不改组件"。
4. **组件覆盖面有限**：复杂组件（数据表格、富文本、树、虚拟列表等）shadcn 只给了基础或示例，需要自己补或接 TanStack Table 之类。

## 三、和其他选择的简单对比

- **Ant Design / Arco / TDesign**：组件全、开箱即用，适合中后台；但风格深度定制难，改造成"自己的样子"成本高。
- **MUI / Chakra**：主题系统强，但运行时样式 + 包依赖，深度改结构不方便。
- **直接用 Radix / React Aria 从头写样式**：最自由，但等于把 shadcn 已经做的工作重做一遍。

结论：如果目标是"统一的自有风格 + 完全可控"，shadcn 是目前最合适的起点；如果目标是"中后台组件尽量全、尽快可用"，Ant 系更省事。

## 四、建议的落地方案

### 1. 先定 Design Token（风格的唯一来源）
分三层，组件只引用语义层：
- **基础层**：色板（如 `jasmine-50…900`）、字号、间距、圆角、阴影、动效时长
- **语义层**：`--background`、`--primary`、`--muted`、`--destructive`、`--ring`、`--radius` 等，沿用 shadcn 的变量名，兼容性最好
- **组件层（少量）**：只在确有需要时加，如 `--button-height-md`

亮色 / 暗色各一套语义层。Token 用一份 JSON 维护，可用 Style Dictionary 生成 CSS 变量和 Tailwind 配置，后续也能同步到 Figma。

### 2. 统一风格的手段（按优先级）
1. 改 token：颜色、圆角、阴影、字体，覆盖 80% 的风格差异
2. 改 `cva` 变体：统一 size（sm/md/lg）、variant 命名，所有组件用同一套
3. 改结构：只在交互或视觉确实不同时才动 JSX
4. 加自有组件：业务常用但 shadcn 没有的

### 3. 项目结构（monorepo）
```
jasmine-ui/
├─ packages/
│  ├─ tokens/        # token JSON + 生成的 CSS 变量 / Tailwind preset
│  └─ ui/            # 改造后的组件源码（registry 的来源）
├─ apps/
│  ├─ docs/          # 文档站 + 组件预览，同时托管 registry JSON
│  └─ playground/    # 可选，用于调样式
└─ registry.json     # shadcn registry 定义
```
工具：pnpm workspace + Turborepo。

### 4. 分发方式（二选一或并存）
- **Registry（推荐 v1）**：文档站部署后，使用方配置 `components.json` 里的 registry 地址，`npx shadcn add @jasmine/button` 安装。保持 shadcn 的"源码可改"特性。
- **npm 包**：把 `packages/ui` 打包发布，用户直接 import。风格更不容易被改乱，但失去可改性。可以在 v2 再考虑。

### 5. 文档与预览
- 文档站可以直接基于 shadcn 官方文档站模板或 Fumadocs（Next.js），每个组件页有预览、代码、变体、props。
- 或用 Storybook 做组件开发和视觉回归（配 Chromatic / Playwright 截图对比）。
- 加一个"主题预览页"，把所有组件在亮/暗模式下平铺，改 token 时一眼看出影响。

### 6. 跟进上游
- 在仓库里记录每个组件基于的 shadcn 版本
- 定期用 `npx shadcn diff`（或手动对比）检查上游变化，按需合并
- 改动尽量集中在 token 和变体上，结构改动越少，合并越轻松

## 五、通往"完整组件库"的分阶段路线

目标是一套完整的组件库，但建议分阶段推进，每一阶段都可用、可发布：

### v1：风格基座（先把"长什么样"定下来）
1. Token 体系 + 亮/暗主题
2. 基础组件 15～20 个：Button、Input、Textarea、Select、Checkbox、Radio、Switch、Label、Card、Badge、Dialog、Popover、Tooltip、Dropdown Menu、Tabs、Toast(Sonner)、Avatar、Separator、Skeleton
3. 文档站 + 主题预览页
4. Registry 可安装

### v2：补齐 shadcn 全量 + 表单体系
1. 其余 shadcn 组件：Sheet、Drawer、Accordion、Collapsible、Command、Context Menu、Menubar、Navigation Menu、Hover Card、Alert、Alert Dialog、Progress、Slider、Toggle、Toggle Group、Breadcrumb、Pagination、Scroll Area、Aspect Ratio、Calendar、Date Picker、Combobox、Input OTP、Resizable、Carousel、Sidebar
2. 表单方案：Form（react-hook-form + zod）统一校验、错误提示、布局
3. 图标规范（Lucide 为主，统一尺寸和描边）

### v3：复杂组件与业务层（shadcn 没有的部分）
1. 数据表格：基于 TanStack Table，封装排序、筛选、分页、列设置、行选择
2. 上传、树、级联选择、穿梭框、步骤条、时间线、统计数值、空状态、结果页
3. 布局与模板：页面骨架、列表页/详情页/表单页模板（Blocks）
4. 图表主题：给 Recharts 或 ECharts 配一套与 token 一致的配色

### 贯穿各阶段
- 每个组件：预览 + Props 文档 + 单测（Vitest + Testing Library）+ 视觉回归截图
- 版本管理：Changesets 自动生成 changelog
- 上游跟进：记录每个组件对应的 shadcn 版本，定期 diff
