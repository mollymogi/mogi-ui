import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  CheckCircle2,
  CircleX,
  Copy,
  Inbox,
  PlugZap,
  Clock3,
  Flower2,
  LoaderCircle,
  Moon,
  PawPrint,
  PencilLine,
  Sparkles,
  Star,
  Sun,
  TriangleAlert,
} from "lucide-react"

import { AlertDialogDemo, FormDemo, PaginationDemo, SheetDemo, SidebarDemo } from "./demos-v2"
import { Alert, AlertDescription, AlertTitle } from "@mogi-ui/ui/components/alert"
import { Avatar, AvatarFallback } from "@mogi-ui/ui/components/avatar"
import { Badge } from "@mogi-ui/ui/components/badge"
import { Button } from "@mogi-ui/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@mogi-ui/ui/components/card"
import { Checkbox } from "@mogi-ui/ui/components/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@mogi-ui/ui/components/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@mogi-ui/ui/components/dropdown-menu"
import { CodeBlock } from "@mogi-ui/ui/components/code-block"
import { DescriptionItem, DescriptionList } from "@mogi-ui/ui/components/description-list"
import { EmptyState, LoadingState } from "@mogi-ui/ui/components/empty-state"
import { Input } from "@mogi-ui/ui/components/input"
import { LoadMore } from "@mogi-ui/ui/components/load-more"
import { Label } from "@mogi-ui/ui/components/label"
import { Popover, PopoverContent, PopoverTrigger } from "@mogi-ui/ui/components/popover"
import { RadioGroup, RadioGroupItem } from "@mogi-ui/ui/components/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@mogi-ui/ui/components/select"
import { Separator } from "@mogi-ui/ui/components/separator"
import { Skeleton } from "@mogi-ui/ui/components/skeleton"
import { Slider } from "@mogi-ui/ui/components/slider"
import { Switch } from "@mogi-ui/ui/components/switch"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@mogi-ui/ui/components/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@mogi-ui/ui/components/tabs"
import { Textarea } from "@mogi-ui/ui/components/textarea"
import { Toaster } from "@mogi-ui/ui/components/sonner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mogi-ui/ui/components/tooltip"

const palettes: { name: string; steps: string[] }[] = [
  { name: "corgi", steps: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"] },
  { name: "sand", steps: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] },
  { name: "terracotta", steps: ["100", "300", "500", "700"] },
  { name: "jasmine", steps: ["100", "300", "500", "700"] },
]

function SliderDemo() {
  const [volume, setVolume] = useState([60])
  const [price, setPrice] = useState([200, 800])
  return (
    <div className="grid gap-5">
      <div className="grid gap-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="volume">提醒音量</Label>
          <span className="text-sm text-muted-foreground">{volume[0]}%</span>
        </div>
        <Slider id="volume" value={volume} onValueChange={setVolume} max={100} step={1} />
      </div>
      <div className="grid gap-3">
        <div className="flex items-center justify-between">
          <Label>价格区间</Label>
          <span className="text-sm text-muted-foreground">
            ¥{price[0]} – ¥{price[1]}
          </span>
        </div>
        <Slider value={price} onValueChange={setPrice} min={0} max={1000} step={50} aria-label="价格区间" />
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4">
      <h2 className="text-lg font-bold">{title}</h2>
      {children}
    </section>
  )
}

const runs = [
  { id: "run_7f3a9c21", suite: "validation/core", status: "通过", duration: "12.4s" },
  { id: "run_b81e0d4f", suite: "memory/recall", status: "失败", duration: "3.1s" },
  { id: "run_2c9d77a0", suite: "interpretations", status: "运行中", duration: "—" },
]

function TableDemo() {
  const [selected, setSelected] = useState<string>(runs[0].id)

  return (
    <div className="grid gap-6">
      <div className="rounded-xl border bg-card">
        <Table>
          <TableCaption className="mb-4">点击行或勾选框选中；选中行有底色和左侧色条</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <span className="sr-only">选中</span>
              </TableHead>
              <TableHead>运行 ID</TableHead>
              <TableHead>用例集</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">耗时</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {runs.map((run) => (
              <TableRow
                key={run.id}
                data-state={selected === run.id ? "selected" : undefined}
                onClick={() => setSelected(run.id)}
                className="cursor-pointer"
              >
                <TableCell>
                  <Checkbox
                    checked={selected === run.id}
                    onCheckedChange={() => setSelected(run.id)}
                    aria-label={`选中 ${run.id}`}
                  />
                </TableCell>
                <TableCell>
                  <code>{run.id}</code>
                </TableCell>
                <TableCell>{run.suite}</TableCell>
                <TableCell>
                  {run.status === "通过" ? (
                    <Badge variant="success">
                      <CheckCircle2 /> 通过
                    </Badge>
                  ) : run.status === "失败" ? (
                    <Badge variant="highlight">
                      <CircleX /> 失败
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <LoaderCircle /> 运行中
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">{run.duration}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>记忆条目</TableHead>
              <TableHead>来源</TableHead>
              <TableHead>写入时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableEmpty colSpan={3}>还没有记忆条目</TableEmpty>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function LoadMoreDemo() {
  const [loaded, setLoaded] = useState(20)
  const [loading, setLoading] = useState(false)
  const hasMore = loaded < 50

  return (
    <LoadMore
      loaded={loaded}
      pages={Math.ceil(loaded / 20)}
      hasMore={hasMore}
      loading={loading}
      onLoadMore={() => {
        setLoading(true)
        setTimeout(() => {
          setLoaded((n) => Math.min(n + 20, 50))
          setLoading(false)
        }, 600)
      }}
    />
  )
}

const samplePayload = `{
  "event_id": "evt_01J9ZK3Q",
  "kind": "memory.write",
  "payload": {
    "item": "user prefers concise replies",
    "token": "••••••••"
  }
}`

export function App() {
  const [dark, setDark] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
  }, [dark])

  return (
    <TooltipProvider>
      <div className="mx-auto grid max-w-5xl gap-12 px-4 py-10 sm:px-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="grid gap-2">
            <span className="flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
              <PawPrint className="size-4 text-primary" /> Mogi UI · v0.1
            </span>
            <h1 className="text-3xl font-extrabold text-balance">茉莉与柯基的组件库</h1>
            <p className="max-w-prose text-muted-foreground">
              基于 shadcn/ui，配色取自 mogi：姜橘做主色，奶油做底色，摩卡做文字，茉莉叶绿当成功态。
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setDark((d) => !d)}>
            {dark ? <Sun /> : <Moon />}
            {dark ? "亮色" : "暗色"}
          </Button>
        </header>

        <Section title="色板">
          <div className="grid gap-3">
            {palettes.map((p) => (
              <div key={p.name} className="grid gap-1.5">
                <span className="text-xs text-muted-foreground">{p.name}</span>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(64px,1fr))] gap-1.5">
                  {p.steps.map((s) => (
                    <div
                      key={s}
                      className="flex h-14 items-end rounded-md border p-1.5 text-[10px] font-medium"
                      style={{
                        background: `var(--${p.name}-${s})`,
                        color: Number(s) >= 500 ? "var(--petal)" : "var(--sand-900)",
                      }}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="按钮">
          <div className="flex flex-wrap items-center gap-3">
            <Button>主要操作</Button>
            <Button variant="secondary">次要</Button>
            <Button variant="outline">描边</Button>
            <Button variant="ghost">幽灵</Button>
            <Button variant="link">链接</Button>
            <Button variant="destructive">删除</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">小号</Button>
            <Button>默认</Button>
            <Button size="lg">
              <Flower2 /> 大号
            </Button>
            <Button size="icon" aria-label="柯基">
              <PawPrint />
            </Button>
            <Button disabled>禁用</Button>
          </div>
        </Section>

        <Section title="标签与提示">
          <div className="flex flex-wrap gap-2">
            <Badge>默认</Badge>
            <Badge variant="soft">新功能</Badge>
            <Badge variant="success">已完成</Badge>
            <Badge variant="warning">待审核</Badge>
            <Badge variant="highlight">推荐</Badge>
            <Badge variant="secondary">次要</Badge>
            <Badge variant="outline">草稿</Badge>
            <Badge variant="destructive">失败</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="soft">
              <Sparkles /> 新功能
            </Badge>
            <Badge variant="success">
              <CheckCircle2 /> 已完成
            </Badge>
            <Badge variant="warning">
              <Clock3 /> 待审核
            </Badge>
            <Badge variant="highlight">
              <Star /> 推荐
            </Badge>
            <Badge variant="outline">
              <PencilLine /> 草稿
            </Badge>
            <Badge variant="destructive">
              <CircleX /> 失败
            </Badge>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Alert variant="success">
              <CheckCircle2 />
              <AlertTitle>保存成功</AlertTitle>
              <AlertDescription>组件库配置已同步到所有项目。</AlertDescription>
            </Alert>
            <Alert variant="warning">
              <TriangleAlert />
              <AlertTitle>上游有更新</AlertTitle>
              <AlertDescription>shadcn 的 Dialog 组件有 2 处改动，建议对比合并。</AlertDescription>
            </Alert>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => toast.success("已保存", { description: "mogi 已经记住啦" })}>
              弹出 Toast
            </Button>
          </div>
        </Section>

        <Section title="表单">
          <div className="grid items-start gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>新建项目</CardTitle>
                <CardDescription>项目会使用 mogi 主题和全部基础组件。</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">项目名称</Label>
                  <Input id="name" placeholder="例如：mogi-blog" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="repo">仓库地址</Label>
                  <Input id="repo" defaultValue="github.com/mollymogi/" aria-invalid />
                  <p className="text-xs text-destructive">请填写完整的仓库路径。</p>
                </div>
                <div className="grid gap-2">
                  <Label>框架</Label>
                  <Select defaultValue="vite">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择框架" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vite">Vite + React</SelectItem>
                      <SelectItem value="next">Next.js</SelectItem>
                      <SelectItem value="remix">React Router</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="desc">简介</Label>
                  <Textarea id="desc" placeholder="写点什么，比如今天遛了柯基。" />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="dark-sync" defaultChecked />
                  <Label htmlFor="dark-sync">同步暗色主题</Label>
                </div>
                <RadioGroup defaultValue="registry" className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="registry" id="r1" />
                    <Label htmlFor="r1">Registry</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="npm" id="r2" />
                    <Label htmlFor="r2">npm 包</Label>
                  </div>
                </RadioGroup>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto">自动更新</Label>
                  <Switch id="auto" defaultChecked />
                </div>
                <SliderDemo />
              </CardContent>
              <CardFooter className="justify-end gap-2">
                <Button variant="ghost">取消</Button>
                <Button>创建</Button>
              </CardFooter>
            </Card>

            <div className="grid gap-6">
              <Tabs defaultValue="components">
                <TabsList>
                  <TabsTrigger value="components">组件</TabsTrigger>
                  <TabsTrigger value="tokens">Token</TabsTrigger>
                  <TabsTrigger value="docs">文档</TabsTrigger>
                </TabsList>
                <TabsContent value="components" className="pt-2 text-muted-foreground">
                  31 个组件，来自 shadcn/ui 并套用 mogi 主题，另有几个 mogi 自有组件。
                </TabsContent>
                <TabsContent value="tokens" className="pt-2 text-muted-foreground">
                  基础色板 + 语义变量，变量名与 shadcn 一致。
                </TabsContent>
                <TabsContent value="docs" className="pt-2 text-muted-foreground">
                  文档站正在建设中。
                </TabsContent>
              </Tabs>

              <Card>
                <CardHeader className="flex flex-row items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarFallback className="bg-accent font-bold text-accent-foreground">M</AvatarFallback>
                  </Avatar>
                  <div className="grid">
                    <CardTitle>mogi</CardTitle>
                    <CardDescription>茉莉花 · 柯基 · 设计系统</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Badge variant="soft">v0.1</Badge>
                  <Badge variant="outline">shadcn</Badge>
                  <Badge variant="success">Tailwind v4</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="grid gap-3">
                  <Skeleton className="h-4 w-2/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            </div>
          </div>
        </Section>

        <Section title="表单校验">
          <div className="grid items-start gap-6 md:grid-cols-2">
            <FormDemo />
            <p className="text-sm text-muted-foreground">
              Form 基于 react-hook-form：直接点“创建”会看到每个字段下方的错误提示，标签同时变成危险色，
              输入框带 aria-invalid，读屏也能读到错误。
            </p>
          </div>
        </Section>

        <Section title="导航">
          <SidebarDemo />
          <PaginationDemo />
        </Section>

        <Section title="浮层">
          <div className="flex flex-wrap gap-3">
            <SheetDemo />
            <AlertDialogDemo />
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">打开对话框</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>删除组件 Button？</DialogTitle>
                  <DialogDescription>这会从 registry 中移除它，已安装到项目里的副本不受影响。</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">取消</Button>
                  </DialogClose>
                  <Button variant="destructive">删除</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">下拉菜单</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>个人资料</DropdownMenuItem>
                <DropdownMenuItem>设置</DropdownMenuItem>
                <DropdownMenuItem variant="destructive">退出登录</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">弹出框</Button>
              </PopoverTrigger>
              <PopoverContent className="grid gap-2">
                <p className="font-bold">关于 mogi</p>
                <p className="text-muted-foreground">灵感来自茉莉花和柯基犬。</p>
              </PopoverContent>
            </Popover>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">悬停提示</Button>
              </TooltipTrigger>
              <TooltipContent>汪！</TooltipContent>
            </Tooltip>
          </div>
          <Separator />
          <p className="text-xs text-muted-foreground">
            English & numbers 0123456789 use JetBrains Mono，中文使用江城圆体。
          </p>
        </Section>

        <Section title="表格">
          <TableDemo />
          <div className="rounded-xl border bg-card px-4">
            <LoadMoreDemo />
          </div>
        </Section>

        <Section title="详情与原始数据">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="grid gap-4 rounded-xl border bg-card p-4">
              <DescriptionList>
                <DescriptionItem term="事件 ID">
                  <code>evt_01J9ZK3Q</code>
                </DescriptionItem>
                <DescriptionItem term="提供方">memory-service</DescriptionItem>
                <DescriptionItem term="写入路径">/var/lib/jasmine/memory/items/2026-10-15/evt_01J9ZK3Q.json</DescriptionItem>
              </DescriptionList>
              <Separator />
              <DescriptionList compact>
                <DescriptionItem term="状态">已提交</DescriptionItem>
                <DescriptionItem term="尚未交付">2 条</DescriptionItem>
              </DescriptionList>
            </div>
            <CodeBlock
              label="event.payload"
              masked
              tags={[{ label: "machine 原文" }]}
              actions={
                <Button size="sm" variant="outline" onClick={() => toast("已复制")}>
                  <Copy /> 复制
                </Button>
              }
            >
              {samplePayload}
            </CodeBlock>
          </div>
        </Section>

        <Section title="空态与加载">
          <div className="grid gap-4 md:grid-cols-2">
            <EmptyState
              icon={<Inbox />}
              title="还没有记录"
              description="Core 返回了空列表，写入第一条记忆后会显示在这里。"
              action={<Button size="sm">新建记录</Button>}
            />
            <LoadingState label="正在读取验证运行…" />
            <EmptyState
              variant="error"
              icon={<CircleX />}
              title="读取失败"
              description="Core 拒绝了请求：403 forbidden。"
              action={
                <Button size="sm" variant="outline">
                  重试
                </Button>
              }
            />
            <EmptyState
              variant="unavailable"
              icon={<PlugZap />}
              title="未接入"
              description="这个接口还没有上线，接入后自动显示数据。"
            />
          </div>
        </Section>
      </div>
      <Toaster theme={dark ? "dark" : "light"} />
    </TooltipProvider>
  )
}
