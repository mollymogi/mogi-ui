# 工作台动效与翻转卡片验证

参考来源：用户 Obsidian《Flip Card - Inspira UI》《AI 前端设计 / 动效 / 3D Skills 合集》，并读取 Inspira UI 官方 Flip Card 文档。只参考交互原理，组件为 React 自有实现，没有引入额外运行依赖。

## 新增范围

- 项目 hover 轻抬、图标轻转、箭头位移；任务行、导航和筛选按钮按压反馈。
- 页面和列表进入动画、统计和进度条过渡、完成勾选和短暂状态提示。
- FlipCard 正反面：今日重点 / 同步到详情的行动清单。两面按较高内容保持稳定高度，隐藏面 inert + aria-hidden，按钮留在卡片外。
- 组件展览、registry、自有组件来源记录与使用规范同步更新。

## 结果

- UI/docs TypeScript 检查通过。
- Vite 生产构建通过；原组件总包仍有 >500KB 提醒。
- token 对比度：129 项、0 失败，未更改主题 token。
- 新增浏览器检查：19 项通过，无运行异常，原始结果 workspace-motion-browser.json。
- 原有工作台浏览器回归：25 项通过，原始结果 workspace-browser.json。
- 覆盖：键盘翻面、焦点保留、隐藏面不可交互、清单联动、真实状态变化后的提示及自动清理、精确指针 hover、减弱动态效果下静态切换、320/390/768/1440px 亮暗主题高度稳定和无整页溢出、组件展览示例。
- 动效预览 workspace-motion.gif 录自本地浏览器，不是生成的界面动画。

registry 通过 `pnpm_config_verify_deps_before_run=false node scripts/build-registry.mjs` 构建，避免当前运行环境的 pnpm 自动重新安装。没有修改锁文件、构建信任配置或依赖版本。

此结果只证明本地演示与组件行为，不代表已合并或在线上发布。
