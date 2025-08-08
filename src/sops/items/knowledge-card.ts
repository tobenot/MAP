import type { Sop } from '../types';

const sop: Sop = {
  id: 'knowledge-card',
  title: '知识卡片（15-30min）',
  category: '写作',
  tags: ['学习', '输出'],
  summary: '把零散笔记固化为结构化卡片，方便复用与分享。',
  estimatedMinutes: 20,
  steps: [
    { id: 's1', title: '选主题与应用场景', required: true },
    { id: 's2', title: '三点式要点（是什么/为什么/怎么做）', required: true },
    { id: 's3', title: '例子或小练习', required: false },
    { id: 's4', title: '相关链接与参考', required: false },
    { id: 's5', title: '复查可读性（删除噪音）', required: true },
  ],
};

export default sop;