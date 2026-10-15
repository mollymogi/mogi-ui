import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = fileURLToPath(new URL('../', import.meta.url))
const require = createRequire(import.meta.url)
const output = path.join(root, 'apps/docs/public/r')
const result = spawnSync(process.execPath, [require.resolve('shadcn'), 'build', '--output', output], { cwd: root, stdio: 'inherit' })
if (result.error) throw result.error
if (result.status !== 0) process.exit(result.status ?? 1)

// Registry consumers have their own aliases, not the workspace's @mogi-ui package.
// shadcn add rewrites these conventional aliases using the consumer's components.json.
for (const filename of readdirSync(output).filter(name => name.endsWith('.json'))) {
  const target = path.join(output, filename)
  const item = JSON.parse(readFileSync(target, 'utf8'))
  let changed = false
  for (const file of item.files ?? []) {
    if (typeof file.content !== 'string') continue
    const previous = file.content
    file.content = file.content
      .replace(/(["'])@mogi-ui\/ui\/lib\/utils\1/g, '$1@/lib/utils$1')
      .replace(/(["'])@mogi-ui\/ui\/components\//g, '$1@/components/ui/')
    changed ||= previous !== file.content
  }
  if (changed) writeFileSync(target, JSON.stringify(item, null, 2) + '\n')
}
