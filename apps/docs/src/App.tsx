import { useEffect, useState } from "react"
import { toast } from "sonner"
import { CheckCircle2, Flower2, Moon, PawPrint, Sun, TriangleAlert } from "lucide-react"

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
import { Input } from "@mogi-ui/ui/components/input"
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
import { Switch } from "@mogi-ui/ui/components/switch"
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4">
      <h2 className="text-lg font-bold">{title}</h2>
      {children}
    </section>
  )
}

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
                  20 个基础组件，全部来自 shadcn/ui 并套用 mogi 主题。
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

        <Section title="浮层">
          <div className="flex flex-wrap gap-3">
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
      </div>
      <Toaster theme={dark ? "dark" : "light"} />
    </TooltipProvider>
  )
}
