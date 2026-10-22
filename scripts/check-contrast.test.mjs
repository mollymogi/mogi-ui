import { test } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { spawnSync } from "node:child_process"

function fixture(t, mutate) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "mogi-contrast-"))
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  for (const file of ["scripts/check-contrast.mjs", "packages/tokens/src/contrast.js", "packages/tokens/src/primitives.css", "packages/tokens/src/theme.css", "registry.json"]) {
    const target = path.join(dir, file)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.copyFileSync(new URL(`../${file}`, import.meta.url), target)
  }
  fs.writeFileSync(path.join(dir, "package.json"), '{"type":"module"}')
  const change = (file, from, to) => {
    const target = path.join(dir, file)
    const source = fs.readFileSync(target, "utf8")
    assert.ok(source.includes(from))
    fs.writeFileSync(target, source.replaceAll(from, to))
  }
  mutate?.(change)
  return spawnSync(process.execPath, [path.join(dir, "scripts/check-contrast.mjs")], { encoding: "utf8" })
}

test("current palette and registry pass", (t) => assert.equal(fixture(t).status, 0))
test("low text contrast fails even when registry matches", (t) => {
  const result = fixture(t, (change) => {
    change("packages/tokens/src/theme.css", "--primary-foreground: #ffffff;", "--primary-foreground: #a65a2a;")
    change("registry.json", '"primary-foreground": "#ffffff"', '"primary-foreground": "#a65a2a"')
  })
  assert.equal(result.status, 1)
  assert.match(result.stderr, /FAIL light primary-foreground\/primary/)
})
test("low control contrast fails independently of text", (t) => {
  const result = fixture(t, (change) => {
    change("packages/tokens/src/theme.css", "--border-strong: var(--sand-500);", "--border-strong: #e9dccb;")
    change("registry.json", '"border-strong": "#a57e69"', '"border-strong": "#e9dccb"')
    change("registry.json", '"input": "#a57e69"', '"input": "#e9dccb"')
  })
  assert.equal(result.status, 1)
  assert.match(result.stderr, /FAIL light input\/background/)
})
test("registry drift fails", (t) => {
  const result = fixture(t, (change) => change("registry.json", '"input": "#a57e69"', '"input": "#ffffff"'))
  assert.equal(result.status, 1)
  assert.match(result.stderr, /registry drift: input/)
})
test("cyclic aliases fail closed", (t) => {
  const result = fixture(t, (change) => change("packages/tokens/src/theme.css", "--input: var(--border-strong);", "--input: var(--input);"))
  assert.equal(result.status, 1)
  assert.match(result.stderr, /Invalid token reference: input/)
})

test("low slider range contrast fails when registry matches", (t) => {
  const result = fixture(t, (change) => {
    change("packages/tokens/src/theme.css", "--slider-range: var(--corgi-400);", "--slider-range: var(--primary);")
    change("registry.json", '"slider-range": "#dc9357"', '"slider-range": "#a65a2a"')
  })
  assert.equal(result.status, 1)
  assert.match(result.stderr, /FAIL dark slider selected range\/track/)
})
test("low slider thumb border contrast fails independently of track", (t) => {
  const result = fixture(t, (change) => {
    change("packages/tokens/src/theme.css", "--slider-range: var(--corgi-400);", "--slider-range: #241811;")
    change("registry.json", '"slider-range": "#dc9357"', '"slider-range": "#241811"')
    change("packages/tokens/src/theme.css", "--muted: #3a2a1f;", "--muted: #ffffff;")
    change("registry.json", '"muted": "#3a2a1f"', '"muted": "#ffffff"')
  })
  assert.equal(result.status, 1)
  assert.match(result.stderr, /FAIL dark slider thumb border\/background/)
  assert.doesNotMatch(result.stderr, /FAIL dark slider selected range\/track/)
})

test("dark diff deletion contrast fails for the previous destructive token", (t) => {
  const result = fixture(t, (change) => {
    change("packages/tokens/src/theme.css", "--destructive: #e87960;", "--destructive: #e0735a;")
    change("registry.json", '"destructive": "#e87960"', '"destructive": "#e0735a"')
  })
  assert.equal(result.status, 1)
  assert.match(result.stderr, /FAIL dark diff deletion text\/background: .* = 4\.395 < 4\.5/)
})

test("monochrome light text contrast is enforced even when registry matches", (t) => {
  const result = fixture(t, (change) => {
    change("packages/tokens/src/theme.css", "--foreground: #171717;", "--foreground: #fafafa;")
    change("registry.json", '"--foreground": "#171717"', '"--foreground": "#fafafa"')
  })
  assert.equal(result.status, 1)
  assert.match(result.stderr, /FAIL monochrome foreground\/background/)
})
