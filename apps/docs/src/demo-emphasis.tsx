import {ArrowRight, BookOpen, History, ListChecks, Play, RefreshCw, ShieldCheck, Sparkles, CheckCircle2, CircleAlert, Clock, Info} from "lucide-react"
import {StatusBanner} from "@mogi-ui/ui/components/status-banner"
import {LinkList, LinkListItem} from "@mogi-ui/ui/components/link-list"
import {MetricCard} from "@mogi-ui/ui/components/metric-card"
import {Badge} from "@mogi-ui/ui/components/badge"
import {Alert, AlertDescription, AlertTitle} from "@mogi-ui/ui/components/alert"
import {Button} from "@mogi-ui/ui/components/button"
import {Card, CardContent, CardHeader, CardTitle} from "@mogi-ui/ui/components/card"

// 示例数据，不连接任何服务。
export function EmphasisDemo() {
  return <div className="grid gap-6">
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div><p className="text-sm text-muted-foreground">StatusBanner · LinkList · MetricCard</p><h1 className="mt-1 text-2xl font-semibold">看板的重点层级</h1></div>
      <Button variant="ghost"><RefreshCw />刷新状态</Button>
    </header>
    <StatusBanner tone="danger" label="需要处理" title="有记忆操作处理失败" description="请查看失败任务和运行详情，确认需要处理的问题。"
      action={<Button asChild><a href="#jobs">查看失败任务<ArrowRight /></a></Button>}
      footer={<div className="flex flex-wrap items-center gap-3"><Button size="sm" variant="outline" disabled><Play />一键启动引擎</Button><span className="text-xs text-muted-foreground">当前部署尚未提供本机引擎启动配置。</span></div>} />
    <div className="grid gap-4 sm:grid-cols-3">
      <MetricCard label="失败任务" value={10} tone="destructive" hint="示例数据" />
      <MetricCard label="待处理任务" value={0} hint="0 等待中 · 0 正在处理" />
      <MetricCard label="保留中的记忆" value={300} emphasis="quiet" />
    </div>
    <div className="grid items-start gap-6 lg:grid-cols-3">
      <Card className="gap-2 lg:col-span-2"><CardHeader><CardTitle className="text-sm">继续查看</CardTitle></CardHeader><CardContent>
        <LinkList aria-label="示例入口">
          <LinkListItem href="#items" icon={BookOpen} title="查看记忆条目" description="当前要求、历史来源和变化依据" trailing="300" />
          <LinkListItem href="#interpretations" icon={Sparkles} title="查看对话提炼进度" description="对话转成候选记忆的进展" />
          <LinkListItem href="#jobs" icon={ListChecks} title="查看处理队列" description="等待、运行和失败的任务" trailing={<Badge variant="danger">10 失败</Badge>} />
          <LinkListItem href="#traces" icon={History} title="查看召回记录" description="哪些记忆被用在了哪次任务" />
          <LinkListItem href="#rules" icon={ShieldCheck} title="查看当前规则" description="优先于记忆的有效规则" />
        </LinkList>
      </CardContent></Card>
      <Card className="gap-2"><CardHeader><CardTitle className="text-sm">语义色</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-2">
        <Badge>主操作</Badge><Badge variant="danger"><CircleAlert />失败</Badge><Badge variant="warning"><Clock />等待</Badge><Badge variant="success"><CheckCircle2 />完成</Badge><Badge variant="info"><Info />信息</Badge><Badge variant="soft">标签</Badge>
      </CardContent></Card>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      <StatusBanner tone="warning" label="处理中" title="还有记忆操作等待处理" description="部分操作仍在队列中，结果可能尚未更新。" />
      <StatusBanner tone="success" label="运行正常" title="最近运行正常" description="最近记录未报告故障。" />
      <StatusBanner tone="info" label="提示" title="引擎已配置，尚无成功操作记录" description="还不能据此确认写入或召回已经可用。" />
      <Alert variant="destructive"><CircleAlert /><AlertTitle>保存失败</AlertTitle><AlertDescription>检查网络后重试。</AlertDescription></Alert>
    </div>
  </div>
}
