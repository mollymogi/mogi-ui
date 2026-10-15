import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  // GitHub Pages 部署在 /<仓库名>/ 下，由 CI 通过 DOCS_BASE 传入；本地开发用根路径
  base: process.env.DOCS_BASE ?? "/",
  plugins: [react(), tailwindcss()],
})
