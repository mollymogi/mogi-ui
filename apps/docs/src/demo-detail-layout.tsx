import { useRef, useState } from "react"
import { ArrowRight, CheckCircle2, FileText, FlaskConical, History, Info, ShieldCheck, TriangleAlert } from "lucide-react"
import { DetailLayout } from "@mogi-ui/ui/components/detail-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@mogi-ui/ui/components/card"
import { Badge } from "@mogi-ui/ui/components/badge"
import { Button } from "@mogi-ui/ui/components/button"
import { DescriptionItem, DescriptionList } from "@mogi-ui/ui/components/description-list"
import { CodeBlock } from "@mogi-ui/ui/components/code-block"
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@mogi-ui/ui/components/sheet"

/** Labelled illustrative records: this preview neither reads nor enforces live rules. */
export function DetailLayoutDemo() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const [showAside, setShowAside] = useState(true)
  return (
    <div id="detail-layout-demo" className="rounded-xl border bg-background p-4 sm:p-6" data-testid="detail-layout-demo">
      <DetailLayout
        header={
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="grid gap-2">
              <p className="flex flex-wrap items-center gap-3 text-xs font-medium tracking-widest text-muted-foreground">MEMORY / 历史记忆 <Badge variant="outline"><FlaskConical /> 排版示例</Badge></p>
              <h1 className="text-2xl font-semibold tracking-tight">数据库升级方式</h1>
              <p className="text-sm text-muted-foreground">示例数据，用于展示排版，不代表真实规则或拦截结果。</p>
            </div>
            <div className="flex flex-wrap gap-2"><Button variant="ghost" onClick={() => setShowAside(value => !value)}>{showAside ? "隐藏辅助栏" : "显示辅助栏"}</Button><Button variant="outline" onClick={event => { triggerRef.current = event.currentTarget; setOpen(true) }}><FileText /> 查看来源</Button></div>
          </div>
        }
        summary={
          <Card className="border-primary/30 bg-accent/20">
            <CardHeader className="gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="soft"><ShieldCheck /> 当前要求</Badge>
                <span className="text-xs text-muted-foreground">本次操作应遵守的具体规则</span>
              </div>
              <CardTitle className="text-2xl leading-snug sm:text-3xl">先在副本演练升级与恢复，日常服务保持不动。</CardTitle>
              <CardDescription>schema 12 → 13 的升级和恢复都在隔离副本上验证；日常数据库暂不升级。</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-x-6 gap-y-3 border-t border-primary/15 pt-4 text-sm">
              <span className="flex items-center gap-2"><CheckCircle2 className="size-4 shrink-0 text-success" /> 可以：创建副本、演练升级与恢复</span>
              <span className="flex items-center gap-2"><ShieldCheck className="size-4 shrink-0 text-primary" /> 边界：不改日常数据库、不重启日常服务</span>
            </CardContent>
          </Card>
        }
        aside={showAside ? (
          <>
            <Card>
              <CardHeader><CardTitle className="text-sm">适用范围</CardTitle></CardHeader>
              <CardContent><DescriptionList compact>
                <DescriptionItem term="项目">Jasmine Core</DescriptionItem>
                <DescriptionItem term="任务">数据库升级与恢复演练</DescriptionItem>
                <DescriptionItem term="环境">隔离副本</DescriptionItem>
              </DescriptionList></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">需要确认时</CardTitle><CardDescription>查看具体规则的原文和来源，再决定下一步。</CardDescription></CardHeader>
              <CardContent><Button variant="outline" className="w-full" onClick={event => { triggerRef.current = event.currentTarget; setOpen(true) }}><FileText /> 查看规则原文与来源</Button></CardContent>
            </Card>
          </>
        ) : undefined}
      >
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3"><CardTitle className="flex items-center gap-2"><History className="size-4 text-muted-foreground" /> 历史记忆</CardTitle><Badge variant="warning"><TriangleAlert /> 已被替代</Badge></div>
            <CardDescription>旧记忆继续保留，执行时以顶部当前要求为准。</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <blockquote className="rounded-lg border bg-muted/30 p-4 text-lg leading-relaxed text-muted-foreground">“直接将日常数据库升级到 schema 13，再验证恢复流程。”</blockquote>
            <div className="grid gap-2 border-t pt-4">
              <p className="text-sm font-medium">这次变化意味着什么？</p>
              <p className="text-sm text-muted-foreground">演练地点改为隔离副本，日常服务暂不参与。旧记忆里的“直接升级日常数据库”不能继续作为操作依据。</p>
            </div>
            <p className="flex items-start gap-2 text-xs text-muted-foreground"><Info className="mt-0.5 size-4 shrink-0" /> 这条记忆会保留供追溯；保留状态不表示它仍是当前要求。</p>
          </CardContent>
        </Card>
        <p className="text-xs text-muted-foreground">这里比较的是关联规则的新旧记录，不是软件版本，也不是对执行结果的验证。</p>
      </DetailLayout>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="sm:max-w-xl" onCloseAutoFocus={event => {
          event.preventDefault()
          triggerRef.current?.focus()
        }}>
          <SheetHeader><SheetTitle>规则原文与来源</SheetTitle><SheetDescription>演示记录 · 版本和技术信息仅用于追溯。</SheetDescription></SheetHeader>
          <SheetBody className="grid content-start gap-6">
            <div className="grid gap-3"><Badge variant="soft"><ShieldCheck /> 当前规则原文</Badge><p className="text-sm leading-relaxed">先在副本上演练 schema 12 到 13 的升级和恢复，日常服务先不动。</p></div>
            <DescriptionList>
              <DescriptionItem term="来源">任务约束（演示）</DescriptionItem>
              <DescriptionItem term="记录版本">历史 v1 → 当前 v2</DescriptionItem>
              <DescriptionItem term="版本含义">同一条规则的修订序号；不代表软件版本或任务通过。</DescriptionItem>
              <DescriptionItem term="关联状态">当前记录 ACTIVE（演示）</DescriptionItem>
            </DescriptionList>
            <CodeBlock label="演示关联记录">{'{\n  "status": "VERSION_CHANGED",\n  "reason": "superseded_decision",\n  "synthetic": true\n}'}</CodeBlock>
          </SheetBody>
          <SheetFooter><Button variant="outline" onClick={() => setOpen(false)}>返回页面 <ArrowRight /></Button></SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
