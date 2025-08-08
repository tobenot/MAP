import { useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Sop } from '../sops/types';

export interface SopProgress {
  checked: Record<string, boolean>;
  choices: Record<string, string>;
  notes: Record<string, string>;
  favorited?: boolean;
}

export function useSopProgress(sopId: string) {
  const [progress, setProgress] = useLocalStorage<SopProgress>(`sop:${sopId}:progress`, {
    checked: {},
    choices: {},
    notes: {},
    favorited: false,
  });

  const toggleCheck = (stepId: string) => {
    setProgress((prev) => ({
      ...prev,
      checked: { ...prev.checked, [stepId]: !prev.checked[stepId] },
    }));
  };

  const setChoice = (stepId: string, value: string) => {
    setProgress((prev) => ({
      ...prev,
      choices: { ...prev.choices, [stepId]: value },
    }));
  };

  const setNote = (stepId: string, note: string) => {
    setProgress((prev) => ({
      ...prev,
      notes: { ...prev.notes, [stepId]: note },
    }));
  };

  const reset = () => {
    setProgress((prev) => ({ checked: {}, choices: {}, notes: {}, favorited: prev.favorited }));
  };

  const toggleFavorite = () => {
    setProgress((prev) => ({ ...prev, favorited: !prev.favorited }));
  };

  const compute = useMemo(
    () => (sop: Sop) => {
      const requiredTotal = sop.steps.filter((s) => s.required !== false).length;
      const requiredDone = sop.steps.filter((s) => s.required !== false && progress.checked[s.id]).length;
      const optionalTotal = sop.steps.filter((s) => s.required === false).length;
      const optionalDone = sop.steps.filter((s) => s.required === false && progress.checked[s.id]).length;
      const percent = requiredTotal === 0 ? 100 : Math.round((requiredDone / requiredTotal) * 100);
      return { requiredDone, requiredTotal, optionalDone, optionalTotal, percent };
    },
    [progress.checked]
  );

  return { progress, setProgress, toggleCheck, setChoice, setNote, reset, toggleFavorite, compute };
}