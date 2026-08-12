import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const repositoryName = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split('/')[1] : ''
const isGithubActions = Boolean(process.env.GITHUB_ACTIONS)
const isUserSite = repositoryName.endsWith('.github.io')
const base = isGithubActions ? (isUserSite ? '/' : `/${repositoryName}/`) : '/'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'MAP 个人机械飞升程序',
        short_name: 'MAP',
        description:
          '个人效率 SOP 库：打开对应 SOP 查看完整步骤清单，边执行边勾选，实时查看进度。支持搜索、分类与收藏。',
        theme_color: '#0f172a',
        background_color: '#f8fafc',
        display: 'standalone',
        lang: 'zh-CN',
        start_url: base,
        scope: base,
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api/],
      },
    }),
  ],
  base,
})
