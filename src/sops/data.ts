import type { Sop } from './types';

const modules = import.meta.glob('./items/*.ts', { eager: true }) as Record<string, { default: Sop }>;

export const SOPS: Sop[] = Object.values(modules).map((m) => m.default);