import { useCallback } from 'react';

// Re-using a simplified FileDialogOptions type. For a real app, this might be imported from a shared types file.
interface FileDialogOptions {
  title?: string;
  defaultPath?: string;
  buttonLabel?: string;
  filters?: Array<{ name: string; extensions: string[] }>;
  properties?: Array<'openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' | 'createDirectory' | 'promptToCreate' | 'noResolveAliases' | 'treatPackageAsDirectory' | 'dontAddToRecent'>;
}

interface DirectoryDialogOptions {
  title?: string;
  defaultPath?: string;
  buttonLabel?: string;
  properties?: Array<'openDirectory' | 'createDirectory' | 'promptToCreate'>;
}

const useLocalFiles = () => {
  const isElectron = window.mapLocalApi && typeof window.mapLocalApi.selectFile === 'function';

  const selectFilePath = useCallback(async (options?: FileDialogOptions): Promise<string | null> => {
    if (isElectron && window.mapLocalApi?.selectFile) {
      try {
        const filePath = await window.mapLocalApi.selectFile(options);
        return filePath;
      } catch (error) {
        console.error('Error selecting file:', error);
        alert(`文件选择失败: ${error instanceof Error ? error.message : String(error)}`);
        return null;
      }
    } else {
      alert('文件选择功能仅在本地版应用中可用。');
      console.warn('selectFile API not available.');
      return null;
    }
  }, [isElectron]);

  const readFileContent = useCallback(async (filePath: string): Promise<string | null> => {
    if (isElectron && window.mapLocalApi?.readFile) {
      if (!filePath) {
        alert('未提供文件路径。');
        return null;
      }
      try {
        const content = await window.mapLocalApi.readFile(filePath);
        return content;
      } catch (error) {
        console.error('Error reading file:', error);
        alert(`文件读取失败: ${error instanceof Error ? error.message : String(error)}`);
        return null;
      }
    } else {
      alert('文件读取功能仅在本地版应用中可用。');
      console.warn('readFile API not available.');
      return null;
    }
  }, [isElectron]);

  const selectFileAndReadContent = useCallback(async (options?: FileDialogOptions): Promise<{filePath: string, content: string} | null> => {
    const filePath = await selectFilePath(options);
    if (filePath) {
      const content = await readFileContent(filePath);
      if (content !== null) {
        return { filePath, content };
      }
    }
    return null;
  }, [selectFilePath, readFileContent]);

  const selectDirectoryPath = useCallback(async (options?: DirectoryDialogOptions): Promise<string | null> => {
    if (isElectron && window.mapLocalApi?.selectDirectory) {
      try {
        const dirPath = await window.mapLocalApi.selectDirectory(options);
        return dirPath;
      } catch (error) {
        console.error('Error selecting directory:', error);
        alert(`目录选择失败: ${error instanceof Error ? error.message : String(error)}`);
        return null;
      }
    } else {
      alert('目录选择功能仅在本地版应用中可用。');
      console.warn('selectDirectory API not available.');
      return null;
    }
  }, [isElectron]);

  return {
    isElectron,
    selectFilePath,
    readFileContent,
    selectFileAndReadContent,
    selectDirectoryPath,
  };
};

export default useLocalFiles; 