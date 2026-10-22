import { useState } from "react"
import { useForm } from "react-hook-form"
import { CheckCircle2, Clock3, Database, ShieldCheck, XCircle } from "lucide-react"
import { Button } from "@mogi-ui/ui/components/button"
import { Input } from "@mogi-ui/ui/components/input"
import { PasswordInput } from "@mogi-ui/ui/components/password-input"
import { MetricCard } from "@mogi-ui/ui/components/metric-card"
import { StatusBadge, type StatusMap } from "@mogi-ui/ui/components/status-badge"
import { TableCellTruncate } from "@mogi-ui/ui/components/table-cell-truncate"
import { Table, TableHeader, TableBody, TableHead, TableRow } from "@mogi-ui/ui/components/table"
import { DescriptionList, DescriptionItem } from "@mogi-ui/ui/components/description-list"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@mogi-ui/ui/components/form"

const statusMap = {
  fresh: { variant: "success", icon: CheckCircle2, label: "在线" },
  stale: { variant: "historical", icon: Clock3, label: "上次报告 · 就绪" },
  failed: { variant: "destructive", icon: XCircle, label: "失败" },
} satisfies StatusMap<"fresh" | "stale" | "failed">
const digest = "0123456789abcdef".repeat(4)

export function ConsoleFeedbackDemo({ dark, onThemeChange }: { dark: boolean; onThemeChange: () => void }) {
  const form = useForm({ defaultValues: { username: "", password: "", generated: "" } })
  const [submitted, setSubmitted] = useState(false)
  const [density, setDensity] = useState<"default" | "compact">("compact")
  return <div className="grid min-w-0 grid-cols-1 gap-8" data-testid="console-feedback">
    <header className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-2xl font-bold">看板组件接入示例</h1><p className="text-sm text-muted-foreground">示例数据 · 表单不会提交到任何服务</p></div><Button type="button" variant="outline" onClick={onThemeChange}>{dark ? "亮色" : "暗色"}</Button></header>
    <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard label="候选数量" value={12} unit="项" hint="来自当前示例" icon={Database} />
      <MetricCard label="执行结果" value="完成" hint="同时用文字表达状态" tone="success" icon={CheckCircle2} />
      <MetricCard label="需要关注" value={2} unit="项" hint="等待人工核对" tone="warning" icon={ShieldCheck} />
      <MetricCard label="异常数量" value={1} unit="项" hint="请查看失败原因" tone="destructive" icon={XCircle} />
    </div>
    <section className="grid min-w-0 gap-4"><h2 className="text-lg font-semibold">枚举状态与历史值</h2><div className="flex flex-wrap gap-3">{["fresh", "stale", "failed", "unexpected", null, "constructor"].map((value, i) => <StatusBadge key={i} value={value} map={statusMap} />)}</div></section>
    <section className="grid min-w-0 grid-cols-1 gap-4"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold">长摘要与表格密度</h2><Button type="button" size="sm" variant="outline" onClick={() => setDensity(value => value === "compact" ? "default" : "compact")}>{density === "compact" ? "切换默认密度" : "切换紧凑密度"}</Button></div><Table density={density}><TableHeader><TableRow><TableHead>发行</TableHead><TableHead>SHA256</TableHead><TableHead>说明</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCellTruncate value="release-01" maxChars={12} /><TableCellTruncate value={digest} maxChars={24} mono copyable /><TableCellTruncate value="这一段完整说明会保留在 DOM 中，视觉上截断，悬停可以查看完整内容。" maxChars={22} /></TableRow></TableBody></Table></section>
    <section className="grid min-w-0 gap-4"><h2 className="text-lg font-semibold">描述值变体</h2><DescriptionList compact><DescriptionItem term="版本">v1.0.0</DescriptionItem><DescriptionItem term="等宽摘要" valueVariant="mono">{digest}</DescriptionItem><DescriptionItem term="截断摘要" valueVariant="truncate" valueClassName="font-mono">{digest.repeat(2)}</DescriptionItem></DescriptionList></section>
    <section className="grid min-w-0 gap-4"><h2 className="text-lg font-semibold">稳定 ID 与口令输入</h2><Form {...form}><form className="grid max-w-lg gap-5" onSubmit={form.handleSubmit(() => setSubmitted(true))}>
      <FormField control={form.control} name="username" rules={{ required: "请输入用户名" }} render={({ field }) => <FormItem><FormLabel>用户名</FormLabel><FormControl><Input {...field} id="login-username" autoComplete="username" /></FormControl><FormDescription>直接保留子元素 ID，并与标签关联。</FormDescription><FormMessage /></FormItem>} />
      <FormField control={form.control} name="password" rules={{ required: "请输入口令" }} render={({ field }) => <FormItem itemId="login-password"><FormLabel>口令</FormLabel><FormControl><PasswordInput {...field} autoComplete="current-password" /></FormControl><FormDescription>FormItem.itemId 统一提供标签与控件 ID。</FormDescription><FormMessage /></FormItem>} />
      <FormField control={form.control} name="generated" render={({ field }) => <FormItem><FormLabel>自动生成 ID</FormLabel><FormControl><Input {...field} /></FormControl><FormDescription>未指定 ID 时仍保留自动关联。</FormDescription></FormItem>} />
      <PasswordInput aria-label="禁用口令" disabled defaultValue="disabled-demo" />
      <Button type="submit">验证示例表单</Button><p role="status" className="text-sm text-success">{submitted ? "验证成功（仅本地示例）" : ""}</p>
    </form></Form></section>
  </div>
}
