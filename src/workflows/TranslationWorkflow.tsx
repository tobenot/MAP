import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useAppStore } from '../stores/appStore';
import CopyButton from '../components/CopyButton';

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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-6 h-6 bg-accent-500 flex items-center justify-center">
            <div className="w-3 h-3 bg-white transform rotate-45"></div>
          </div>
          <h1 className="text-2xl font-bold text-primary-900">翻译工作流</h1>
        </div>
        <p className="text-primary-600">高效的多语言文本翻译处理系统</p>
      </div>
      
      {/* Main Form */}
      <div className="bg-white border border-primary-200 mb-6">
        <div className="border-b border-primary-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-primary-900 flex items-center">
            <div className="w-2 h-2 bg-accent-500 mr-3"></div>
            翻译配置
          </h2>
        </div>
        
        <form className="p-6 space-y-6">
          {/* Source Text Input */}
          <div className="space-y-2">
            <label htmlFor="sourceText" className="block text-sm font-medium text-primary-900">
              源文本
            </label>
            <textarea
              id="sourceText"
              value={sourceText}
              onChange={handleSourceTextChange}
              rows={6}
              className="w-full px-4 py-3 border border-primary-200 bg-primary-50 text-primary-900 placeholder-primary-500 focus:outline-none focus:border-accent-500 focus:bg-white transition-colors"
              placeholder="在此输入需要翻译的文本..."
            />
            <div className="text-xs text-primary-500 font-mono">
              字符数: {sourceText.length}
            </div>
          </div>

          {/* Target Language Selection */}
          <div className="space-y-2">
            <label htmlFor="targetLanguage" className="block text-sm font-medium text-primary-900">
              目标语言
            </label>
            <select
              id="targetLanguage"
              value={targetLanguage}
              onChange={handleTargetLanguageChange}
              className="w-full px-4 py-3 border border-primary-200 bg-white text-primary-900 focus:outline-none focus:border-accent-500 transition-colors"
            >
              {supportedLanguages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              onClick={handleApiTranslate}
              disabled={isLoading || !sourceText.trim()}
              className="flex-1 bg-accent-500 hover:bg-accent-600 disabled:bg-primary-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  翻译处理中...
                </span>
              ) : (
                'API 快速翻译'
              )}
            </button>
            <button
              type="button"
              onClick={handleGenerateManualPrompt}
              disabled={!sourceText.trim()}
              className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              生成提示词
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {translationResult && (
          <div className="bg-white border border-primary-200 animate-slide-up">
            <div className="border-b border-primary-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-primary-900 flex items-center">
                <div className="w-2 h-2 bg-success-500 mr-3"></div>
                翻译结果
              </h3>
            </div>
            <div className="p-6">
              <div className="bg-primary-50 border-l-4 border-success-500 p-4">
                <p className="text-primary-900 whitespace-pre-wrap leading-relaxed">
                  {translationResult}
                </p>
              </div>
              <div className="mt-4">
                <CopyButton text={translationResult} label="复制结果" copiedLabel="已复制" className="border-success-500 text-success-700" />
              </div>
            </div>
          </div>
        )}

        {manualPrompt && (
          <div className="bg-white border border-primary-200 animate-slide-up">
            <div className="border-b border-primary-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-primary-900 flex items-center">
                <div className="w-2 h-2 bg-accent-500 mr-3"></div>
                手动翻译提示词
              </h3>
            </div>
            <div className="p-6">
              <textarea
                readOnly
                value={manualPrompt}
                rows={6}
                className="w-full px-4 py-3 border border-accent-200 bg-accent-50 text-accent-900 font-mono text-sm focus:outline-none"
              />
              <div className="flex space-x-3 mt-4">
                <CopyButton text={manualPrompt} label="复制提示词" copiedLabel="已复制" />
                <button 
                  onClick={() => setManualPrompt('')}
                  className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  清除
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 