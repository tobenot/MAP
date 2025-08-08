import type { Sop } from '../types';

const sop: Sop = {
  id: 'meeting-retro',
  title: '会议复盘（10-20min）',
  category: '会议',
  tags: ['复盘', '沟通'],
  summary: '从事实-感受-改进出发，沉淀可执行改进点。',
  estimatedMinutes: 15,
  steps: [
    { id: 's1', title: '还原事实（目标/过程/结果）', required: true },
    { id: 's2', title: '记录亮点与不足', required: true },
    { id: 's3', title: '提炼1-3条改进措施', required: true },
    { id: 's4', title: '确定责任人与跟进时间', required: true },
    { id: 's5', title: '分享复盘纪要', required: false },
  ],
};

export default sop;