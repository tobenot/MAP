/// <reference types="vite/client" />

// 扩展 Window 接口以包含自定义的 mapLocalApi
interface Window {
  mapLocalApi?: {
    // 这里可以根据实际暴露的函数来定义更具体的类型
    // 例如：
    // send: (channel: string, data: any) => void;
    // invoke: (channel: string, ...args: any[]) => Promise<any>;
    // on: (channel: string, func: (...args: any[]) => void) => (() => void) | undefined;
    [key: string]: any; // 允许任意其他属性，方便初期开发
    getEnvironment: () => 'electron' | 'web';
    // Add other general utility functions if needed

    // File System Operations
    selectFile: (options?: FileDialogOptions) => Promise<string | null>;
    readFile: (filePath: string) => Promise<string>; // Consider returning { content: string } or { error?: string, content?: string }
    selectDirectory: (options?: DirectoryDialogOptions) => Promise<string | null>;
    // Potentially: writeFile, listDirectory, etc. in the future
  };
}

// Options for file selection dialog
interface FileDialogOptions {
  title?: string;
  defaultPath?: string;
  buttonLabel?: string;
  filters?: Array<{ name: string; extensions: string[] }>;
  properties?: Array<'openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' | 'createDirectory' | 'promptToCreate' | 'noResolveAliases' | 'treatPackageAsDirectory' | 'dontAddToRecent'>;
}

// Options for directory selection dialog
interface DirectoryDialogOptions {
  title?: string;
  defaultPath?: string;
  buttonLabel?: string;
  properties?: Array<'openDirectory' | 'createDirectory' | 'promptToCreate'>; // Simplified for directory
}
