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
- Step
  - 基础字段：id, title, tip?, required?(默认true), links?
  - 类型：
    - simple（默认）
    - choice：options[]

详见 `src/sops/types.ts` 与样例 `src/sops/data.ts`。

## 关键交互
- 详情页
  - 全量展示步骤清单；每步可勾选完成、填写备注；choice 步骤可选项；支持展开/折叠提示。
  - 顶部进度条：必选完成度 requiredDone/requiredTotal -> 百分比；可选步骤另计数。
  - 操作：收藏、重置、返回列表。
- 首页
  - 列表卡片：分类、标题、简介、标签、预估时长；展示本地进度条。
  - 搜索：匹配 标题/简介/标签（前端模糊包含）。
  - 分类筛选：下拉选择分类或“全部”。

## 本地持久化
- 键：`sop:${sopId}:progress`
- 结构：`{ checked: Record<stepId, boolean>, choices: Record<stepId, string>, notes: Record<stepId, string>, favorited?: boolean }`
- Hook：`useLocalStorage` 与 `useSopProgress`

## 架构与技术
- 前端：React + TypeScript + Vite + TailwindCSS
- 路由：React Router（主页 `/`，详情 `/sop/:id`）
- 状态：页面内局部状态 + LocalStorage；无需全局后端。

## 非目标（MVP以外）
- 复杂的流程引擎（并行/子流程/权限）
- 服务端账户体系与云同步
- 富文本/Markdown 渲染器与版本历史

## 后续演进方向
- 搜索增强：前端索引（minisearch/lunr）与权重排序
- 分类/标签多选筛选与收藏置顶、最近使用排序
- 分享链接（带当前勾选状态的只读视图）与打印/导出 Markdown
- SOP 内容外置（YAML/Markdown Frontmatter），引入解析器统一渲染

## 目录结构（相关）
- `src/sops/types.ts`：类型定义
- `src/sops/data.ts`：SOP 数据样例
- `src/sops/SopDetailPage.tsx`：详情页
- `src/workflows/HomePage.tsx`：主页（SOP 列表）
- `src/hooks/useLocalStorage.ts` / `src/hooks/useSopProgress.ts`：本地持久化与进度管理