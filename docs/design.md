# 个人机械飞升程序 · 设计文档 (MVP)

本项目旨在提供一个「个人效率的 SOP 库」：当你想做某件事时，打开相应 SOP，即可看到完整的步骤清单与提示，并可勾选记录进度。强调“全貌展示+流动进度+便捷搜索”。

## 产品目标
- 全览展示：SOP 详情一次性展示全部步骤，不强制逐步推进。
- 流动进度：勾选必选步骤实时计算进度百分比；可选步骤单独计数。
- 易查找：首页列出所有 SOP，支持搜索与分类筛选，展示预估时长与标签。
- 轻量落地：前端数据渲染、LocalStorage 持久化进度，无后端依赖。

## 数据模型
- SOP
  - id, title, category, tags[], summary, estimatedMinutes
  - steps: Step[]
    - simple：title/tip/links/required
    - choice：options[]

详见 `src/sops/types.ts` 与样例 `src/sops/items/*.ts`（由 `src/sops/data.ts` 自动聚合）。

## 关键交互

- 详情页：全览全部步骤，支持勾选与选择题；展示必选进度百分比，可选计数。
- 首页：列表展示各 SOP，支持搜索与分类筛选；卡片展示预计时长与标签。

## 本地持久化
- 键：`sop:${sopId}:progress`
- 结构：`{ checked: Record<stepId, boolean>, choices: Record<stepId, string>, notes: Record<stepId, string>, favorited?: boolean }`
- Hook：`useLocalStorage` 与 `useSopProgress`

## 架构与技术
- 前端：React + TypeScript + Vite + TailwindCSS
- 路由：React Router（主页 `/`，详情 `/sop/:id`）
- 状态：页面内局部状态 + LocalStorage；无需全局后端。

## 后续迭代方向（非 MVP）
- 分类/标签多选筛选与收藏置顶、最近使用排序
- 分享链接（带当前勾选状态的只读视图）与打印/导出 Markdown
- SOP 内容外置（YAML/Markdown Frontmatter），引入解析器统一渲染

## 目录结构（相关）
- `src/sops/types.ts`：类型定义
- `src/sops/items/*.ts`：SOP 数据样例（单文件一条）
- `src/sops/data.ts`：聚合所有 SOP
- `src/sops/SopDetailPage.tsx`：详情页
- `src/workflows/HomePage.tsx`：主页（SOP 列表）
- `src/hooks/useLocalStorage.ts` / `src/hooks/useSopProgress.ts`：本地持久化与进度管理