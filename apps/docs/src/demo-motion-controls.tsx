import { GlassSurface } from "@mogi-ui/ui/components/glass-surface"
import { useState } from "react"
import { Bell, Check, Settings2, SlidersHorizontal } from "lucide-react"
import { Badge } from "@mogi-ui/ui/components/badge"
import { Button } from "@mogi-ui/ui/components/button"
import { Checkbox } from "@mogi-ui/ui/components/checkbox"
import { Switch } from "@mogi-ui/ui/components/switch"
import { Input } from "@mogi-ui/ui/components/input"
import { Label } from "@mogi-ui/ui/components/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@mogi-ui/ui/components/collapsible"
import { CopyButton } from "@mogi-ui/ui/components/copy-button"
import { CodeBlock } from "@mogi-ui/ui/components/code-block"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@mogi-ui/ui/components/dialog"
import { Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverTitle, PopoverDescription } from "@mogi-ui/ui/components/popover"

const preferences = [
  { id: "task", title: "任务更新", detail: "完成、失败与待确认事项" },
  { id: "review", title: "评审提醒", detail: "需要你参与的协作" },
  { id: "digest", title: "每日摘要", detail: "把一天的进展汇总成一条" },
]
const config = '{\n  "motion": "gentle",\n  "notifications": true,\n  "theme": "mogi"\n}'

export function MotionControlsDemo({ animated, glass = true }: { animated: boolean; glass?: boolean }) {
  const [selected, setSelected] = useState(["task", "review"])
  const [enabled, setEnabled] = useState(true)
  const [compact, setCompact] = useState(false)
  const [name, setName] = useState("Mogi workspace")
  return <section className="mt-10" aria-labelledby="controls-heading">
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="mb-2 text-xs font-semibold tracking-[.18em] text-link">MORE LITTLE DETAILS / 04—08</p><h2 id="controls-heading" className="text-xl font-semibold">把日常操作，也打磨一下。</h2></div><span className="text-xs text-muted-foreground">勾选 · 开关 · 折叠 · 复制 · 弹层</span></div>
    <div className="grid items-start gap-6 lg:grid-cols-2">
      <GlassSurface enabled={glass} asChild><section className="min-w-0 rounded-2xl border bg-card p-5 sm:p-7" aria-labelledby="notification-heading">
        <div className="mb-6 flex items-center justify-between gap-4"><div className="flex items-center gap-2"><Bell className="size-4 text-link" /><h3 id="notification-heading" className="font-semibold">通知偏好</h3></div><Switch checked={enabled} onCheckedChange={setEnabled} animated={animated} aria-label="启用通知" /></div>
        <div className="mb-3 flex items-center justify-between gap-3 rounded-lg bg-muted/50 p-3"><label className="flex items-center gap-3 text-sm font-medium"><Checkbox animated={animated} disabled={!enabled} checked={selected.length === 3 ? true : selected.length ? "indeterminate" : false} onCheckedChange={checked => setSelected(checked ? preferences.map(item => item.id) : [])} aria-label="全选通知类型" />全选通知类型</label><span className="font-mono text-xs text-muted-foreground">{selected.length}/3</span></div>
        <div className="grid gap-1">{preferences.map(item => <label key={item.id} className="flex cursor-pointer items-start gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-muted/50"><Checkbox animated={animated} className="mt-0.5" disabled={!enabled} checked={selected.includes(item.id)} onCheckedChange={checked => setSelected(value => checked ? [...value, item.id] : value.filter(id => id !== item.id))} aria-label={item.title} /><span><span className="block text-sm font-medium">{item.title}</span><span className="mt-1 block text-xs text-muted-foreground">{item.detail}</span></span></label>)}</div>
        <p role="status" className="mt-4 border-t pt-4 text-xs text-muted-foreground">{enabled ? `通知已开启 · 已选择 ${selected.length} 类提醒` : "通知已暂停，所选类型已保留"}</p>
      </section></GlassSurface>
      <div className="grid min-w-0 gap-6">
        <GlassSurface enabled={glass} asChild><section className="min-w-0 rounded-2xl border bg-card p-5 sm:p-7"><Collapsible animated={animated} defaultOpen><CollapsibleTrigger className="py-1"><span className="flex items-center gap-2"><Settings2 className="size-4 text-link" />工作空间详情</span></CollapsibleTrigger><CollapsibleContent><div className="grid gap-4 pt-5"><p className="text-sm leading-6 text-muted-foreground">内容顺着高度展开。收起再打开，输入的内容也会保留。</p><div className="grid gap-2"><Label htmlFor="collapse-workspace">空间名称</Label><Input id="collapse-workspace" defaultValue="Mogi workspace" /></div><CodeBlock className={glass ? "dark:bg-transparent" : undefined} label="preferences.json" language="json" actions={<CopyButton value={config} label="复制配置" animated={animated} />}>{config}</CodeBlock></div></CollapsibleContent></Collapsible></section></GlassSurface>
        <GlassSurface enabled={glass} asChild><section className="min-w-0 rounded-2xl border bg-card p-5 sm:p-7"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h3 className="font-semibold">在当前位置，轻量操作</h3><Popover><PopoverTrigger asChild><Button variant="outline" size="sm"><SlidersHorizontal className="size-4" />显示设置</Button></PopoverTrigger><GlassSurface enabled={glass} asChild><PopoverContent animated={animated} align="end" collisionPadding={16}><PopoverHeader><PopoverTitle>显示设置</PopoverTitle><PopoverDescription>调整下方记录的显示密度</PopoverDescription></PopoverHeader><label className="mt-5 flex items-center justify-between gap-4 text-sm">紧凑展示<Switch checked={compact} onCheckedChange={setCompact} animated={animated} aria-label="紧凑展示" /></label></PopoverContent></GlassSurface></Popover></div>
          <div data-testid="compact-records" className={compact ? "grid gap-1" : "grid gap-3"}>{["交互组件已就绪", "偏好设置已保留"].map(text => <div key={text} className={`flex items-center gap-3 rounded-lg bg-muted/50 px-3 ${compact ? "py-2" : "py-4"}`}><Check className="size-4 shrink-0 text-success" /><span className="text-sm">{text}</span></div>)}</div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-muted-foreground">当前空间：{name}</span><Dialog><DialogTrigger asChild><Button size="sm" variant="outline">编辑偏好</Button></DialogTrigger><GlassSurface enabled={glass} asChild><DialogContent animated={animated}><DialogHeader><DialogTitle>编辑工作空间</DialogTitle><DialogDescription>本地预览，修改不会提交到任何服务。</DialogDescription></DialogHeader><div className="grid gap-2 py-3"><Label htmlFor="dialog-workspace">显示名称</Label><Input id="dialog-workspace" value={name} onChange={event => setName(event.target.value)} maxLength={40} /></div><div className="flex flex-wrap gap-2"><Badge variant="soft">本地示例</Badge><Badge variant="success">自动保留到本次预览</Badge></div><DialogFooter><DialogClose asChild><Button>完成</Button></DialogClose></DialogFooter></DialogContent></GlassSurface></Dialog></div>
        </section></GlassSurface>
      </div>
    </div>
  </section>
}
