import type { Sop } from '../types';

const sop: Sop = {
  id: 'quick-research',
  title: '快速调研（60-90min）',
  category: '学习',
  tags: ['调研', '学习'],
  summary: '明确问题-收集材料-归纳对比-得出建议。',
  estimatedMinutes: 75,
  steps: [
    { id: 's1', title: '明确核心问题与范围', required: true },
    { id: 's2', title: '搜索与筛选3-5个高质量来源', required: true },
    { id: 's3', title: '要点摘录与结构化记录', required: true },
    { id: 's4', title: '横向对比与结论', required: true },
    { id: 's5', title: '输出行动建议与下一步', required: true },
  ],
};

export default sop;