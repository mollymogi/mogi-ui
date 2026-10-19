# 详情看板：结论 → 指标 → 内容 → 追溯

适用于记忆、规则、运行、审核等详情页。来源场景是 Jasmine Core 的 Memory / Authority
对照：把全部内容折叠成一列后，用户仍找不到重点，必须逐项展开才能判断当前状态。

用 `DetailLayout` 组织信息层级，而不是把详情页当成纵向折叠树：

- `header`：页面名称和主要操作。
- `summary`：一句话结论；异常必须直接可见。
- `metrics`：2–4 个关键状态或数值，只展示有来源的数据。
- `children`：主内容，例如历史/当前对比、趋势或列表。
- `aside`：来源概况、次级操作；有辅助栏时宽屏采用主区 2/3、辅助栏 1/3。

布局使用 `lg` 断点，窄屏按 header → summary → metrics → 主内容 → 辅助栏的 DOM 顺序排列。
主区和辅助栏都设 min-width:0；长文字仍由内容组件换行或滚动，不能把整页撑宽。
不传 aside 时主内容占满，不留下空白列。`metricColumns` 是 2/3/4，默认3；
四指标在中等宽度排成两列，宽屏再排成四列。

```tsx
<DetailLayout
  header={<PageHeading />}
  summary={<Card>{/* 一句话状态 */}</Card>}
  metrics={<>{/* Card × 3 */}</>}
  aside={<SourceAndActions />}
>
  <Card>{/* 主要内容 */}</Card>
</DetailLayout>
```

这只是布局，不取数、不判断冲突、不生成状态，也不截断或隐藏错误。`header`、`summary`、
`metrics`、`aside` 均为 ReactNode；普通 div 属性（如 aria-labelledby、id）透传到根节点。
已有 Card/Badge/DescriptionList/CodeBlock 继续负责内容；不提供另一套重复组件。

技术元数据、完整来源和编辑表单放入 Sheet，正文用 SheetBody；同一抽屉的多个视图用 Tabs。
不要把所有卡片做成同样的大小和强调色：摘要最高、当前内容次之、历史与元数据更轻。
状态 Badge 配文字与图标，亮暗主题都检查。布局不修改任何颜色、字体或动画 token。

安装：`npx shadcn add https://mollymogi.github.io/mogi-ui/r/detail-layout.json`。
主分支发布前请从本 PR 的源码或本地 registry 预览，不把尚未发布的条目当线上已存在。
