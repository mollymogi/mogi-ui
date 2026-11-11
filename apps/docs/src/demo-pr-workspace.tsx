import { useEffect, useRef, useState } from "react"
import { Activity, Archive, ArrowUpRight, Check, Clock3, FolderGit2, GitMerge, GitPullRequest, Layers3, Moon, Search, ShieldCheck, Sparkles, Sun, Wrench } from "lucide-react"
import { Badge } from "@mogi-ui/ui/components/badge"
import { Button } from "@mogi-ui/ui/components/button"
import { Card } from "@mogi-ui/ui/components/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@mogi-ui/ui/components/collapsible"
import { Input } from "@mogi-ui/ui/components/input"
import { MetricCard } from "@mogi-ui/ui/components/metric-card"
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@mogi-ui/ui/components/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@mogi-ui/ui/components/tabs"
import "./pr-workspace.css"

type Stage = "queued" | "review" | "fix" | "merge" | "closed"
type PullRequest = { project: string; number: number; title: string; stage: Stage; reason?: string }
const stages = [
  { key: "queued", label: "待处理", icon: Clock3 },
  { key: "review", label: "评审验证", icon: ShieldCheck },
  { key: "fix", label: "修复中", icon: Wrench },
  { key: "merge", label: "等待合并", icon: GitMerge },
] as const
const labels = { queued: "排队中", review: "评审中", fix: "修复中", merge: "等待合并", closed: "已归档" }
// Synthetic UI data only. Never fetch local PR state or invoke real review/merge actions.
const examples: PullRequest[] = [
  { project: "mogi-ui", number: 24, title: "同步纸感主题与紧凑工作台布局", stage: "review" },
  { project: "mogi-ui", number: 23, title: "补齐窄屏项目筛选与键盘焦点", stage: "queued" },
  { project: "atlas", number: 18, title: "恢复云端验证与独立评审", stage: "fix", reason: "Linux 验证发现日期边界错误，修复会话正在处理。" },
  { project: "atlas", number: 17, title: "完成只读工具的结果验证", stage: "merge" },
  ...["mogi-ui", "atlas", "field-kit", "workbench"].flatMap((project, i) => [
    { project, number: 10 + i, title: "完善安装说明与验证记录", stage: "closed" as const },
    { project, number: 6 + i, title: "修复项目状态同步与错误说明", stage: "closed" as const },
    { project, number: 2 + i, title: "补充组件测试与无障碍支持", stage: "closed" as const },
  ]),
]
function State({ item }: { item: PullRequest }) {
  const Icon = item.stage === "closed" ? Archive : stages.find(s => s.key === item.stage)!.icon
  return <Badge variant={item.stage === "closed" ? "historical" : item.stage === "fix" ? "highlight" : item.stage === "merge" ? "success" : "soft"}><Icon aria-hidden="true" />{labels[item.stage]}</Badge>
}
function Project({ project, items, openDetail }: { project: string; items: PullRequest[]; openDetail: (item: PullRequest, trigger: HTMLButtonElement) => void }) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? items : items.slice(0, 2)
  return <Collapsible className="pr-project" defaultOpen>
    <CollapsibleTrigger className="pr-project-heading"><span className="pr-project-mark"><FolderGit2 aria-hidden="true" /></span><strong>{project}</strong><span>{items.length} 个 PR</span></CollapsibleTrigger>
    <CollapsibleContent><div className="pr-branches">{visible.map(item => <div className="pr-task" key={item.number}>
      <div><span className="pr-number">#{item.number}</span>{item.stage === "closed" && <span className="pr-merged"><Check size={12} aria-hidden="true" />已合并</span>}
        <button className="pr-title" onClick={e => openDetail(item, e.currentTarget)}>{item.title}</button>
        {item.reason && <p className="pr-reason">{item.reason}</p>}
      </div><div className="pr-task-state"><State item={item} /><span>示例记录</span></div>
      <Button variant="ghost" size="icon-sm" aria-label={`查看 ${project} #${item.number} 详情`} onClick={e => openDetail(item, e.currentTarget)}><ArrowUpRight /></Button>
    </div>)}</div>{items.length > 2 && <div className="pr-group-more"><Button variant="ghost" size="sm" onClick={() => setExpanded(v => !v)}>{expanded ? "收起更多记录" : `再显示 ${items.length - 2} 条`}</Button></div>}</CollapsibleContent>
  </Collapsible>
}
export function PrWorkspaceDemo({ dark, onThemeChange }: { dark: boolean; onThemeChange: () => void }) {
  const [query, setQuery] = useState("")
  const [project, setProject] = useState("all")
  const [view, setView] = useState("active")
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<PullRequest | null>(null)
  const trigger = useRef<HTMLButtonElement | null>(null)
  const projects = [...new Set(examples.map(p => p.project))]
  const filtered = examples.filter(p => (view === "closed" ? p.stage === "closed" : p.stage !== "closed") && (project === "all" || p.project === project) && `${p.project} #${p.number} ${p.title}`.toLowerCase().includes(query.trim().toLowerCase()))
  const groups = [...new Set(filtered.map(p => p.project))]
  const pages = Math.max(1, Math.ceil(groups.length / 2))
  const current = Math.min(page, pages - 1)
  useEffect(() => setPage(0), [view, project, query])
  const openDetail = (item: PullRequest, button: HTMLButtonElement) => { trigger.current = button; setSelected(item) }
  return <div className="pr-demo">
    <a className="pr-skip" href="#pr-board">跳到看板</a>
    <header className="pr-app-header"><a href="?preview=components" className="pr-brand"><span><Layers3 aria-hidden="true" /></span>mogi <i>/</i><small>PR 工作台</small></a><div><Badge variant="success">交互示例</Badge><Button size="icon-sm" variant="ghost" aria-label={dark ? "切换亮色" : "切换暗色"} onClick={onThemeChange}>{dark ? <Sun /> : <Moon />}</Button></div></header>
    <main className="pr-workspace"><div className="pr-page-heading"><div><p className="pr-eyebrow"><GitPullRequest size={14} /> MOGI WORKSPACE</p><h1>PR 看板<span> .</span></h1><p>评审、修复、合并，每一步都有着落。</p><Button asChild size="sm" className="mt-4"><a href="#pr-board">查看看板<ArrowUpRight /></a></Button></div><aside data-slot="paper-note"><Sparkles aria-hidden="true" /><div><strong>让工作有序交接</strong><p>一眼找到项目，按需展开细节。</p></div></aside></div>
      <div className="pr-overview"><MetricCard label="正在处理" value={2} unit="/ 3" hint="评审与修复中的 PR" icon={Activity} /><MetricCard label="等待交接" value={2} hint="排队、验证或等待合并" icon={Clock3} /><MetricCard label="已归档" value={12} hint="PR 已结束，会话已收好" icon={Archive} /></div>
      <details className="pr-inspection"><summary><ShieldCheck size={16} /><strong>本地巡检</strong><Badge variant="secondary">每 10 分钟</Badge><span>上次检查 14:20 · 发现 1 个问题</span></summary><p>atlas #18：日期边界错误已交给修复会话处理，完成后重新验证。此处为示例记录。</p></details>
      <section id="pr-board" aria-labelledby="pr-board-title"><div className="pr-toolbar"><div><h2 id="pr-board-title">看板</h2><span>{examples.length} 个示例 PR</span></div><div className="pr-filters"><label className="pr-search"><Search aria-hidden="true" /><Input aria-label="搜索 PR 或项目" placeholder="搜索 PR 或项目…" value={query} onChange={e => setQuery(e.target.value)} /></label><select aria-label="筛选项目" value={project} onChange={e => setProject(e.target.value)}><option value="all">全部项目</option>{projects.map(p => <option key={p}>{p}</option>)}</select></div></div>
        <div className="pr-workflow" aria-label="PR 阶段统计">{stages.map(({ key, label, icon: Icon }) => <div className={`pr-stage pr-stage-${key}`} key={key}><Icon aria-hidden="true" /><span>{label}</span><strong>{examples.filter(p => p.stage === key).length}</strong></div>)}</div>
        <Tabs value={view} onValueChange={setView}><TabsList variant="line" aria-label="PR 记录"><TabsTrigger value="active"><GitPullRequest />进行中 4</TabsTrigger><TabsTrigger value="closed"><Archive />已归档 12</TabsTrigger></TabsList>
          {["active", "closed"].map(tab => <TabsContent value={tab} key={tab}><Card className="pr-tree">{groups.slice(current * 2, current * 2 + 2).map(p => <Project key={`${tab}-${p}-${query}`} project={p} items={filtered.filter(item => item.project === p)} openDetail={openDetail} />)}{!groups.length && <p className="pr-empty" role="status">没有匹配的 PR，试试其他关键词或项目。</p>}</Card><nav className="pr-pagination" aria-label="项目分页"><span>{groups.length} 个项目 · {filtered.length} 个 PR · 每页最多 2 个项目</span><div><Button variant="outline" size="sm" disabled={current === 0} onClick={() => setPage(current - 1)}>上一页</Button><span aria-live="polite">{current + 1} / {pages}</span><Button variant="outline" size="sm" disabled={current + 1 >= pages} onClick={() => setPage(current + 1)}>下一页</Button></div></nav></TabsContent>)}
        </Tabs>
      </section><footer className="pr-footer"><span>示例数据 · 所有交互仅影响当前预览</span><a href="?preview=pr-workspace&theme=light">查看默认配色</a><a href="?preview=pr-workspace&theme=paper">查看纸感配色</a></footer>
    </main>
    <Sheet open={selected !== null} onOpenChange={open => { if (!open) setSelected(null) }}><SheetContent className="pr-demo-detail" onCloseAutoFocus={event => { event.preventDefault(); trigger.current?.focus() }}>
      <SheetHeader><p className="text-xs text-muted-foreground">PR #{selected?.number}</p><SheetTitle>{selected?.title}</SheetTitle><SheetDescription>{selected?.project} · 示例详情</SheetDescription>{selected && <State item={selected} />}</SheetHeader>
      <SheetBody><section><h3>两个会话，各司其职</h3>{["评审与验证", "修复"].map(role => <div className="pr-session" key={role}><strong>{role}</strong><Badge variant="historical">{selected?.stage === "closed" ? "已归档" : "独立会话"}</Badge><p>{role === "评审与验证" ? "检查当前提交，复验修改与测试结果。" : "根据评审发现修改，随后交回独立复验。"}</p></div>)}</section><section><h3>当前进度</h3><p>{selected?.reason || (selected?.stage === "closed" ? "验证与评审已通过，本条示例已归档。" : "按当前阶段继续交接，详情随状态更新。")}</p></section><p className="text-xs text-muted-foreground">这里展示布局与交互，不连接 GitHub 或本地服务。</p></SheetBody>
    </SheetContent></Sheet>
  </div>
}
