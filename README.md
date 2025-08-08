# MAP · 个人机械飞升程序

一个轻量的「个人效率 SOP 库」网站：当你想做某件事时，打开对应 SOP，看到完整步骤清单与提示，一边执行一边勾选，实时查看进度。支持搜索、分类与收藏。

## 功能特性（MVP）
- 全览展示：SOP 详情页一次性展示全部步骤，不强制逐步点击。
- 流动进度：必选步骤完成度（百分比）+ 可选步骤计数。
- 搜索与分类：首页可按关键字搜索、按分类筛选，卡片显示预估时长与标签。

## 目录结构（核心）
- `src/sops/types.ts`：SOP/步骤类型定义
- `src/sops/items/*.ts`：内置 SOP 数据（每个文件一个 SOP）
- `src/sops/data.ts`：自动聚合所有 SOP 项
- `src/sops/SopDetailPage.tsx`：SOP 详情页（全览+进度）
- `src/workflows/HomePage.tsx`：首页（SOP 列表/搜索/分类）
- `src/hooks/useLocalStorage.ts` / `src/hooks/useSopProgress.ts`：LocalStorage 与进度计算

## 开发与运行

- 安装依赖：`npm i`
- 本地开发：`npm run dev`
- 构建产物：`npm run build`
- 预览构建：`npm run preview`

访问地址（开发默认）：`http://localhost:5173`

## 如何新增一个 SOP
1. 在 `src/sops/items/` 新建一个文件，例如 `my-sop.ts`
2. 导出一个 `Sop` 对象作为默认导出：

```ts
import type { Sop } from '../types';

const sop: Sop = {
  id: 'my-sop',
  title: '我的 SOP',
  category: '分类',
  tags: ['标签A', '标签B'],
  summary: '一句话简介',
  estimatedMinutes: 30,
  steps: [
    { id: 's1', title: '第一步', required: true },
  ],
};

export default sop;
```
3. 保存后会被 `src/sops/data.ts` 自动聚合，自动出现在首页列表，并可通过 `/sop/:id` 访问详情。

## 设计文档

详见 `docs/` 目录。

## 许可证
MIT
