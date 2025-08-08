import { useParams, Link } from 'react-router-dom';
import { SOPS } from './data';
import type { ChoiceStep, Sop } from './types';
import { useSopProgress } from '../hooks/useSopProgress';
import { useMemo, useState } from 'react';

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div>
      <div className="w-full h-2 bg-primary-200">
        <div className="h-2 bg-accent-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export default function SopDetailPage() {
  const { id } = useParams<{ id: string }>();
  const sop = useMemo(() => SOPS.find((s) => s.id === id), [id]);

  if (!sop) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white border border-primary-200 p-6">
          <h1 className="text-xl font-semibold mb-2">未找到SOP</h1>
          <p className="text-primary-600 mb-4">请返回列表选择其他SOP。</p>
          <Link to="/" className="text-accent-600">← 返回SOP列表</Link>
        </div>
      </div>
    );
  }

  return <SopDetail sop={sop} />;
}

function SopDetail({ sop }: { sop: Sop }) {
  const { progress, toggleCheck, setChoice, setNote, reset, toggleFavorite, compute } = useSopProgress(sop.id);
  const stats = compute(sop);
  const [showAllTips, setShowAllTips] = useState<boolean>(true);

  const handleStepContainerClick = (e: React.MouseEvent, stepId: string) => {
    const target = e.target as HTMLElement;
    // Ignore clicks originating from interactive elements
    if (
      target.closest('a, button, input, textarea, select, label') ||
      (target as HTMLElement).getAttribute('contenteditable') === 'true'
    ) {
      return;
    }
    toggleCheck(stepId);
  };

  const handleKeyToggle = (e: React.KeyboardEvent, stepId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleCheck(stepId);
    }
  };

  const copyToClipboard = async (text: string) => {
    try { await navigator.clipboard.writeText(text); } catch {}
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-sm text-primary-500">{sop.category}</div>
            <h1 className="text-2xl font-bold text-primary-900">{sop.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {sop.tutorialUrl && (
              <a
                href={sop.tutorialUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 border border-accent-500 text-accent-600 bg-white"
              >教程</a>
            )}
            <button onClick={toggleFavorite} className={`px-3 py-1 border ${progress.favorited ? 'border-accent-500 text-accent-600' : 'border-primary-300 text-primary-600'} bg-white`}>{progress.favorited ? '★ 已收藏' : '☆ 收藏'}</button>
            <button onClick={reset} className="px-3 py-1 border border-primary-300 text-primary-600 bg-white">重置</button>
            <Link to="/" className="px-3 py-1 border border-primary-300 text-primary-600 bg-white">返回</Link>
          </div>
        </div>
        <p className="text-primary-600">{sop.summary}</p>
        <div className="text-xs text-primary-500 mt-1">预计时长：约 {sop.estimatedMinutes ?? '-'} 分钟</div>
      </div>

      {/* Progress */}
      <div className="bg-white border border-primary-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-primary-700">完成进度（必选）：{stats.requiredDone}/{stats.requiredTotal} · {stats.percent}%</div>
          <div className="text-xs text-primary-500">可选：{stats.optionalDone}/{stats.optionalTotal}</div>
        </div>
        <div className="mt-2"><ProgressBar percent={stats.percent} /></div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => setShowAllTips((v) => !v)} className="px-3 py-1 border border-primary-300 text-primary-600 bg-white">
          {showAllTips ? '折叠提示' : '展开提示'}
        </button>
      </div>

      {/* Steps - Full view */}
      <div className="space-y-4">
        {sop.steps.map((step, idx) => (
          <div key={step.id} className="bg-white border border-primary-200">
            <div
              className="px-4 py-3 flex items-start gap-3 cursor-pointer"
              onClick={(e) => handleStepContainerClick(e, step.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => handleKeyToggle(e, step.id)}
              aria-pressed={Boolean(progress.checked[step.id])}
            >
              <input
                id={`${sop.id}-${step.id}-checkbox`}
                type="checkbox"
                checked={Boolean(progress.checked[step.id])}
                onChange={() => toggleCheck(step.id)}
                className="mt-1 w-4 h-4 border-primary-300"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="text-xs text-primary-500">{idx + 1}</div>
                  <label htmlFor={`${sop.id}-${step.id}-checkbox`} className="text-primary-900 font-medium hover:text-accent-600">
                    {step.title}
                  </label>
                  {step.required === false && <span className="text-xs text-primary-500">(可选)</span>}
                </div>
                {step.tip && showAllTips && (
                  <div className="text-sm text-primary-600 mt-1">{step.tip}</div>
                )}
                {step.links && step.links.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {step.links.map((l) => (
                      <div key={l.url} className="flex items-center gap-2">
                        <a href={l.url} target="_blank" rel="noreferrer" className="text-xs text-accent-600 underline">
                          {l.text}
                        </a>
                        <button
                          className="text-xs px-2 py-0.5 border border-primary-300 text-primary-600 bg-white"
                          onClick={(e) => { e.stopPropagation(); copyToClipboard(l.url); }}
                        >复制链接</button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Copy helpers */}
                {step.copyText && (
                  <div className="mt-2">
                    <textarea readOnly value={step.copyText} rows={3} className="w-full px-3 py-2 border border-primary-200 bg-primary-50 text-sm" />
                    <button
                      className="mt-2 text-xs px-2 py-1 border border-primary-300 text-primary-600 bg-white"
                      onClick={(e) => { e.stopPropagation(); copyToClipboard(step.copyText!); }}
                    >复制</button>
                  </div>
                )}
                {step.copyItems && step.copyItems.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {step.copyItems.map((ci, i) => (
                      <div key={`${step.id}-ci-${i}`} className="flex items-center justify-between gap-3">
                        <div className="text-sm text-primary-700">{ci.label}</div>
                        <button
                          className="text-xs px-2 py-1 border border-primary-300 text-primary-600 bg-white"
                          onClick={(e) => { e.stopPropagation(); copyToClipboard(ci.value); }}
                        >复制</button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Choice step */}
                {'type' in step && step.type === 'choice' && (
                  <div className="mt-2">
                    {(step as ChoiceStep).options.map((opt) => (
                      <label key={opt} className="mr-4 text-sm text-primary-700">
                        <input
                          type="radio"
                          name={`${sop.id}-${step.id}`}
                          className="mr-1"
                          checked={progress.choices[step.id] === opt}
                          onChange={() => setChoice(step.id, opt)}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                )}

                {/* Notes */}
                <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                  <textarea
                    placeholder="备注...（可选）"
                    className="w-full px-3 py-2 border border-primary-200 bg-primary-50 focus:bg-white focus:border-accent-500 outline-none text-sm"
                    rows={2}
                    value={progress.notes[step.id] ?? ''}
                    onChange={(e) => setNote(step.id, e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}