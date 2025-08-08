import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { SOPS } from '../sops/data';
import type { Sop } from '../sops/types';

function getProgressPercent(sop: Sop): number {
  try {
    const raw = localStorage.getItem(`sop:${sop.id}:progress`);
    if (!raw) return 0;
    const data = JSON.parse(raw) as { checked: Record<string, boolean> };
    const requiredTotal = sop.steps.filter((s) => s.required !== false).length;
    const requiredDone = sop.steps.filter((s) => s.required !== false && data.checked?.[s.id]).length;
    return requiredTotal === 0 ? 100 : Math.round((requiredDone / requiredTotal) * 100);
  } catch {
    return 0;
  }
}

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('全部');
  const categories = useMemo(() => ['全部', ...Array.from(new Set(SOPS.map((s) => s.category)))], []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SOPS.filter((s) =>
      (category === '全部' || s.category === category) &&
      (q === '' || s.title.toLowerCase().includes(q) || s.summary.toLowerCase().includes(q) || s.tags.join(' ').toLowerCase().includes(q))
    );
  }, [query, category]);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary-900 mb-2">SOP 库 · 个人机械飞升程序</h1>
        <p className="text-primary-600">全览展示与流动进度，按需挑选合适的SOP启动。</p>
      </div>

      {/* Controls */}
      <div className="bg-white border border-primary-200 p-4 mb-6 grid md:grid-cols-3 gap-4 items-center">
        <input
          type="text"
          placeholder="搜索标题/标签/简介..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="md:col-span-2 w-full px-3 py-2 border border-primary-200 bg-primary-50 focus:bg-white focus:border-accent-500 outline-none"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-primary-200 bg-primary-50 focus:bg-white focus:border-accent-500 outline-none"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* SOP Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {filtered.map((sop) => (
          <Link key={sop.id} to={`/sop/${sop.id}`} className="block group">
            <div className="bg-white border border-primary-200 p-5 hover:border-accent-300 hover:shadow-md transition-all h-full">
              <div className="flex items-start justify-between mb-2">
                <div className="text-sm text-primary-500">{sop.category}</div>
                <div className="text-xs text-primary-500">约 {sop.estimatedMinutes ?? '-'} 分钟</div>
              </div>
              <h3 className="text-lg font-semibold text-primary-900 group-hover:text-accent-600">{sop.title}</h3>
              <p className="text-primary-600 text-sm mt-1">{sop.summary}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {sop.tags.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 bg-primary-100 text-primary-700">#{t}</span>
                ))}
                {sop.tutorialUrl && (
                  <span className="ml-auto text-[11px] px-2 py-0.5 border border-accent-400 text-accent-600 bg-white">含教程</span>
                )}
              </div>
              {/* Progress */}
              <div className="mt-4">
                <div className="w-full h-2 bg-primary-200">
                  <div className="h-2 bg-accent-500" style={{ width: `${getProgressPercent(sop)}%` }} />
                </div>
                <div className="text-xs text-primary-500 mt-1">进度 {getProgressPercent(sop)}%</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 