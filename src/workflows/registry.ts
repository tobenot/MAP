import React, { lazy } from 'react';
import type { LazyExoticComponent } from 'react';

export type WorkflowMeta = {
  path: string; // route path, e.g., "/translate"
  title: string; // display name
  description?: string;
  component: LazyExoticComponent<() => React.ReactElement>;
  showInNav?: boolean; // whether to show in top nav
};

export const WORKFLOWS: WorkflowMeta[] = [
  {
    path: '/translate',
    title: '翻译工作流',
    description: '高效的多语言文本翻译处理',
    component: lazy(() => import('./TranslationWorkflow')),
    showInNav: true,
  },
  {
    path: '/novel-writer',
    title: '小说写作',
    description: '迭代式创作与提示词引导',
    component: lazy(() => import('./NovelWriterWorkflow')),
    showInNav: true,
  },
];