import { useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, Circle, Clock3, Code2, ExternalLink, Flower2, LayoutDashboard, ListTodo, Moon, PawPrint, Search, Sun } from "lucide-react"
import { DashboardLayout } from "@mogi-ui/ui/components/dashboard-layout"
import { Button } from "@mogi-ui/ui/components/button"
import { Badge } from "@mogi-ui/ui/components/badge"
import { FlipCard } from "@mogi-ui/ui/components/flip-card"
import { Input } from "@mogi-ui/ui/components/input"
import "./dashboard.css"

type View = "overview" | "tasks" | "detail"
type Task = { id: string; title: string; project: string; status: "进行中" | "待开始" | "已完成"; priority: string; date: string; initials: string }
const initialTasks: Task[] = [
  { id: "MG-024", title: "让 Dashboard 更像一个舒服的工作台", project: "Mogi UI", status: "进行中", priority: "高", date: "10 月 22 日", initials: "ML" },
  { id: "MG-023", title: "整理组件的亮暗主题示例", project: "Mogi UI", status: "进行中", priority: "中", date: "10 月 23 日", initials: "ML" },
  { id: "MG-022", title: "补充任务列表的空状态", project: "Mogi UI", status: "待开始", priority: "中", date: "10 月 24 日", initials: "ML" },
  { id: "MG-021", title: "检查中文长标题的换行", project: "Mogi UI", status: "待开始", priority: "低", date: "10 月 25 日", initials: "ML" },
  { id: "MG-020", title: "统一按钮的键盘焦点样式", project: "Mogi UI", status: "已完成", priority: "高", date: "10 月 19 日", initials: "ML" },
  { id: "MG-019", title: "整理设计参考与来源", project: "Design", status: "已完成", priority: "低", date: "10 月 19 日", initials: "ML" },
]
const taskNotes: Record<string, { summary: string; context: string; steps: string[] }> = {
  "MG-024": { summary: "以暖色工作台为方向，把页面组织成总览、列表和详情三个层次。", context: "当卡片都一样大、信息都一样醒目时，打开页面反而不知道先看哪里。把任务放在中心，指标作为辅助，给长内容留出足够的阅读空间。", steps: ["梳理页面的信息层级", "完成工作台与任务列表", "检查详情页和窄屏布局"] },
  "MG-023": { summary: "让同一组组件在亮色与暗色下都有清晰、完整的展示。", context: "逐一检查文字、边框、状态和焦点样式，保留主题切换入口，避免只展示一种理想状态。", steps: ["整理需要展示的组件", "补齐亮暗主题示例", "检查文字与操作的可辨识度"] },
  "MG-022": { summary: "让搜索无结果和没有任务时的页面也能给出明确方向。", context: "空状态需要说明当前情况，并提供清除筛选或返回列表的实际操作。", steps: ["整理空状态文案", "提供恢复列表的入口", "验证筛选组合下的空状态"] },
  "MG-021": { summary: "让较长的中文标题在不同宽度下自然换行。", context: "检查任务名称、项目说明和详情正文的最小宽度，表格保持独立滚动，避免整个页面横向溢出。", steps: ["准备长中文与连续 ID", "检查手机与桌面布局", "检查文字完整性"] },
  "MG-020": { summary: "让使用键盘的人能够清楚辨认当前操作位置。", context: "检查按钮与链接的焦点指示、Tab 顺序和激活行为。", steps: ["检查可交互元素", "统一焦点指示", "使用键盘验证操作"] },
  "MG-019": { summary: "整理工作台的设计参考，并保留作者和作品链接。", context: "区分视觉概念与真实产品，把可借鉴的布局、信息密度和配色方法分别记录。", steps: ["收集候选作品", "记录可借鉴的部分", "保留完整来源链接"] },
}

function TaskStatus({ status }: { status: Task["status"] }) {
  return <span className={`ws-status ${status === "已完成" ? "is-done" : status === "进行中" ? "is-active" : ""}`}>
    {status === "已完成" ? <Check size={13} /> : status === "进行中" ? <Clock3 size={13} /> : <Circle size={11} />}{status}
  </span>
}

export function DashboardDemo({ dark, onThemeChange }: { dark: boolean; onThemeChange: () => void }) {
  const [view, setView] = useState<View>("overview")
  const headingRef = useRef<HTMLHeadingElement>(null)
  const previousPage = useRef("overview:MG-024")
  const [tasks, setTasks] = useState(initialTasks)
  const [selectedId, setSelectedId] = useState(initialTasks[0].id)
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("全部")
  const [checksByTask, setChecksByTask] = useState<Record<string, string[]>>({})
  const [feedback, setFeedback] = useState<{ text: string; revision: number } | null>(null)
  const selected = tasks.find(task => task.id === selectedId)!
  const notes = taskNotes[selected.id]
  const steps = notes.steps
  const checkedSteps = checksByTask[selected.id] ?? []
  const completed = tasks.filter(task => task.status === "已完成").length
  const active = tasks.filter(task => task.status === "进行中").length
  const pending = tasks.filter(task => task.status === "待开始").length
  const visible = tasks.filter(task => (filter === "全部" || task.status === filter) && `${task.title} ${task.id} ${task.project}`.toLowerCase().includes(query.toLowerCase()))
  function openTask(task: Task) { setSelectedId(task.id); setView("detail") }
  function toggleTask() {
    const done = selected.status !== "已完成"
    setTasks(current => current.map(task => task.id === selected.id ? { ...task, status: done ? "已完成" : "进行中" } : task))
    setFeedback(current => ({ text: done ? "完成了一件好事，给自己一个小小的赞。" : "任务已重新开始，按自己的节奏继续。", revision: (current?.revision ?? 0) + 1 }))
  }
  function toggleStep(taskId: string, step: string) {
    setChecksByTask(current => {
      const checked = current[taskId] ?? []
      return { ...current, [taskId]: checked.includes(step) ? checked.filter(item => item !== step) : [...checked, step] }
    })
  }
  useEffect(() => {
    const currentPage = `${view}:${selectedId}`
    if (previousPage.current !== currentPage) headingRef.current?.focus()
    previousPage.current = currentPage
  }, [view, selectedId])
  useEffect(() => {
    if (!feedback) return
    const timeout = window.setTimeout(() => setFeedback(null), 4200)
    return () => window.clearTimeout(timeout)
  }, [feedback])
  const pageName = view === "overview" ? "工作台" : view === "tasks" ? "任务列表" : "任务详情"

  return <div className="mogi-workspace">
    <a className="ws-skip" href="#dashboard-main">跳到主要内容</a>
    <DashboardLayout
      navigation={<div className="ws-navigation">
        <a href="?preview=dashboard" className="ws-brand"><span className="ws-brand-icon"><PawPrint size={23} /></span><span>mogi<span className="ws-brand-sub">a little room for good work</span></span></a>
        <div className="ws-workspace-name"><span className="ws-avatar">M</span><div><strong>茉吉的工作空间</strong><span>个人工作区 · 演示</span></div><Flower2 size={16} /></div>
        <nav aria-label="工作空间导航" className="ws-nav-items">
          <span className="ws-eyebrow">WORKSPACE</span>
          <button className={view === "overview" ? "is-current" : ""} aria-current={view === "overview" ? "page" : undefined} onClick={() => setView("overview")}><LayoutDashboard size={18} />工作台<span className="ws-nav-dot" /></button>
          <button className={view !== "overview" ? "is-current" : ""} aria-current={view !== "overview" ? "page" : undefined} onClick={() => setView("tasks")}><ListTodo size={18} />我的任务<span className="ws-nav-count">{tasks.length}</span></button>
          <span className="ws-eyebrow ws-library-label">LIBRARY</span>
          <a href="?preview=components"><BookOpen size={18} />组件展览<ExternalLink size={13} /></a>
          <a href="?preview=detail-layout"><Code2 size={18} />规则详情示例<ExternalLink size={13} /></a>
        </nav>
        <div className="ws-nav-bottom"><div className="ws-note"><Flower2 size={23} /><strong>留一点空间，给好想法。</strong><p>把重要的事放在眼前，<br />其余的，慢慢来。</p></div><a className="ws-profile" href="https://github.com/mollymogi/mogi-ui" target="_blank" rel="noreferrer"><span className="ws-avatar">ML</span><span><strong>mollymogi</strong><small>Mogi UI / Design playground</small></span><ExternalLink size={14} /></a></div>
      </div>}
      header={<header className="ws-topbar"><div className="ws-breadcrumb">我的空间<ChevronRight size={14} /><span>{pageName}</span></div><div className="ws-topbar-actions"><Badge variant="outline">示例数据</Badge><Button variant="ghost" size="icon-sm" onClick={onThemeChange} aria-label={dark ? "切换亮色主题" : "切换暗色主题"}>{dark ? <Sun /> : <Moon />}</Button></div></header>}
      aside={view === "overview" ? <div className="ws-aside">
        <FlipCard className="ws-focus-flip" showBackLabel="翻看行动清单" showFrontLabel="返回今日重点"
          front={<section className="ws-focus"><div className="ws-eyebrow"><span className="ws-live-dot" /> ONE THING AT A TIME</div><div className="ws-flower" aria-hidden="true"><Flower2 strokeWidth={1} /></div><p>今天，专注一件好事。</p><h2>把工作台<br />变得更舒服。</h2><p className="ws-focus-description">从清晰的层级开始，<br />让每一次打开都有方向。</p><Button onClick={() => openTask(tasks[0])}>继续这件事<ArrowRight /></Button></section>}
          back={<section className="ws-focus ws-focus-back">
            <div className="ws-eyebrow"><Flower2 size={13} /> A LITTLE PLAN</div>
            <h2>把好想法，<br />变成小进展。</h2>
            <p>今天的行动清单</p>
            <div className="ws-focus-checklist">{taskNotes[tasks[0].id].steps.map(step => <label key={step}><input type="checkbox" checked={(checksByTask[tasks[0].id] ?? []).includes(step)} onChange={() => toggleStep(tasks[0].id, step)} /><span>{step}</span></label>)}</div>
            <div className="ws-focus-progress"><span>小步向前</span><span>{(checksByTask[tasks[0].id] ?? []).length} / 3</span></div>
            <span className="ws-metric-track"><i style={{ width: `${(checksByTask[tasks[0].id] ?? []).length / 3 * 100}%` }} /></span>
            <Button onClick={() => openTask(tasks[0])}>打开任务详情<ArrowRight /></Button>
          </section>}
        />
        <section className="ws-aside-section"><div className="ws-section-heading"><h2>最近动态</h2><Clock3 size={15} /></div><ol className="ws-activity"><li><span className="ws-activity-dot" /><div><strong>整理了设计参考</strong><p>为工作台找到新的方向</p><small>演示 · 10:24</small></div></li><li><span className="ws-activity-dot" /><div><strong>完成焦点样式检查</strong><p>键盘操作也要清晰顺手</p><small>演示 · 09:40</small></div></li><li><span className="ws-activity-dot" /><div><strong>新的一天，新的小进展</strong><p>从最重要的任务开始</p><small>演示 · 09:00</small></div></li></ol></section>
        <p className="ws-aside-footnote"><PawPrint size={14} /> Made for a calmer workday.</p>
      </div> : undefined}
    >
      <div className="ws-view" key={view === "detail" ? selectedId : view}>
      <div className="ws-page-heading"><div><p className="ws-eyebrow">{view === "overview" ? "YOUR DAY, A LITTLE CLEARER" : view === "tasks" ? "LESS NOISE, MORE PROGRESS" : `${selected.id} / MOGI UI`}</p><h1 ref={headingRef} tabIndex={-1}>{view === "overview" ? "好好工作，也慢慢来。" : view === "tasks" ? "每一件小事，都在向前。" : selected.title}</h1><p>{view === "overview" ? "重要的任务、最近的进展，都在这里。" : view === "tasks" ? "把想法变成行动，一次完成一件。" : "让主要内容更突出，让下一步更明确。"}</p></div>{view === "overview" && <span className="ws-date">10 月 20 日<span>周二 · 演示日期</span></span>}{view === "detail" && <Button variant="outline" size="sm" onClick={() => setView("tasks")}><ArrowLeft />返回列表</Button>}</div>

      {view === "overview" && <>
        <div className="ws-metrics"><div><span>正在进行</span><strong><span className="ws-count" key={active}>{String(active).padStart(2, "0")}</span><span className="ws-metric-note">保持专注</span></strong><span className="ws-metric-track"><i style={{ width: `${active / tasks.length * 100}%` }} /></span></div><div><span>等待开始</span><strong><span className="ws-count" key={pending}>{String(pending).padStart(2, "0")}</span><span className="ws-metric-note">按自己的节奏</span></strong><span className="ws-metric-track"><i style={{ width: `${pending / tasks.length * 100}%` }} /></span></div><div><span>已经完成</span><strong><span className="ws-count" key={completed}>{String(completed).padStart(2, "0")}</span><span className="ws-metric-note">每一步都算数</span></strong><span className="ws-metric-track is-green"><i style={{ width: `${completed / tasks.length * 100}%` }} /></span></div></div>
        <section className="ws-section"><div className="ws-section-heading"><h2>值得先做的事 <span>UP NEXT</span></h2><Button variant="ghost" size="sm" onClick={() => { setQuery(""); setFilter("全部"); setView("tasks") }}>全部任务<ArrowRight /></Button></div><div className="ws-priority-list">{tasks.filter(task => task.status !== "已完成").slice(0, 3).map((task, index) => <button className="ws-priority-row" key={task.id} onClick={() => openTask(task)}><span className="ws-row-number">0{index + 1}</span><span className="ws-task-copy"><strong>{task.title}</strong><small>{task.project}<span>·</span>{task.date}</small></span><TaskStatus status={task.status} /><ArrowRight size={16} className="ws-row-arrow" /></button>)}{tasks.every(task => task.status === "已完成") && <div className="ws-empty"><Check /><strong>重要的事都已完成</strong><p>给自己一点放松的时间。</p></div>}</div></section>
        <section className="ws-section"><div className="ws-section-heading"><h2>手边的项目 <span>IN YOUR SPACE</span></h2><span className="ws-small">2 个项目</span></div><div className="ws-project-grid"><button className="ws-project-card" onClick={() => { setFilter("全部"); setQuery("Mogi UI"); setView("tasks") }}><div><span className="ws-project-icon"><PawPrint size={23} /></span><ArrowRight size={17} /></div><h3>Mogi UI</h3><p>有温度的组件，清晰的工作界面。</p><span className="ws-project-progress" aria-hidden="true"><i style={{ width: `${tasks.filter(task => task.project === "Mogi UI" && task.status === "已完成").length / 5 * 100}%` }} /></span><footer><span className="ws-project-members"><span>ML</span></span><span>{tasks.filter(task => task.project === "Mogi UI" && task.status === "已完成").length} / 5 已完成</span></footer></button><button className="ws-project-card ws-project-soft" onClick={() => { setFilter("全部"); setQuery("Design"); setView("tasks") }}><div><span className="ws-project-icon"><Flower2 size={23} /></span><ArrowRight size={17} /></div><h3>灵感花园</h3><p>收集好设计，留下值得尝试的想法。</p><footer><span className="ws-project-members"><span>ML</span></span><span>Design / 参考与探索</span></footer></button></div></section>
        <footer className="ws-page-footer"><span>一点点进展，也值得记录。</span><span>MOGI WORKSPACE / 01</span></footer>
      </>}

      {view === "tasks" && <section className="ws-task-section"><div className="ws-list-toolbar"><div className="ws-filters" role="group" aria-label="按任务状态筛选">{["全部", "进行中", "待开始", "已完成"].map(value => <button aria-pressed={filter === value} key={value} onClick={() => setFilter(value)}>{value}<span>{value === "全部" ? tasks.length : tasks.filter(task => task.status === value).length}</span></button>)}</div><label className="ws-search"><Search size={16} /><Input aria-label="搜索任务" placeholder="搜索任务或项目…" value={query} onChange={event => setQuery(event.target.value)} />{query && <Button variant="ghost" size="xs" onClick={() => setQuery("")}>清除</Button>}</label></div><div className="ws-table-scroll"><table className="ws-table"><caption className="sr-only">示例任务，点击任务名称查看详情</caption><thead><tr><th>任务名称</th><th>状态</th><th>优先级</th><th>负责人</th><th>截止日期</th></tr></thead><tbody>{visible.map(task => <tr key={task.id}><td><button className="ws-table-title" onClick={() => openTask(task)}><small>{task.id}</small><strong>{task.title}</strong></button></td><td><TaskStatus status={task.status} /></td><td><span className={`ws-priority ${task.priority === "高" ? "is-high" : ""}`}>{task.priority}</span></td><td><span className="ws-avatar ws-avatar-small" aria-label="负责人 mollymogi">{task.initials}</span></td><td className="ws-small">{task.date}</td></tr>)}</tbody></table></div>{visible.length === 0 && <div className="ws-empty"><Search /><strong>没有找到匹配的任务</strong><p>试试其他关键词，或清除筛选。</p><Button variant="outline" size="sm" onClick={() => { setQuery(""); setFilter("全部") }}>显示全部任务</Button></div>}<footer className="ws-table-footer">显示 {visible.length} / {tasks.length} 项<span>演示操作仅在当前页面有效</span></footer></section>}

      {view === "detail" && <div className="ws-detail-grid"><article><div className="ws-detail-summary"><TaskStatus status={selected.status} /><h2>{selected.status === "已完成" ? "这件事，已经完成。" : "把这一步，好好完成。"}</h2><p>{notes.summary}</p></div><section className="ws-detail-section"><h2>我们想解决什么</h2><p>{notes.context}</p></section><section className="ws-detail-section"><div className="ws-section-heading"><h2>一步一步来</h2><span className="ws-small">{checkedSteps.length} / {steps.length}</span></div><div className="ws-checklist">{steps.map(step => <label key={step}><input type="checkbox" checked={checkedSteps.includes(step)} onChange={() => toggleStep(selected.id, step)} /><span>{step}</span></label>)}</div></section><section className="ws-detail-section"><h2>设计参考</h2><a className="ws-reference" href="https://dribbble.com/shots/27207466-Dashboard-for-a-Productivity-Product-Lisso" target="_blank" rel="noreferrer"><span><strong>Lisso / HALO LAB</strong><small>暖色工作台与任务层级</small></span><ExternalLink size={16} /></a><a className="ws-reference" href="https://dribbble.com/shots/26300624-Dashboard-UI-Bento-Cards" target="_blank" rel="noreferrer"><span><strong>Dashboard UI Bento Cards / Dude Studios</strong><small>主区与辅助模块的比例</small></span><ExternalLink size={16} /></a></section></article><aside className="ws-detail-aside"><h2>任务信息</h2><dl><div><dt>项目</dt><dd>{selected.project}</dd></div><div><dt>负责人</dt><dd><span className="ws-avatar ws-avatar-small">ML</span>mollymogi</dd></div><div><dt>优先级</dt><dd>{selected.priority}</dd></div><div><dt>截止日期</dt><dd>{selected.date}</dd></div></dl><Button className="w-full" onClick={toggleTask}>{selected.status === "已完成" ? <ArrowLeft /> : <Check />}{selected.status === "已完成" ? "重新开始" : "标记完成"}</Button><p>示例任务 · 操作不会写入真实项目</p></aside></div>}
      </div>
    </DashboardLayout>
    <div className="ws-feedback" role="status" aria-live="polite">{feedback && <span className="ws-feedback-message" key={feedback.revision}><Check size={16} />{feedback.text}</span>}</div>
  </div>
}
