import { AmbientBackground } from "@mogi-ui/ui/components/ambient-background"
import { GlassSurface } from "@mogi-ui/ui/components/glass-surface"
import { MotionControlsDemo } from "./demo-motion-controls"
import { useState } from "react"
import { ArrowDownRight, ArrowUpRight, Check, Copy, FolderOpen, Layers3, Moon, RefreshCw, Save, Sparkles, Sun, TrendingUp } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@mogi-ui/ui/components/tabs"
import { MetricCard } from "@mogi-ui/ui/components/metric-card"
import { FeedbackButton } from "@mogi-ui/ui/components/feedback-button"
import { Button } from "@mogi-ui/ui/components/button"
import { Badge } from "@mogi-ui/ui/components/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@mogi-ui/ui/components/select"
import { Switch } from "@mogi-ui/ui/components/switch"

const snapshots = [
  { tasks: 128, done: 96, reviews: 24, errors: 8 },
  { tasks: 136, done: 107, reviews: 23, errors: 6 },
  { tasks: 149, done: 121, reviews: 24, errors: 4 },
  { tasks: 158, done: 134, reviews: 22, errors: 2 },
]
const projects = [
  { name: "Mogi UI", note: "组件打磨与交互实验", progress: 78, status: "进行中" },
  { name: "Workspace", note: "工作台与详情页布局", progress: 64, status: "进行中" },
  { name: "Design tokens", note: "主题与可访问性规范", progress: 100, status: "已完成" },
]

export function MotionTrioDemo({ dark, palette, onPaletteChange, onThemeChange }: { dark: boolean; palette: "warm" | "monochrome" | "paper"; onPaletteChange: (value: "warm" | "monochrome" | "paper" | "dark") => void; onThemeChange: () => void }) {
  const [ambient, setAmbient] = useState(true)
  const [glass, setGlass] = useState(true)
  const [step, setStep] = useState(0)
  const [animated, setAnimated] = useState(true)
  const [fail, setFail] = useState(false)
  const [saved, setSaved] = useState(0)
  const snapshot = snapshots[step % snapshots.length]!
  const copyValue = "Mogi UI · 小幅运动，清晰反馈。"
  return <AmbientBackground enabled={ambient}><div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12" data-testid="motion-trio">
    <header className="flex flex-wrap items-center justify-between gap-5 border-b pb-7">
      <a href="?preview=components" className="flex items-center gap-3 font-semibold"><span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="size-5" /></span><span>Mogi UI <span className="ml-2 font-normal text-muted-foreground">/ Motion lab</span></span></a>
      <div className="flex flex-wrap items-center gap-4"><Select value={dark ? "dark" : palette} onValueChange={value => { if (value === "warm" || value === "monochrome" || value === "paper" || value === "dark") onPaletteChange(value) }}><SelectTrigger className="w-36" aria-label="配色主题"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="warm">暖色浅色</SelectItem><SelectItem value="monochrome">黑白浅色</SelectItem><SelectItem value="paper">奶油纸感</SelectItem><SelectItem value="dark">深色玻璃</SelectItem></SelectContent></Select><label className="flex items-center gap-2 text-sm text-muted-foreground"><Switch checked={ambient} onCheckedChange={setAmbient} animated={animated} aria-label="渐变背景" />渐变</label><label className="flex items-center gap-2 text-sm text-muted-foreground"><Switch checked={glass} onCheckedChange={setGlass} animated={animated} disabled={!dark} aria-label="深色毛玻璃" />毛玻璃</label><label className="flex items-center gap-2 text-sm text-muted-foreground"><Switch checked={animated} onCheckedChange={setAnimated} animated={animated} aria-label="启用动效" />启用动效</label><Button variant="outline" size="icon" onClick={onThemeChange} aria-label={dark ? "切换亮色" : "切换暗色"}>{dark ? <Sun /> : <Moon />}</Button></div>
    </header>
    <div className="mt-10 mb-9 flex flex-wrap items-end justify-between gap-6"><div className="max-w-2xl"><p className="mb-3 text-xs font-semibold tracking-[.18em] text-link">INTERACTION STUDIES / 01—03</p><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{palette === "paper" && !dark ? "让工作，轻一点。" : "让变化，有迹可循。"}</h1><p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">在熟悉的界面里，加一点恰到好处的运动。切换视图、更新数字，再完成一次操作，感受每一步的回应。</p></div>{palette === "paper" && !dark && <aside data-slot="paper-note" aria-label="纸感主题提示" className="w-48 rounded-sm px-4 py-3 text-sm leading-6"><span className="block text-xs font-semibold text-highlight">一点纸张的温度</span><p className="mt-1">轻轻按下，<br />每一步都有回应。</p></aside>}</div>
    <GlassSurface enabled={glass} asChild><section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-5 border-b px-5 py-5 sm:px-7"><div><div className="flex items-center gap-2"><span className="size-2 rounded-full bg-success" /><h2 className="font-semibold">工作空间</h2><Badge variant="soft">示例数据</Badge></div><p className="mt-1 text-xs text-muted-foreground">一处试用滑动切换与动态指标</p></div><Button variant="outline" onClick={() => setStep(value => value + 1)}><RefreshCw className="size-4" />更新数据</Button></div>
      <Tabs defaultValue="overview" className="gap-0">
        <div className="overflow-x-auto px-5 pt-5 sm:px-7"><TabsList animated={animated} aria-label="工作空间视图"><TabsTrigger value="overview">总览</TabsTrigger><TabsTrigger value="projects">项目进展</TabsTrigger><TabsTrigger value="activity">最近活动</TabsTrigger></TabsList></div>
        <div className="p-5 sm:p-7">
          <TabsContent value="overview" className="space-y-6">
            <div className="flex items-end justify-between gap-3"><div><h3 className="text-lg font-semibold">今天的工作，一目了然。</h3><p className="mt-1 text-xs text-muted-foreground">点击「更新数据」查看数字变化</p></div><span className="shrink-0 font-mono text-xs text-muted-foreground">快照 {step + 1}</span></div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><MetricCard className={glass ? "dark:bg-transparent dark:shadow-none" : undefined} label="任务总数" value={snapshot.tasks} animated={animated} unit="项" icon={Layers3} hint="当前工作空间" /><MetricCard className={glass ? "dark:bg-transparent dark:shadow-none" : undefined} label="已完成" value={snapshot.done} animated={animated} unit="项" tone="success" icon={Check} hint={<span className="flex items-center gap-1"><ArrowUpRight className="size-3" />持续推进中</span>} /><MetricCard className={glass ? "dark:bg-transparent dark:shadow-none" : undefined} label="待核对" value={snapshot.reviews} animated={animated} unit="项" tone="warning" icon={FolderOpen} hint="等待人工核对" /><MetricCard className={glass ? "dark:bg-transparent dark:shadow-none" : undefined} label="需关注" value={snapshot.errors} animated={animated} unit="项" tone="destructive" icon={TrendingUp} hint={<span className="flex items-center gap-1"><ArrowDownRight className="size-3" />查看任务详情</span>} /></div>
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/50 px-4 py-3 text-xs text-muted-foreground"><span>数字按位更新，标签和单位保持稳定。</span><span>只演示本地快照</span></div>
          </TabsContent>
          <TabsContent value="projects" className="space-y-4"><h3 className="text-lg font-semibold">项目进展</h3>{projects.map(project => <div key={project.name} className="grid gap-3 rounded-xl border p-4"><div className="flex items-center justify-between gap-3"><div><p className="text-sm font-medium">{project.name}</p><p className="mt-1 text-xs text-muted-foreground">{project.note}</p></div><Badge variant={project.progress === 100 ? "success" : "soft"}>{project.status}</Badge></div><div className="flex items-center gap-3"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${project.progress}%` }} /></div><span className="font-mono text-xs">{project.progress}%</span></div></div>)}</TabsContent>
          <TabsContent value="activity" className="space-y-5"><h3 className="text-lg font-semibold">最近活动</h3>{["更新了工作台指标", "完成组件可访问性检查", "提交了新的设计方案"].map((text, i) => <div key={text} className="flex items-center gap-4 rounded-xl border p-5"><span className="grid size-9 place-items-center rounded-full bg-muted"><Check className="size-4 text-success" /></span><div><p className="text-sm font-medium">{text}</p><p className="mt-1 text-xs text-muted-foreground">示例记录 · {i + 1} 小时前</p></div></div>)}</TabsContent>
        </div>
      </Tabs>
    </section></GlassSurface>
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <GlassSurface enabled={glass} asChild><section className="min-w-0 rounded-2xl border bg-card p-5 sm:p-7"><div className="mb-6 flex items-center gap-3"><span className="font-mono text-xs text-link">01</span><h2 className="font-semibold">沿着选择移动</h2></div><Tabs defaultValue="week"><TabsList variant="line" animated={animated} aria-label="时间范围"><TabsTrigger value="week">本周</TabsTrigger><TabsTrigger value="month">这个月</TabsTrigger><TabsTrigger value="quarter">过去一个季度</TabsTrigger></TabsList>{[["week", "聚焦当下的一周。"], ["month", "看看这个月的积累。"], ["quarter", "把视野拉长一些。"]].map(([value, text]) => <TabsContent key={value} value={value!} className="pt-6"><p className="text-lg font-medium">{text}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">底板与下划线共享同一种节奏。试试连续点击，或用方向键移动选择。</p></TabsContent>)}</Tabs></section></GlassSurface>
      <GlassSurface enabled={glass} asChild><section className="min-w-0 rounded-2xl border bg-card p-5 sm:p-7"><div className="mb-6 flex items-center gap-3"><span className="font-mono text-xs text-link">02 / 03</span><h2 className="font-semibold">操作之后，及时回应</h2></div><div className="flex flex-wrap items-center gap-3"><FeedbackButton animated={animated} icon={Save} pendingLabel="保存中" successLabel="已保存" errorLabel="保存失败，重试" onAction={async () => { await new Promise(resolve => setTimeout(resolve, 900)); if (fail) throw new Error("Demo failure"); setSaved(value => value + 1) }}>保存配置</FeedbackButton><FeedbackButton animated={animated} variant="outline" icon={Copy} pendingLabel="复制中" successLabel="已复制" errorLabel="复制失败，重试" onAction={() => navigator.clipboard.writeText(copyValue)}>复制摘要</FeedbackButton></div><p className="mt-4 rounded-lg bg-muted/50 px-3 py-2 font-mono text-xs leading-6 text-muted-foreground">{copyValue}</p><div className="mt-5 flex flex-wrap items-center justify-between gap-3"><label className="flex items-center gap-2 text-xs text-muted-foreground"><input type="checkbox" checked={fail} onChange={event => setFail(event.target.checked)} className="accent-primary" />模拟保存失败</label><span role="status" className="text-xs text-muted-foreground">{saved ? `本地保存 ${saved} 次` : "保存为本地交互演示"}</span></div></section></GlassSurface>
    </div>
    <MotionControlsDemo animated={animated} glass={glass} />
    <footer className="mt-7 flex flex-wrap justify-between gap-3 text-xs leading-6 text-muted-foreground"><span>短暂、轻柔、可中断。让注意力留在内容上。</span><span>自动遵循系统的减少动态效果设置</span></footer>
  </div></AmbientBackground>
}
