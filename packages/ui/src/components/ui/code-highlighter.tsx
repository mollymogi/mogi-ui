"use client"

import * as React from "react"
import { createLowlight } from "lowlight"
import c from "highlight.js/lib/languages/c"
import cpp from "highlight.js/lib/languages/cpp"
import cmake from "highlight.js/lib/languages/cmake"
import bash from "highlight.js/lib/languages/bash"
import python from "highlight.js/lib/languages/python"
import json from "highlight.js/lib/languages/json"
import markdown from "highlight.js/lib/languages/markdown"
import yaml from "highlight.js/lib/languages/yaml"
import javascript from "highlight.js/lib/languages/javascript"
import typescript from "highlight.js/lib/languages/typescript"

const syntax = createLowlight({ c, cpp, cmake, bash, python, json, markdown, yaml, javascript, typescript })
const aliases: Record<string, string> = { "c++": "cpp", cc: "cpp", cxx: "cpp", h: "cpp", hpp: "cpp", sh: "bash", shell: "bash", zsh: "bash", py: "python", md: "markdown", yml: "yaml", js: "javascript", ts: "typescript" }
const extensions: Record<string, string> = { c: "c", h: "cpp", cc: "cpp", cpp: "cpp", cxx: "cpp", hpp: "cpp", hxx: "cpp", cmake: "cmake", sh: "bash", bash: "bash", zsh: "bash", py: "python", json: "json", md: "markdown", markdown: "markdown", yaml: "yaml", yml: "yaml", js: "javascript", ts: "typescript" }
export function codeLanguage(language?: string, fileName?: string): string | undefined {
  // An explicit but unknown language intentionally suppresses filename inference.
  if (language != null) {
    const key = language.trim().toLowerCase()
    const resolved = Object.hasOwn(aliases, key) ? aliases[key] ?? key : key
    return Object.hasOwn(aliases, key) || syntax.listLanguages().includes(resolved) ? resolved : undefined
  }
  const name = fileName?.split(/[\\/]/).at(-1)?.toLowerCase()
  if (name === "cmakelists.txt") return "cmake"
  const extension = name?.split(".").at(-1) ?? ""
  return Object.hasOwn(extensions, extension) ? extensions[extension] : undefined
}

type TokenTone = "plain" | "comment" | "string" | "keyword" | "type" | "number" | "meta" | "key"
export const syntaxToneClass: Record<TokenTone, string> = {
  plain: "text-foreground", comment: "text-muted-foreground", string: "text-success",
  keyword: "text-link", type: "text-highlight", number: "text-warning-foreground dark:text-warning",
  meta: "text-highlight", key: "text-link",
}
const tones: Record<string, TokenTone> = { comment: "comment", quote: "comment", string: "string", regexp: "string", keyword: "keyword", literal: "keyword", built_in: "type", type: "type", title: "type", number: "number", meta: "meta", attr: "key", attribute: "key", section: "keyword", bullet: "meta", code: "string" }
export type CodeSegment = { text: string; tone: TokenTone }
export type HighlightedLine = { segments: CodeSegment[]; ending: string }

/** Tokenize the complete source first to preserve multiline comments/strings. Never emit HTML. */
export function highlightCode(content: string, language?: string, fileName?: string): HighlightedLine[] {
  let currentLine: HighlightedLine = { segments: [], ending: "" }
  const lines: HighlightedLine[] = [currentLine]
  function append(text: string, tone: TokenTone) {
    for (const part of text.split(/(\r\n|\n|\r)/)) {
      if (/^(?:\r\n|\n|\r)$/.test(part)) {
        currentLine.ending = part
        currentLine = { segments: [], ending: "" }
        lines.push(currentLine)
      } else if (part) currentLine.segments.push({ text: part, tone })
    }
  }
  const resolved = codeLanguage(language, fileName)
  if (!resolved) { append(content, "plain"); return lines }
  type Tree = ReturnType<typeof syntax.highlight>
  function visit(node: Tree | Tree["children"][number], inherited: TokenTone = "plain") {
    if (node.type === "text") { append(node.value, inherited); return }
    let tone = inherited
    if (node.type === "element") {
      const classes = node.properties.className
      if (Array.isArray(classes)) for (const value of classes) {
        const candidate = tones[String(value).replace(/^hljs-/, "")]
        if (candidate) { tone = candidate; break }
      }
    }
    if ("children" in node) for (const child of node.children) visit(child, tone)
  }
  visit(syntax.highlight(resolved, content))
  return lines
}

export function CodeHighlighter({ content, language, fileName }: { content: string; language?: string; fileName?: string }) {
  const lines = React.useMemo(() => highlightCode(content, language, fileName), [content, language, fileName])
  return <code data-slot="code-highlighter">{lines.map((line, i) => <React.Fragment key={i}>{line.segments.map((segment, j) => <span key={j} data-token={segment.tone} className={syntaxToneClass[segment.tone]}>{segment.text}</span>)}{line.ending}</React.Fragment>)}</code>
}
