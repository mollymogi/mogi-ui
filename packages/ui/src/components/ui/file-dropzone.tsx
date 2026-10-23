"use client"

import * as React from "react"
import { File as FileIcon, Upload } from "lucide-react"
import { cn } from "@mogi-ui/ui/lib/utils"

type FileDropzoneProps = Omit<React.ComponentProps<"div">, "onChange" | "onError"> & {
  value?: File | null
  onFileChange: (file: File) => void
  accept?: string
  disabled?: boolean
  maxSize?: number
  label?: string
  description?: React.ReactNode
  validateFile?: (file: File) => string | undefined
  onError?: (message: string) => void
}

// mogi: UI only. accept/maxSize are convenience checks, not server-side validation.
function FileDropzone({ value, onFileChange, accept, disabled, maxSize, label = "选择文件", description,
  validateFile, onError, className, id, ...props }: FileDropzoneProps) {
  const input = React.useRef<HTMLInputElement>(null)
  const generatedId = React.useId()
  const errorId = `${id ?? generatedId}-error`
  const descriptionId = `${id ?? generatedId}-description`
  const [dragging, setDragging] = React.useState(false)
  const [error, setError] = React.useState("")
  function choose(file?: File) {
    if (!file || disabled) return
    const allowed = !accept || accept.split(",").some(token => {
      const rule = token.trim().toLowerCase()
      return rule.startsWith(".") ? file.name.toLowerCase().endsWith(rule)
        : rule.endsWith("/*") ? file.type.toLowerCase().startsWith(rule.slice(0, -1))
        : file.type.toLowerCase() === rule
    })
    const message = !allowed ? "请选择支持的文件格式。"
      : maxSize != null && file.size > maxSize ? `文件不能超过 ${(maxSize / 1024 / 1024).toLocaleString()} MB。`
      : validateFile?.(file)
    setError(message ?? "")
    if (message) { onError?.(message); return }
    onFileChange(file)
  }
  return <div id={id} data-slot="file-dropzone" data-disabled={disabled || undefined}
    className={cn("grid min-w-0 gap-3", className)} {...props}>
    <input ref={input} type="file" className="sr-only" tabIndex={-1} aria-label={label} accept={accept}
      disabled={disabled} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : descriptionId}
      onChange={event => { choose(event.target.files?.[0]); event.target.value = "" }} />
    <button type="button" disabled={disabled} aria-describedby={error ? `${descriptionId} ${errorId}` : descriptionId}
      onClick={() => input.current?.click()}
      onDragOver={event => { event.preventDefault(); if (!disabled) setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={event => { event.preventDefault(); setDragging(false); choose(event.dataTransfer.files[0]) }}
      className={cn("flex min-w-0 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-input bg-card px-6 py-10 text-center text-card-foreground transition-colors duration-(--duration-mogi-fast) ease-mogi hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50", dragging && !disabled && "bg-accent text-accent-foreground")}>
      <span className="flex size-12 items-center justify-center rounded-lg bg-muted text-link" aria-hidden>{value ? <FileIcon className="size-6" /> : <Upload className="size-6" />}</span>
      <span className="max-w-full font-semibold wrap-anywhere">{value?.name ?? label}</span>
      <span className="text-sm text-muted-foreground">{value ? "点击更换，也可拖入新文件" : "点击选择，或将文件拖到这里"}</span>
    </button>
    <div id={descriptionId} className="text-sm text-muted-foreground">{description}</div>
    {error && <p id={errorId} role="alert" className="text-sm text-destructive">{error}</p>}
  </div>
}
export { FileDropzone }
export type { FileDropzoneProps }
