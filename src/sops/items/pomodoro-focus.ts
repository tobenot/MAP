import type { Sop } from '../types';

const sop: Sop = {
  id: 'pomodoro-focus',
  title: '番茄专注（25+5）',
  category: '专注',
  tags: ['效率', '专注'],
  summary: '一轮25分钟深度工作+5分钟休息，简单可复用。',
  estimatedMinutes: 30,
  steps: [
    { id: 's1', title: '明确本轮目标（可量化）', required: true },
    { id: 's2', title: '关通知与无关页面', required: true },
    { id: 's3', title: '启动25分钟计时', required: true },
    { id: 's4', title: '记录分心/阻碍（不行动）', required: false },
    { id: 's5', title: '休息5分钟（走动/喝水/拉伸）', required: true },
  ],
};

export default sop;