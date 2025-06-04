import { create } from 'zustand';

// 定义状态的类型
interface AppState {
  // 示例状态：当前运行环境 (electron, web)
  environment: 'electron' | 'web';
  setEnvironment: (env: 'electron' | 'web') => void;

  // 示例状态：当前激活的工作流
  activeWorkflow: string | null;
  setActiveWorkflow: (workflow: string | null) => void;

  // 示例状态：用户偏好设置
  userPreferences: {
    theme: 'light' | 'dark';
    language: string;
  };
  setUserPreferences: (prefs: Partial<AppState['userPreferences']>) => void;
}

// 创建 store
export const useAppStore = create<AppState>((set) => ({
  environment: typeof window !== 'undefined' && window.mapLocalApi ? 'electron' : 'web',
  setEnvironment: (env) => set({ environment: env }),

  activeWorkflow: null,
  setActiveWorkflow: (workflow) => set({ activeWorkflow: workflow }),

  userPreferences: {
    theme: 'dark', // 默认主题
    language: 'zh-CN', // 默认语言
  },
  setUserPreferences: (prefs) =>
    set((state) => ({
      userPreferences: { ...state.userPreferences, ...prefs },
    })),
}));

// (可选) 导出类型，方便在组件中使用
export type { AppState }; 