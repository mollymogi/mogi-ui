import * as React from "react"
import { Archive, Binary, Braces, Code2, File, FileCode2, FileImage, FileJson2, FileText, Folder, Link2, Terminal, type LucideIcon } from "lucide-react"
import { cn } from "@mogi-ui/ui/lib/utils"

export type FileTone = "primary" | "success" | "warning" | "highlight" | "muted"
export type FileKind = "file" | "directory" | "symlink" | "binary"
export type FileType = { icon: LucideIcon; tone: FileTone; label: string; kind: FileKind }
export type FileTypeOptions = { kind?: FileKind; overrides?: Record<string, Partial<Pick<FileType, "icon" | "tone" | "label">>> }

// Text tones use accessible semantic variants, not the button-fill primary or light warning fill.
export const fileToneClass: Record<FileTone, string> = {
  primary: "text-link", success: "text-success", warning: "text-warning-foreground dark:text-warning",
  highlight: "text-highlight", muted: "text-muted-foreground",
}
const definition = (icon: LucideIcon, tone: FileTone, label: string) => ({ icon, tone, label })
const source = definition(FileCode2, "primary", "C/C++ 源码")
const header = definition(Braces, "highlight", "头文件")
const script = definition(Terminal, "success", "脚本")
const config = definition(FileJson2, "warning", "配置文件")
const image = definition(FileImage, "success", "图片")
const archive = definition(Archive, "warning", "归档")
const types: Record<string, ReturnType<typeof definition>> = {}
for (const [extensions, type] of [
  [["c", "cc", "cpp", "cxx", "c++", "m", "mm", "rs", "go", "java"], source],
  [["h", "hh", "hpp", "hxx", "h++", "inl"], header],
  [["sh", "bash", "zsh", "fish", "py", "ps1", "bat", "cmd"], script],
  [["json", "jsonc", "yaml", "yml", "toml", "ini", "cfg", "conf", "xml"], config],
  [["md", "mdx", "markdown", "rst", "txt", "log"], definition(FileText, "muted", "文档")],
  [["js", "jsx", "ts", "tsx", "html", "css", "scss", "vue", "svelte"], definition(Code2, "primary", "前端源码")],
  [["png", "jpg", "jpeg", "gif", "svg", "webp", "ico", "avif", "bmp", "tiff"], image],
  [["zip", "gz", "tgz", "bz2", "xz", "7z", "rar", "tar", "tar.gz", "tar.bz2", "tar.xz"], archive],
  [["bin", "exe", "dll", "so", "dylib", "o", "obj", "a", "lib", "wasm", "pdf"], definition(Binary, "muted", "二进制")],
  [["cmake"], definition(Code2, "highlight", "CMake")],
] as const) for (const extension of extensions) types[extension] = type

/** Pure classification. Only the supplied name/kind is examined; no file IO or symlink following. */
export function fileTypeOf(name: string, { kind = "file", overrides = {} }: FileTypeOptions = {}): FileType {
  const special = { directory: definition(Folder, "primary", "目录"), symlink: definition(Link2, "highlight", "符号链接"), binary: definition(Binary, "muted", "二进制") } as const
  if (kind !== "file") return { ...special[kind], kind }
  const base = name.split(/[\\/]/).at(-1) ?? ""
  const lower = base.toLowerCase()
  const exact = lower === "cmakelists.txt" ? definition(Code2, "highlight", "CMake") : lower === "makefile" ? script : undefined
  const keys = Object.keys({ ...types, ...overrides }).sort((a, b) => b.length - a.length)
  const extension = keys.find(key => lower.endsWith(`.${key}`))
  const match = exact ?? (extension && Object.hasOwn(types, extension) ? types[extension] : undefined) ?? definition(File, "muted", "文件")
  const override = Object.hasOwn(overrides, lower) ? overrides[lower] : extension && Object.hasOwn(overrides, extension) ? overrides[extension] : undefined
  const resolved = { ...match, ...override }
  const resolvedKind = match.icon === Binary ? "binary" : "file"
  return { ...resolved, kind: resolvedKind }
}

export function FileTypeIcon({ name, kind, overrides, className, ...props }: Omit<React.ComponentProps<typeof File>, "name"> & { name: string } & FileTypeOptions) {
  const type = fileTypeOf(name, { kind, overrides })
  const Icon = type.icon
  return <Icon data-slot="file-type-icon" data-kind={type.kind} role="img" aria-label={type.label} className={cn("size-4 shrink-0", fileToneClass[type.tone], className)} {...props} />
}
