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
  steps: SopStep[];
}