import type { Sop } from '../types';

const sop: Sop = {
  id: 'weekly-plan',
  title: '周计划（30-45min）',
  category: '规划',
  tags: ['计划', '时间管理'],
  summary: '从目标出发，聚焦关键结果与时间块。',
  estimatedMinutes: 40,
  steps: [
    { id: 's1', title: '回顾上周：完成/未完成/原因', required: true },
    { id: 's2', title: '设定本周3个关键结果', required: true },
    { id: 's3', title: '时间块安排（日历化）', required: true },
    { id: 's4', title: '识别风险与缓冲', required: false },
    { id: 's5', title: '第一天起手任务', required: true },
  ],
};

export default sop;