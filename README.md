# MAP · 个人机械飞升程序

一个轻量的「个人效率 SOP 库」网站：当你想做某件事时，打开对应 SOP，看到完整步骤清单与提示，一边执行一边勾选，实时查看进度。支持搜索、分类与收藏。

## 功能特性（MVP）
- 全览展示：SOP 详情页一次性展示全部步骤，不强制逐步点击。
- 流动进度：必选步骤完成度（百分比）+ 可选步骤计数。
- 搜索与分类：首页可按关键字搜索、按分类筛选，卡片显示预估时长与标签。
- 本地持久化：进度、选择与备注存储在 LocalStorage，自动恢复。

## 目录结构（核心）
- `src/sops/types.ts`：SOP/步骤类型定义
- `src/sops/data.ts`：内置 SOP 数据（可扩展）
- `src/sops/SopDetailPage.tsx`：SOP 详情页（全览+进度）
- `src/workflows/HomePage.tsx`：首页（SOP 列表/搜索/分类）
- `src/hooks/useLocalStorage.ts` / `src/hooks/useSopProgress.ts`：LocalStorage 与进度计算

## 开发与运行
```bash
# 安装依赖（若未安装）
npm install

# 开发模式
yarn dev # 或 npm run dev / pnpm dev

# 构建
npm run build

# 预览构建
npm run preview
```

访问地址（开发默认）：`http://localhost:5173`

## 如何新增一个 SOP
1. 打开 `src/sops/data.ts`
2. 参照现有条目，新增一个对象：
   - `id`：唯一标识（用于路由与本地存储）
   - `title`、`category`、`tags[]`、`summary`、`estimatedMinutes`
   - `steps[]`：每步包含 `id`、`title`、可选 `tip`、`required`（默认true）；如为选择题类型，设置 `type: 'choice'` 和 `options[]`
3. 保存后自动出现在首页列表，并可通过 `/sop/:id` 访问详情。

## 设计文档
详见 `docs/design.md`

## 许可证
MIT
