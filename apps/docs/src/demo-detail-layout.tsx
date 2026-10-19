import { useState } from "react"
import { ArrowRight, BookOpen, Clock3, FileText, History, Link2, ShieldCheck, TriangleAlert } from "lucide-react"
import { DetailLayout } from "@mogi-ui/ui/components/detail-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@mogi-ui/ui/components/card"
import { Badge } from "@mogi-ui/ui/components/badge"
import { Button } from "@mogi-ui/ui/components/button"
import { DescriptionItem, DescriptionList } from "@mogi-ui/ui/components/description-list"
import { CodeBlock } from "@mogi-ui/ui/components/code-block"
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@mogi-ui/ui/components/sheet"

/** Static labelled fixture: demonstrates layout, not a live Authority judgement. */
export function DetailLayoutDemo() {
  const [open, setOpen] = useState(false)
  const [showAside, setShowAside] = useState(true)
  return (
    <div id="detail-layout-demo" className="rounded-xl border bg-background p-4 sm:p-6" data-testid="detail-layout-demo">
      <DetailLayout
        header={
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="grid gap-2">
              <p className="text-xs font-medium tracking-widest text-muted-foreground">MEMORY / 记忆详情</p>
              <h3 className="text-2xl font-semibold tracking-tight">长期记忆引擎的选择</h3>
              <p className="text-sm text-muted-foreground">演示数据 · 首屏结论与关键变化，来源细节按需查看。</p>
            </div>
            <div className="flex flex-wrap gap-2"><Button variant="ghost" onClick={() => setShowAside(value => !value)}>{showAside ? "隐藏辅助栏" : "显示辅助栏"}</Button><Button variant="outline" onClick={() => setOpen(true)}><FileText /> 查看来源</Button></div>
          </div>
        }
        summary={
          <Card className="border-warning/40 bg-warning-soft/30">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="warning"><TriangleAlert /> 历史决策</Badge>
                <span className="text-xs text-muted-foreground">以当前规则为准</span>
              </div>
              <CardTitle className="text-xl leading-snug">这条记忆已被新规则替代</CardTitle>
              <CardDescription>可以保留历史，但不能用它覆盖当前规则或任务状态。</CardDescription>
            </CardHeader>
          </Card>
        }
        metrics={[
          { label: "版本变化", value: "v1 → v2", icon: History, note: "来源规则发生替代" },
          { label: "当前规则", value: "已生效", icon: ShieldCheck, note: "并非语义验证结果" },
          { label: "记忆用途", value: "历史参考", icon: BookOpen, note: "不会成为当前权威" },
        ].map(({ label, value, icon: Icon, note }) => (
          <Card key={label} className="gap-2 py-4">
            <CardContent className="grid gap-2">
              <p className="flex items-center gap-2 text-xs text-muted-foreground"><Icon className="size-4" />{label}</p>
              <p className="text-xl font-semibold">{value}</p>
              <p className="text-xs text-muted-foreground">{note}</p>
            </CardContent>
          </Card>
        ))}
        aside={showAside ? (
          <>
            <Card>
              <CardHeader><CardTitle className="text-sm">来源概况</CardTitle></CardHeader>
              <CardContent><DescriptionList compact>
                <DescriptionItem term="项目">Jasmine Core</DescriptionItem>
                <DescriptionItem term="状态">ACTIVE（生命周期）</DescriptionItem>
                <DescriptionItem term="采样">2026-10-18 20:00</DescriptionItem>
              </DescriptionList></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">下一步</CardTitle><CardDescription>先查看当前规则，再追溯变化。</CardDescription></CardHeader>
              <CardContent><Button className="w-full" onClick={() => setOpen(true)}><Link2 /> 追溯规则与来源</Button></CardContent>
            </Card>
          </>
        ) : undefined}
      >
        <Card>
          <CardHeader><CardTitle>变化对比</CardTitle><CardDescription>历史内容和当前依据并排呈现，避免把旧记忆当成新规则。</CardDescription></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-3 rounded-lg border bg-muted/40 p-4">
              <p className="flex items-center justify-between gap-2 text-sm text-muted-foreground">历史记忆 <Badge variant="outline"><History /> v1</Badge></p>
              <p className="text-lg font-medium">使用引擎 A</p>
              <p className="text-sm text-muted-foreground">保留原文与来源，仅作历史参考。</p>
            </div>
            <div className="grid gap-3 rounded-lg border border-primary/30 bg-accent/30 p-4">
              <p className="flex items-center justify-between gap-2 text-sm">当前规则 <Badge variant="soft"><ShieldCheck /> v2</Badge></p>
              <p className="text-lg font-semibold">改用引擎 B</p>
              <p className="text-sm text-muted-foreground">本次采样读到的有效版本。</p>
            </div>
          </CardContent>
        </Card>
        <div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock3 className="size-4 shrink-0" />示例为只读快照，查看详情不会提交修改。</div>
      </DetailLayout>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="sm:max-w-xl">
          <SheetHeader><SheetTitle>规则与来源详情</SheetTitle><SheetDescription>演示记录 · 技术元数据放进辅助面板，不抢占首屏。</SheetDescription></SheetHeader>
          <SheetBody className="grid content-start gap-6">
            <DescriptionList>
              <DescriptionItem term="历史版本">v1</DescriptionItem>
              <DescriptionItem term="当前版本">v2</DescriptionItem>
              <DescriptionItem term="规则状态">ACTIVE</DescriptionItem>
            </DescriptionList>
            <CodeBlock label="演示判定记录">{'{\n  "status": "VERSION_CHANGED",\n  "reason": "superseded_decision",\n  "synthetic": true\n}'}</CodeBlock>
          </SheetBody>
          <SheetFooter><Button variant="outline" onClick={() => setOpen(false)}>返回看板 <ArrowRight /></Button></SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
