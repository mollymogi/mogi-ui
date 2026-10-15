import { cpSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { defineConfig, type Plugin } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

const tokenFonts = fileURLToPath(new URL("../../packages/tokens/fonts", import.meta.url))

// 把江城圆体的 CSS、分片和许可证原样发布到站点 /fonts/，供使用方自托管时下载
function publishFonts(): Plugin {
  let outDir = "dist"
  return {
    name: "mogi-publish-fonts",
    apply: "build",
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      cpSync(tokenFonts, `${outDir}/fonts`, { recursive: true })
    },
  }
}

export default defineConfig({
  // GitHub Pages 部署在 /<仓库名>/ 下，由 CI 通过 DOCS_BASE 传入；本地开发用根路径
  base: process.env.DOCS_BASE ?? "/",
  plugins: [react(), tailwindcss(), publishFonts()],
  build: {
    // 不把小字体分片内联成 data: URI，使用方开了 CSP（font-src 不含 data:）时也能加载
    assetsInlineLimit: 0,
  },
})
