import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  ChartColumn,
  Flower2,
  House,
  Inbox,
  PawPrint,
  Settings,
  SlidersHorizontal,
  Trash2,
  TriangleAlert,
} from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@mogi-ui/ui/components/alert-dialog"
import { Badge } from "@mogi-ui/ui/components/badge"
import { Button } from "@mogi-ui/ui/components/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@mogi-ui/ui/components/form"
import { Input } from "@mogi-ui/ui/components/input"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@mogi-ui/ui/components/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@mogi-ui/ui/components/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@mogi-ui/ui/components/sheet"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@mogi-ui/ui/components/sidebar"
import { Switch } from "@mogi-ui/ui/components/switch"
import { Label } from "@mogi-ui/ui/components/label"
import { Separator } from "@mogi-ui/ui/components/separator"

type ProjectForm = {
  name: string
  email: string
  framework: string
}

export function FormDemo() {
  const form = useForm<ProjectForm>({
    defaultValues: { name: "", email: "", framework: "" },
  })

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit((values) =>
          toast.success("已提交", { description: `项目 ${values.name} 创建好啦` })
        )}
        className="grid gap-4 rounded-xl border bg-card p-6"
      >
        <FormField
          control={form.control}
          name="name"
          rules={{
            required: "请填写项目名称",
            pattern: { value: /^[a-z0-9-]+$/, message: "只能用小写字母、数字和连字符" },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>项目名称</FormLabel>
              <FormControl>
                <Input placeholder="例如：mogi-blog" {...field} />
              </FormControl>
              <FormDescription>会用作仓库名和部署地址。</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          rules={{
            required: "请填写联系邮箱",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "邮箱格式不对" },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>联系邮箱</FormLabel>
              <FormControl>
                <Input type="email" placeholder="mogi@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="framework"
          rules={{ required: "请选择框架" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>框架</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择框架" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="vite">Vite + React</SelectItem>
                  <SelectItem value="next">Next.js</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => form.reset()}>
            重置
          </Button>
          <Button type="submit">创建</Button>
        </div>
      </form>
    </Form>
  )
}

export function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <SlidersHorizontal /> 打开抽屉
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>筛选条件</SheetTitle>
          <SheetDescription>调整后列表会立即刷新。</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 px-4">
          <div className="grid gap-2">
            <Label htmlFor="sheet-keyword">关键词</Label>
            <Input id="sheet-keyword" placeholder="运行 ID 或用例集" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="sheet-failed">只看失败</Label>
            <Switch id="sheet-failed" />
          </div>
        </div>
        <SheetFooter>
          <Button>应用</Button>
          <SheetClose asChild>
            <Button variant="outline">取消</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function AlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Trash2 /> 删除确认
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <TriangleAlert />
          </AlertDialogMedia>
          <AlertDialogTitle>删除项目 mogi-blog？</AlertDialogTitle>
          <AlertDialogDescription>
            项目里的全部记录都会一起删除，这一步无法撤销。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={() => toast("已删除")}>
            删除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function PaginationDemo() {
  const total = 12
  const [page, setPage] = useState(3)
  const pages = [1, page - 1, page, page + 1, total].filter(
    (p, i, arr) => p >= 1 && p <= total && arr.indexOf(p) === i
  )

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setPage((p) => Math.max(1, p - 1))
            }}
          />
        </PaginationItem>
        {pages.map((p, i) => (
          <PaginationItem key={p}>
            {i > 0 && p - pages[i - 1] > 1 ? (
              <span className="flex items-center gap-1">
                <PaginationEllipsis />
                <PageLink p={p} active={p === page} onSelect={setPage} />
              </span>
            ) : (
              <PageLink p={p} active={p === page} onSelect={setPage} />
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setPage((p) => Math.min(total, p + 1))
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

function PageLink({
  p,
  active,
  onSelect,
}: {
  p: number
  active: boolean
  onSelect: (p: number) => void
}) {
  return (
    <PaginationLink
      href="#"
      isActive={active}
      onClick={(e) => {
        e.preventDefault()
        onSelect(p)
      }}
    >
      {p}
    </PaginationLink>
  )
}

const navItems = [
  { label: "概览", icon: House },
  { label: "运行记录", icon: ChartColumn, badge: "12" },
  { label: "收件箱", icon: Inbox, badge: "3" },
  { label: "设置", icon: Settings },
]

export function SidebarDemo() {
  const [active, setActive] = useState(navItems[0].label)

  return (
    // 预览用：transform 让侧栏的 fixed 定位相对这个盒子，而不是整个页面
    <div className="relative h-[420px] overflow-hidden rounded-xl border [transform:translateZ(0)]">
      <SidebarProvider className="h-full min-h-0">
        <Sidebar collapsible="icon" className="absolute h-full">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <PawPrint className="size-4" />
                  </div>
                  <div className="grid text-left leading-tight">
                    <span className="font-bold">jasmine mesh</span>
                    <span className="text-xs text-muted-foreground">看板</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>导航</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        isActive={active === item.label}
                        tooltip={item.label}
                        onClick={() => setActive(item.label)}
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                      {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="mogi">
                  <Flower2 />
                  <span>mogi</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-12 items-center gap-2 border-b px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4!" />
            <span className="font-bold">{active}</span>
          </header>
          <div className="grid gap-3 p-4 text-sm text-muted-foreground">
            <p>点左上角按钮或按 Ctrl/⌘ + B 收起侧栏；收起后只显示图标，悬停有提示。</p>
            <div className="flex gap-2">
              <Badge variant="soft">collapsible="icon"</Badge>
              <Badge variant="outline">窄屏变成抽屉</Badge>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
