export type StepLink = {
  text: string;
  url: string;
};

export type SopStepBase = {
  id: string;
  title: string;
  tip?: string;
  required?: boolean; // default true
  links?: StepLink[];
  // Optional copy helpers for this step
  copyText?: string; // Single copyable text, e.g., a prompt template
  copyItems?: { label: string; value: string }[]; // Multiple copy targets
};

export type ChoiceStep = SopStepBase & {
  type: 'choice';
  options: string[];
};

export type SimpleStep = SopStepBase & {
  type?: 'simple';
};

export type SopStep = SimpleStep | ChoiceStep;

export interface Sop {
  id: string;
  title: string;
  category: string;
  tags: string[];
  summary: string;
  estimatedMinutes?: number;
  // Optional tutorial/guide url for this SOP
  tutorialUrl?: string;
  steps: SopStep[];
}