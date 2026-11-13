import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import Module, { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const uiSrcDir = path.join(rootDir, "packages/ui/src");

const require = createRequire(import.meta.url);
const ts = require(path.join(rootDir, "packages/ui/node_modules/typescript"));
const React = require(path.join(rootDir, "packages/ui/node_modules/react"));
const { renderToStaticMarkup } = require(
  path.join(rootDir, "packages/ui/node_modules/react-dom/server"),
);

const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, isMain, options) {
  if (request.startsWith("@mogi-ui/ui/")) {
    const rel = request.slice("@mogi-ui/ui/".length);
    const candidates = [
      path.join(uiSrcDir, rel),
      path.join(uiSrcDir, `${rel}.tsx`),
      path.join(uiSrcDir, `${rel}.ts`),
      path.join(uiSrcDir, rel, "index.tsx"),
      path.join(uiSrcDir, rel, "index.ts"),
    ];
    for (const candidate of candidates) {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return candidate;
      }
    }
  }
  return origResolve.call(this, request, parent, isMain, options);
};

for (const ext of [".ts", ".tsx"]) {
  Module._extensions[ext] = function (module, filename) {
    const source = fs.readFileSync(filename, "utf8");
    const { outputText } = ts.transpileModule(source, {
      fileName: filename,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    });
    return module._compile(outputText, filename);
  };
}

const chatThread = require("@mogi-ui/ui/components/ui/chat-thread");
const {
  resolveAgentBrand,
  ChatAgentAvatar,
  ChatParticipantChip,
  ChatEntityChip,
  ChatBubble,
  parseFilePathRef,
  parseMarkdownBlocks,
  ChatMessageContent,
} = chatThread;

test("resolveAgentBrand matches model family before CLI and handles fallback", () => {
  assert.equal(resolveAgentBrand("opencode", "deepseek-v4.1-flash"), "deepseek");
  assert.equal(resolveAgentBrand("dsh", "deepseek-v4.1"), "deepseek");
  assert.equal(resolveAgentBrand("claude", "opus[1m]"), "claude");
  assert.equal(resolveAgentBrand("codex", "gpt-6.1-sol"), "openai");
  assert.equal(resolveAgentBrand("agy", "gemini-4-carbon:medium"), "gemini");
  assert.equal(resolveAgentBrand("opencode", "qwen3-coder"), "qwen");
  assert.equal(resolveAgentBrand("opencode", "glm-5"), "glm");
  assert.equal(resolveAgentBrand("opencode", "kimi-k2"), "kimi");
  assert.equal(resolveAgentBrand("opencode", "MiniMax-M1"), "minimax");
  assert.equal(resolveAgentBrand("grok"), "grok");
  assert.equal(resolveAgentBrand("hermes"), "hermes");
  assert.equal(resolveAgentBrand("dsh"), "dsh");
  assert.equal(resolveAgentBrand("opencode"), "opencode");
  assert.equal(resolveAgentBrand("unknown-cli", "mystery"), "generic");
});

test("parseFilePathRef parses POSIX paths, file:// URIs, line refs, and rejects API routes", () => {
  assert.deepEqual(parseFilePathRef("/Users/alice/app/src/Chatrooms.tsx:42"), {
    path: "/Users/alice/app/src/Chatrooms.tsx",
    line: 42,
    raw: "/Users/alice/app/src/Chatrooms.tsx:42",
  });
  assert.deepEqual(parseFilePathRef("/Volumes/Work/方案_v5.md#L120"), {
    path: "/Volumes/Work/方案_v5.md",
    line: 120,
    raw: "/Volumes/Work/方案_v5.md#L120",
  });
  assert.deepEqual(parseFilePathRef("file:///Users/alice/notes.md:7"), {
    path: "/Users/alice/notes.md",
    line: 7,
    raw: "file:///Users/alice/notes.md:7",
  });
  assert.equal(parseFilePathRef("/api/chatrooms/room-1/messages"), null);
  assert.equal(parseFilePathRef("https://example.com/a/b.ts"), null);
  assert.equal(parseFilePathRef("just-a-word"), null);
});

test("parseMarkdownBlocks handles streaming unclosed code fences, tables, lists, headings, and blockquotes", () => {
  const closed = parseMarkdownBlocks(
    "# Summary\n\n> quoted note\n\n- item one\n- [x] done item\n\n| ColA | ColB |\n| --- | --- |\n| 1 | 2 |\n\n```ts\nconst x = 1;\n```\n",
  );
  assert.equal(closed.some((b) => b.kind === "heading" && b.level === 1), true);
  assert.equal(closed.some((b) => b.kind === "blockquote"), true);
  assert.equal(closed.some((b) => b.kind === "list" && !b.ordered), true);
  assert.equal(closed.some((b) => b.kind === "table" && b.rows.length === 1), true);
  assert.equal(closed.some((b) => b.kind === "code" && b.language === "ts" && b.closed), true);

  const streamingOpen = parseMarkdownBlocks("Intro text\n```bash\necho hello\nls -la");
  const openFence = streamingOpen.find((b) => b.kind === "code");
  assert.ok(openFence);
  assert.equal(openFence.closed, false);
  assert.equal(openFence.language, "bash");
  assert.match(openFence.code, /ls -la/);
});

test("ChatAgentAvatar and ChatMessageContent render semantic tokens, mentions, clickable paths, and escape text", () => {
  const avatarHtml = renderToStaticMarkup(
    React.createElement(ChatAgentAvatar, {
      cli: "claude",
      model: "opus",
      size: "md",
      title: "Claude Lead",
    }),
  );
  assert.match(avatarHtml, /bg-agent-claude/);
  assert.match(avatarHtml, /text-agent-foreground/);
  assert.match(avatarHtml, /<svg/);
  assert.match(avatarHtml, /Claude Lead/);

  const msgHtml = renderToStaticMarkup(
    React.createElement(ChatMessageContent, {
      content:
        "请 @claude-lead 查看 **方案要点** 并在 `/Users/mercuryliu/doc/方案_v5.md:18` 验证，详见 /Volumes/Data/report.md。<a>raw</a>",
      mentions: [
        {
          matchers: ["@claude-lead"],
          token: "@claude-lead",
          label: "@claude-lead",
          cli: "claude",
          model: "opus[1m]",
        },
      ],
      onOpenPath: () => {},
    }),
  );
  assert.match(msgHtml, /<strong[^>]*>方案要点<\/strong>/);
  assert.match(msgHtml, /@claude-lead/);
  assert.match(msgHtml, /bg-agent-claude/);
  assert.match(msgHtml, /<button/);
  assert.match(msgHtml, /方案_v5\.md:18/);
  assert.match(msgHtml, /\/Volumes\/Data\/report\.md/);
  assert.match(msgHtml, /&lt;a&gt;raw&lt;\/a&gt;/);

  const chipHtml = renderToStaticMarkup(
    React.createElement(ChatParticipantChip, {
      avatar: React.createElement(ChatAgentAvatar, { cli: "codex", size: "xs" }),
      label: "@codex-rev",
      status: "online",
    }),
  );
  assert.match(chipHtml, /bg-agent-openai/);

  const bubbleHtml = renderToStaticMarkup(
    React.createElement(
      ChatBubble,
      {
        sender: "agent",
        author: "@claude-lead",
        avatar: React.createElement(ChatAgentAvatar, { cli: "claude", size: "md" }),
      },
      React.createElement(ChatMessageContent, {
        content: "**Done**",
      }),
    ),
  );
  assert.match(bubbleHtml, /<article/);
  assert.match(bubbleHtml, /bg-agent-claude/);
  assert.match(bubbleHtml, /<strong[^>]*>Done<\/strong>/);

  const entityHtml = renderToStaticMarkup(
    React.createElement(ChatEntityChip, {
      avatar: React.createElement(ChatAgentAvatar, { cli: "opencode", model: "deepseek-v4.1", size: "xs" }),
      name: "@dsh",
    }),
  );
  assert.match(entityHtml, /bg-agent-deepseek/);
});

test("R48-001: unrecognized fences are consumed as paragraph text", () => {
  for (const line of ['```typescript title="example"', '````']) {
    assert.deepEqual(parseMarkdownBlocks(`${line}\nbody`), [
      { kind: "paragraph", lines: [line, "body"] },
    ]);
  }
});

test("R48-002: system bubbles retain article semantics and native props", () => {
  const ref = React.createRef();
  const onClick = () => {};
  const element = ChatBubble({ sender: "system", id: "notice", "aria-label": "Notice", ref, onClick, children: "Ready" });
  assert.equal(element.type, "article");
  assert.equal(element.props.id, "notice");
  assert.equal(element.props["aria-label"], "Notice");
  assert.equal(element.props.ref, ref);
  assert.equal(element.props.onClick, onClick);
});

test("R48-003: path buttons contain complete extensions and line suffixes", () => {
  for (const ext of ["tsx", "jsx", "mdx", "jsonc", "jsonl", "cpp", "hpp"]) {
    const filename = `src/App.${ext}`;
    const html = renderToStaticMarkup(React.createElement(ChatMessageContent, {
      content: `${filename}:42.`, onOpenPath: () => {},
    }));
    assert.ok(html.includes(`title="点击预览或打开：${filename} (第 42 行)"`), html);
    assert.ok(html.includes(`>${filename}:42</span>`), html);
  }
});

test("R48-004: escaped pipes remain inside table cells", () => {
  assert.deepEqual(parseMarkdownBlocks('| first | second |\n| --- | --- |\n| a\\|b | c |'), [
    { kind: "table", headers: ["first", "second"], rows: [["a|b", "c"]] },
  ]);
});
