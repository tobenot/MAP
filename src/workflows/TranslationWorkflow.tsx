import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useAppStore } from '../stores/appStore';

// 假设支持的语言列表
const supportedLanguages = [
  { code: 'en', name: '英语' },
  { code: 'zh-CN', name: '简体中文' },
  { code: 'ja', name: '日语' },
  { code: 'ko', name: '韩语' },
  { code: 'fr', name: '法语' },
  { code: 'es', name: '西班牙语' },
  { code: 'de', name: '德语' },
  // 可以根据需要添加更多语言
];

export default function TranslationWorkflow() {
  const environment = useAppStore((state) => state.environment);

  const [sourceText, setSourceText] = useState<string>('');
  const [targetLanguage, setTargetLanguage] = useState<string>(supportedLanguages[0].code); // 默认目标语言
  const [translationResult, setTranslationResult] = useState<string>('');
  const [manualPrompt, setManualPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSourceTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setSourceText(event.target.value);
  };

  const handleTargetLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setTargetLanguage(event.target.value);
  };

  const handleApiTranslate = async (event: FormEvent) => {
    event.preventDefault();
    if (!sourceText.trim()) {
      alert('请输入要翻译的文本。');
      return;
    }
    setIsLoading(true);
    setTranslationResult('');
    setManualPrompt('');

    console.log(`环境: ${environment}, 文本: ${sourceText}, 目标语言: ${targetLanguage}`);

    try {
      // TODO: 实现 API 调用逻辑
      // Electron版: 调用 mapLocalApi.translateViaApi(sourceText, targetLanguage)
      // Web版: 调用 Serverless Function 或提示用户输入API Key
      await new Promise(resolve => setTimeout(resolve, 1500)); // 模拟API延迟
      setTranslationResult(`[模拟API结果] ${sourceText} (${targetLanguage})`);
    } catch (error) {
      console.error('API翻译错误:', error);
      setTranslationResult('翻译失败，请查看控制台。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateManualPrompt = (event: FormEvent) => {
    event.preventDefault();
    if (!sourceText.trim()) {
      alert('请输入要翻译的文本。');
      return;
    }
    setTranslationResult('');
    const prompt = `请将以下文本翻译成"${supportedLanguages.find(l => l.code === targetLanguage)?.name || targetLanguage}"：\n\n"${sourceText}"`;
    setManualPrompt(prompt);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">翻译工作流</h2>
      
      <form>
        <div className="mb-4">
          <label htmlFor="sourceText" className="block text-sm font-medium text-gray-700 mb-1">输入待翻译文本:</label>
          <textarea
            id="sourceText"
            value={sourceText}
            onChange={handleSourceTextChange}
            rows={5}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="在此输入文本..."
          />
        </div>

        <div className="mb-6">
          <label htmlFor="targetLanguage" className="block text-sm font-medium text-gray-700 mb-1">选择目标语言:</label>
          <select
            id="targetLanguage"
            value={targetLanguage}
            onChange={handleTargetLanguageChange}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          >
            {supportedLanguages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
          <button
            type="button" // 改为 type="button" 如果不想它触发表单默认提交，或者在外部form处理
            onClick={handleApiTranslate} // 改为 onClick 如果按钮不在 form 内或者 type="button"
            disabled={isLoading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
          >
            {isLoading ? '翻译中...' : 'API 快速翻译'}
          </button>
          <button
            type="button"
            onClick={handleGenerateManualPrompt}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out"
          >
            生成手动翻译提示词
          </button>
        </div>
      </form>

      {translationResult && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">翻译结果:</h3>
          <p className="text-gray-800 whitespace-pre-wrap">{translationResult}</p>
        </div>
      )}

      {manualPrompt && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">手动翻译提示词:</h3>
          <textarea
            readOnly
            value={manualPrompt}
            rows={5}
            className="w-full p-2 border border-blue-300 rounded-md bg-blue-50 text-blue-800 focus:ring-blue-500 focus:border-blue-500"
          />
          <button 
            onClick={() => navigator.clipboard.writeText(manualPrompt)}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-md text-sm transition duration-150 ease-in-out"
          >
            复制提示词
          </button>
        </div>
      )}
    </div>
  );
} 