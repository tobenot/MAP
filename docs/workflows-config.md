# 工作流配置与拆分指南

本项目支持通过“工作流注册表 + 动态路由”的方式，将工作流组件拆分到多个文件（可扩展至数百个）。同时提供统一的复制组件，便于为网址、提示词、备注等添加一键复制。

## 一、快速上手：新增一个工作流

1. 在 `src/workflows/` 下创建你的工作流组件文件，例如：`MyNewWorkflow.tsx`
   - 导出默认 React 组件：
   ```tsx
   import { useState } from 'react';

   export default function MyNewWorkflow() {
     const [text, setText] = useState('');
     return (
       <div className="max-w-4xl mx-auto p-6 bg-white border">
         <h1 className="text-2xl font-bold mb-4">我的新工作流</h1>
         <textarea value={text} onChange={e => setText(e.target.value)} className="w-full border p-2" rows={6} />
       </div>
     );
   }
   ```

2. 在 `src/workflows/registry.ts` 注册该工作流（支持懒加载）：
   ```ts
   import { lazy } from 'react';
   import type { WorkflowMeta } from './registry';

   export const WORKFLOWS: WorkflowMeta[] = [
     // ...已有项
     {
       path: '/my-new-workflow',
       title: '我的新工作流',
       description: '说明文字（可选）',
       component: lazy(() => import('./MyNewWorkflow')),
       showInNav: true, // 顶部导航显示入口（可选）
     },
   ];
   ```
   - 完成后，页面将自动生成路由 `/my-new-workflow`，并在顶部导航显示（若 `showInNav: true`）。

3. 运行：
   - `npm run dev` 本地开发
   - `npm run build && npm run preview` 构建与预览

## 二、为什么可以“分到几百个文件”？

- `registry.ts` 采用 `lazy(() => import('./YourWorkflow'))` 懒加载模式，仅在访问时加载对应工作流。
- `App.tsx` 会自动根据注册表生成路由，不需要手动添加 `Route`。
- 顶部导航通过注册表控制显示项，便于分门别类与收纳。

## 三、统一复制按钮：`CopyButton`

- 位置：`src/components/CopyButton.tsx`
- 用法：
  ```tsx
  import CopyButton from '../components/CopyButton';

  <CopyButton text={toCopy} label="复制内容" copiedLabel="已复制" />
  ```
- 特性：
  - 调用 `navigator.clipboard.writeText`
  - 自动显示“已复制”状态 1.5 秒
  - 可自定义样式 `className`

## 四、SOP 详情页的复制支持

- 在 `SopDetailPage` 中：
  - 步骤 `tip`（提示/示例）支持一键复制
  - `links` 每个网址旁提供“复制链接”按钮
  - `notes`（备注）右上角提供“复制备注”按钮
- 勾选交互优化：
  - 整个步骤行（除输入/按钮/链接等交互元素外）可点击切换复选框，扩大命中范围。

## 五、设计规范与建议

- 每个工作流组件自包含其 UI/状态；复用 UI（复制、表单控件）尽量抽到 `src/components/`
- 将体量较大的工作流进一步拆分：
  - 例如 `novel-writer/` 目录下拆 `OperationList.tsx`、`ActionPanel.tsx` 等，再由入口组件汇总
- 如果工作流需要共享逻辑（hooks、工具函数），放在 `src/hooks/`、`src/utils/`

## 六、导航与分类

- `WORKFLOWS` 中的 `title`、`description` 可用于后续“工作流列表页/搜索”
- 顶部导航仅展示 `showInNav: true` 的工作流；其他工作流可通过直接路由访问或从首页进入

## 七、常见问题

- 添加工作流后路由 404？
  - 确认 `path` 以 `/` 开头，且在 `WORKFLOWS` 中已加入
  - 组件导出为默认导出，且文件路径与 `lazy(() => import(...))` 一致
- 复制按钮无效？
  - 浏览器需支持 `navigator.clipboard`（现代浏览器均支持；若在非安全上下文，可能受限）

如需更强的模板化与批量脚手架，我们可后续加入工作流生成 CLI（例如 `npm run gen:workflow my-new-workflow`）。