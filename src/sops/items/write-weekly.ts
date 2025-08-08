import type { Sop } from '../types';

const sop: Sop = {
  id: 'write-weekly',
  title: '写周报（15-30min）',
  category: '写作',
  tags: ['工作', '输出', '写作'],
  summary: '快速产出一版可读周报，聚焦成果与影响。',
  estimatedMinutes: 20,
  steps: [
    { id: 's1', title: '列成果要点（3-5条，用动词+影响）', required: true },
    { id: 's2', title: '选结构', type: 'choice', options: ['按项目', '目标/本周/下周/风险'], required: true },
    { id: 's3', title: '充实数据与链接', tip: 'Jira/PR/指标截图，控制信息密度', links: [{ text: 'Jira/PR记录', url: 'https://example.com' }], required: false },
    { id: 's4', title: '写下周计划与风险', required: true },
    { id: 's5', title: '自检与润色', tip: '删无用细节，突出影响', required: true },
  ],
};

export default sop;