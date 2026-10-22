# 看板接入反馈：表单关联与展示原语（#33）

独立预览：`?preview=console-feedback`；原组件展览也包含本组示例。示例表单只做本地验证，不向任何服务提交口令；所有组件、图标与字体沿用本地打包方案，无新增 CDN 或运行依赖。

## 1. FormControl / FormLabel 的稳定 ID

通过实际组件验证，Radix Slot 的子元素 ID 可以优先于自动 ID，而此前 FormLabel 仍指向自动 ID，最终造成关联不一致。现在 FormItem 在渲染时统一确定 control ID，FormControl 和 FormLabel 共用；无需等 effect 或 DOM 注册，SSR 也能生成匹配的关联。

优先级为 `FormItem.itemId` → `FormControl.id` → 直接可见子控件的 `id` → 自动生成 ID。显式 itemId 与控件 ID 冲突时，以 itemId 为准。FormItem 原来的 `id` 仍是外层 div 的 ID，不会被重新解释成输入框 ID。

```tsx
<FormItem itemId="login-password">
  <FormLabel>口令</FormLabel>
  <FormControl><PasswordInput {...field} autoComplete="current-password" /></FormControl>
  <FormDescription>仅供当前登录使用。</FormDescription>
  <FormMessage />
</FormItem>
```

常见的 `<FormControl><Input id="login-username" /></FormControl>` 会自动保留并配对显式 ID。每个 FormItem 应包含一个 FormControl。控件包在不透明自定义组件、memo 包装或 render prop 后面时，不能通过静态 children 确认内部 ID，请在 FormItem 传 itemId，不依赖扫描任意组件内部实现。显式 FormLabel.htmlFor 仍受调用方控制，应与最终 ID 一致。描述与错误信息保留独立、唯一的 ID。

## 2. MetricCard

```tsx
<MetricCard label="候选数量" value={12} unit="项" hint="最近一次报告" icon={Database} tone="default" />
```

label/value 必填，unit/hint/icon 可选；tone 为 default/success/warning/destructive。使用 dl/dt/dd 表达标签和值，value 用 font-mono 和 tabular-nums。组件不计算状态、不生成数值，也不将占位数据解释成通过；可直接组合进 DetailLayout.metrics，列数仍由 metricColumns 决定。四种 tone 只控制语义前景，状态还应由 label/value/hint 的文字解释。

## 3. StatusBadge 与历史值

```tsx
const states = {
  fresh: { label: "在线", variant: "success", icon: CheckCircle2 },
  stale: { label: "上次报告 · 就绪", variant: "historical", icon: Clock3 },
} satisfies StatusMap<"fresh" | "stale">
<StatusBadge value={state} map={states} unknownLabel="未识别" />
```

映射由使用方定义；StatusEntry 支持 label、variant、icon。null/undefined/未映射值使用 secondary 变体、未知图标和 unknownLabel。映射没有 icon 时使用问号图标，避免只剩颜色。只有 map 的自有属性参与查找，原型名称不会误当状态。historical 也可直接用于 Badge：去饱和、虚线边框，不再沿用 success 的乐观强调。组件不根据“过期”自行推断业务状态，文案中的“上次报告”仍由调用方明确表达。

## 4. TableCellTruncate / 表格密度

```tsx
<Table density="compact">
  <TableBody><TableRow>
    <TableCellTruncate value={sha256} maxChars={24} mono copyable />
  </TableRow></TableBody>
</Table>
```

value 支持 string/number，maxChars 默认 32，以 ch 作为视觉最大宽度（不切割原字符串，非等宽文字不保证精确字符数）。完整文本始终在 DOM 和 title 中，读屏、选择和复制都可取得全文。copyable 默认 false；开启后显示“复制完整内容”按钮，写入原始 value。失败时显示错误图标，并在单元格内显示可换行的“复制失败，请选择完整内容复制”，同时保留 role=status 读屏通知；可再次点击重试，成功/错误状态在 2.5 秒后复位。复制按钮为 type=button，不触发表单提交，并阻止点击向外冒泡。

Table.density 默认为 default，compact 收紧本表直接行的单元格纵向 padding 和表头高度，不修改嵌套表。其他 Table API 保持兼容。

## 5. DescriptionItem 值变体

valueVariant 默认为 default：原来的正文换行。mono 使用等宽字体并允许连续摘要任意位置换行；truncate 使用视觉省略，保留完整 children，字符串/数字提供完整 title。可用 valueClassName 组合 `font-mono` 与 truncate。

```tsx
<DescriptionItem term="SHA256" valueVariant="mono">{sha256}</DescriptionItem>
<DescriptionItem term="摘要" valueVariant="truncate" valueClassName="font-mono">{digest}</DescriptionItem>
```

## 6. PasswordInput

保留 Input 的 name/id/ref/value/defaultValue/onChange/autoComplete/disabled/aria 等属性，显示和隐藏只切换 type，不重置值。显隐按钮为 type=button，默认 aria-label 为“显示口令”/“隐藏口令”，aria-pressed 表示当前是否可见，aria-controls 指向实际输入框。鼠标操作保留输入焦点，键盘可聚焦按钮并用 Space/Enter 操作。showLabel/hideLabel 可自定义；className 作用于输入框，containerClassName 作用于外层定位容器。

## 7. 严格类型与 hooks 安装目录

code-highlighter 使用有类型的 currentLine 引用维护逐行 token，避免对数组最后一项做不安全索引；语言别名也提供回退。整个 UI 包启用 noUncheckedIndexedAccess 并由 CI 类型检查覆盖。

use-mobile 保留 shadcn 的 registry:hook 约定，不自动迁移使用方目录，也不把 hook 伪装为 UI 组件。目录由使用方 components.json 的 aliases.hooks 指定，例如 `"hooks": "@/lib"`；registry 安装时会按别名改写导入。已有 hooks 无需移动，也不会改动使用方的 components.json。
