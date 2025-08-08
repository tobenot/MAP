import { useState } from 'react';
import CopyButton from '../components/CopyButton';

// 定义工作流的各个阶段
// 保留阶段定义以便未来可能使用；当前未直接使用以简化 TS 未使用检查
// @ts-ignore - reserved for future phases
type NovelWritingPhase =
  | 'INITIAL_INPUT'
  | 'GENERATE_FIRST_DRAFT_PROMPT'
  | 'REVIEW_FIRST_DRAFT'
  | 'GENERATE_REVISION_PROMPT'
  | 'AI_REINFORCE_PROMPT'
  | 'MANUAL_EDIT'
  | 'SUMMARIZE_MANUAL_EDITS_PROMPT'
  | 'GATHER_AI_EVALUATION_PROMPT'
  | 'REVIEW_AI_EVALUATION'
  | 'FINAL_FORMATTING_PROMPT';

// --- 定义操作历史中每个条目的类型 ---
type OperationType =
  | 'INITIAL_INPUTS_PROVIDED'       // 用户提供了初始参考资料和写作目标
  | 'PROMPT_GENERATED'              // 系统生成了一个提示词
  | 'AI_RESPONSE_PASTED'            // 用户粘贴了AI的回复 (草稿、总结、评价等)
  | 'USER_REVIEW_ADDED'             // 用户添加了审阅意见
  | 'MARKDOWN_GUIDE_UPDATED'      // 用户更新了Markdown指南
  | 'MANUAL_EDIT_STARTED' // User initiated manual editing on a draft
  | 'MANUAL_EDIT_COMPLETED'; // User submitted their manual edits

interface BaseOperation {
  id: string; // 用于React key和可能的引用
  timestamp: Date;
  type: OperationType;
}

interface InitialInputsProvidedOp extends BaseOperation {
  type: 'INITIAL_INPUTS_PROVIDED';
  referenceMaterial: string;
  writingGoal: string;
}

interface PromptGeneratedOp extends BaseOperation {
  type: 'PROMPT_GENERATED';
  prompt: string;
  promptFor: string; // 例如：'FIRST_DRAFT', 'REVISION', 'SUMMARIZE_EDITS', 'AI_EVALUATION', 'FORMATTING'
  contextType: 'INCREMENTAL' | 'FULL'; // New field: To specify prompt nature
}

interface AiResponsePastedOp extends BaseOperation {
  type: 'AI_RESPONSE_PASTED';
  responseType: 'DRAFT' | 'SUMMARY' | 'EVALUATION'; // 表明粘贴的是什么类型的回复
  content: string;
  relatedPromptId?: string; // (可选) 关联到哪个生成的提示词
}

interface UserReviewAddedOp extends BaseOperation {
  type: 'USER_REVIEW_ADDED';
  notes: string;
  forDraftId?: string; // (可选) 针对哪个草稿的审阅
}

interface MarkdownGuideUpdatedOp extends BaseOperation {
  type: 'MARKDOWN_GUIDE_UPDATED';
  guideContent: string;
}

interface ManualEditStartedOp extends BaseOperation {
  type: 'MANUAL_EDIT_STARTED';
  originalDraftId: string;
  originalDraftContent: string;
}

interface ManualEditCompletedOp extends BaseOperation {
  type: 'MANUAL_EDIT_COMPLETED';
  originalDraftId: string;
  originalContent: string;
  editedContent: string;
  summaryPromptGenerated?: boolean; // Flag to indicate if a summary prompt was auto-generated for this edit
}

type Operation = 
  | InitialInputsProvidedOp 
  | PromptGeneratedOp 
  | AiResponsePastedOp 
  | UserReviewAddedOp
  | MarkdownGuideUpdatedOp
  | ManualEditStartedOp
  | ManualEditCompletedOp;

// Helper type for addOperation arguments
type CreateOperationArgs<T extends Operation> = Omit<T, 'id' | 'timestamp'>;

export default function NovelWriterWorkflow() {
  const [operationHistory, setOperationHistory] = useState<Operation[]>([]);
  
  // 用于临时存储当前正在编辑的输入，提交后会形成Operation并添加到history
  const [currentReferenceMaterial, setCurrentReferenceMaterial] = useState<string>('');
  const [currentWritingGoal, setCurrentWritingGoal] = useState<string>('');
  const [currentAiResponse, setCurrentAiResponse] = useState<string>('');
  const [currentUserReview, setCurrentUserReview] = useState<string>('');
  const [currentMarkdownGuide, setCurrentMarkdownGuide] = useState<string>('小说 Markdown 格式优化使用指南：让文字更具表现力.md -> (请在此处粘贴指南内容或关键规则)');

  const [isManualEditing, setIsManualEditing] = useState<boolean>(false);
  const [draftForManualEdit, setDraftForManualEdit] = useState<{ id: string, content: string } | null>(null);
  const [manualEditContent, setManualEditContent] = useState<string>('');

  const addOperation = <T extends Operation>(opDetails: CreateOperationArgs<T>) => {
    const newOp = {
      ...opDetails,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    } as T;
    setOperationHistory(prev => [...prev, newOp]);
    return newOp.id; // Return the new operation's ID
  };

  const getLatestAiDraftOp = (): AiResponsePastedOp | null => {
    return [...operationHistory].reverse().find(op => op.type === 'AI_RESPONSE_PASTED' && op.responseType === 'DRAFT') as AiResponsePastedOp | undefined || null;
  };
  
  const getLatestContent = (): string | null => {
    const lastManualEdit = [...operationHistory].reverse().find(op => op.type === 'MANUAL_EDIT_COMPLETED') as ManualEditCompletedOp | undefined;
    if (lastManualEdit) return lastManualEdit.editedContent;
    const lastAiDraft = getLatestAiDraftOp();
    return lastAiDraft?.content || null;
  };

  // --- 事件处理与提示词生成逻辑 ---
  const handleInitialInputSubmit = (contextType: 'INCREMENTAL' | 'FULL') => {
    if (!currentReferenceMaterial.trim() && !currentWritingGoal.trim()) {
      alert('请输入参考资料或写作目标。');
      return;
    }
    addOperation<InitialInputsProvidedOp>({
      type: 'INITIAL_INPUTS_PROVIDED',
      referenceMaterial: currentReferenceMaterial,
      writingGoal: currentWritingGoal
    });

    let promptText = '';
    if (contextType === 'FULL') {
      promptText = `背景资料：\n${currentReferenceMaterial}\n\n写作目标：\n${currentWritingGoal}\n\n请根据以上信息，撰写初稿。`;
    } else { // INCREMENTAL
      promptText = `我的写作目标是：\n"${currentWritingGoal}"\n\n(请注意：相关的背景资料我已通过其他方式提供或粘贴在当前对话的上方。请结合那些背景资料和这个写作目标来撰写初稿。)`;
      if (!currentReferenceMaterial.trim()) {
        promptText = `我的写作目标是：\n"${currentWritingGoal}"\n\n请撰写初稿。`;
      }
    }

    addOperation<PromptGeneratedOp>({
      type: 'PROMPT_GENERATED',
      prompt: promptText,
      promptFor: 'FIRST_DRAFT',
      contextType: contextType
    });
    setCurrentReferenceMaterial('');
    setCurrentWritingGoal('');
  };
  
  const handleAddReviewNotes = (contextType: 'INCREMENTAL' | 'FULL') => {
    const lastDraftOp = getLatestAiDraftOp();
    if (!lastDraftOp) {
        alert('没有找到可供审阅的草稿。');
        return;
    }
    if (!currentUserReview.trim()) {
        alert('请输入审阅意见。');
        return;
    }
    addOperation<UserReviewAddedOp>({
        type: 'USER_REVIEW_ADDED',
        notes: currentUserReview,
        forDraftId: lastDraftOp.id
    });

    let promptText = '';
    if (contextType === 'FULL') {
      promptText = `针对以下原始草稿：\n"${lastDraftOp.content}"\n\n用户的修改意见如下：\n"${currentUserReview}"\n\n请根据修改意见修订原始草稿。`;
    } else { // INCREMENTAL
      promptText = `关于刚才的草稿，我的修改意见是：\n"${currentUserReview}"\n\n请进行修改。`;
    }

    addOperation<PromptGeneratedOp>({
        type: 'PROMPT_GENERATED',
        prompt: promptText,
        promptFor: 'REVISION',
        contextType: contextType
    });
    setCurrentUserReview('');
  };
  
  // --- 其他事件处理 --- 
  const handlePasteAiResponse = (responseType: AiResponsePastedOp['responseType']) => {
    if (!currentAiResponse.trim()) { alert(`请粘贴AI生成的${responseType === 'DRAFT' ? '草稿' : responseType === 'SUMMARY' ? '总结' : '评价'}内容。`); return; }
    addOperation<AiResponsePastedOp>({ type: 'AI_RESPONSE_PASTED', responseType, content: currentAiResponse });
    setCurrentAiResponse('');
  };

  const handleStartManualEdit = () => {
    const latestAiDraft = getLatestAiDraftOp();
    if (!latestAiDraft) {
      alert('没有找到可供编辑的AI草稿。');
      return;
    }
    setDraftForManualEdit({ id: latestAiDraft.id, content: latestAiDraft.content });
    setManualEditContent(latestAiDraft.content);
    setIsManualEditing(true);
  };

  const handleSubmitManualEdit = () => {
    if (!draftForManualEdit) {
      alert('没有正在编辑的草稿信息。');
      return;
    }
    addOperation<ManualEditCompletedOp>({
      type: 'MANUAL_EDIT_COMPLETED',
      originalDraftId: draftForManualEdit.id,
      originalContent: draftForManualEdit.content,
      editedContent: manualEditContent,
      summaryPromptGenerated: false
    });
    setIsManualEditing(false);
    setDraftForManualEdit(null);
    setManualEditContent('');
  };

  const handleCancelManualEdit = () => {
    setIsManualEditing(false);
    setDraftForManualEdit(null);
    setManualEditContent('');
  };

  const handleGeneratePrompt = (promptForType: PromptGeneratedOp['promptFor'], contextType: 'INCREMENTAL' | 'FULL') => {
    let promptText = '';
    const latestContentForPrompt = getLatestContent();
    let manualEditOp = [...operationHistory].reverse().find(op => op.type === 'MANUAL_EDIT_COMPLETED' && !op.summaryPromptGenerated) as ManualEditCompletedOp | undefined;

    switch (promptForType) {
      case 'AI_REINFORCE':
        const contentToReinforce = manualEditOp?.editedContent || latestContentForPrompt;
        if (!contentToReinforce) { alert('没有可供强化的草稿。'); return; }
        if (contextType === 'FULL') {
          promptText = `当前草稿：\n"${contentToReinforce}"\n\n请对以上内容进行强化和润色，使其表达更生动、逻辑更严谨。`;
        } else {
          promptText = `请对我们刚才讨论的最新草稿进行强化和润色，使其表达更生动、逻辑更严谨。`;
        }
        break;
      case 'SUMMARIZE_EDITS':
        if (!manualEditOp) {
            alert('没有找到已完成的手动精修记录来生成总结提示词。'); return;
        }
        if (contextType === 'FULL') {
          promptText = `这是AI修改前的版本（或用户精修前的版本）：\n"${manualEditOp.originalContent}"\n\n这是用户手动精修后的版本：\n"${manualEditOp.editedContent}"\n\n请总结用户从前者到后者所做的关键修改和改进思路。`;
        } else {
          promptText = `关于我刚才的手动精修 (对比精修前后的版本)，请总结我的关键修改和改进思路。`;
        }
        break;
      case 'AI_EVALUATION':
        if (!latestContentForPrompt) { alert('没有可供评价的草稿。'); return; }
        const evaluationDisclaimer = "\n\n--- \n请注意：为了获得真正匿名的评价，建议您将此提示词复制到一个全新的、无历史记录的AI聊天窗口或会话中进行提问。";
        if (contextType === 'FULL') {
          promptText = `请从一个中立的第三方评论家角度，评价以下文本的优点和缺点：\n\n"${latestContentForPrompt}"${evaluationDisclaimer}`;
        } else {
          promptText = `请从一个中立的第三方评论家角度，评价我刚才发给你的最新草稿。${evaluationDisclaimer}`;
        }
        break;
      case 'FORMATTING':
        if (!latestContentForPrompt) { alert('没有可供格式化的草稿。'); return; }
        if (!currentMarkdownGuide.trim()) { alert('请先提供Markdown格式优化指南。'); return; }
        if (contextType === 'FULL') {
          promptText = `请根据以下Markdown格式化指南，修正下文的格式：\n\n指南：\n${currentMarkdownGuide}\n\n待格式化文本：\n"${latestContentForPrompt}"`;
        } else {
          promptText = `请根据我提供的Markdown格式化指南 (内容如下，或已在上下文中提供)，修正刚才的最新草稿。\n\n指南参考（如果上下文中没有）：\n${currentMarkdownGuide}`;
        }
        break;
      default:
        alert('未知的提示词类型。'); return;
    }
    if(promptText) addOperation<PromptGeneratedOp>({ type: 'PROMPT_GENERATED', prompt: promptText, promptFor: promptForType, contextType });
  };
  
  // --- 渲染逻辑 ---
  const renderManualEditZone = () => {
    if (!isManualEditing || !draftForManualEdit) return null;
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
          <h3 className="text-xl font-semibold mb-4">手动精修模式</h3>
          <div className="mb-2 text-xs text-gray-600">
            <p>原始草稿 (ID: {draftForManualEdit.id.substring(0,8)}) 内容:</p>
            <textarea readOnly value={draftForManualEdit.content} rows={3} className="w-full p-1 border rounded bg-gray-50 text-xs" />
          </div>
          <textarea 
            value={manualEditContent} 
            onChange={e => setManualEditContent(e.target.value)} 
            rows={15} 
            className="w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 flex-grow"
            placeholder="在此编辑您的稿件..."
          />
          <div className="mt-4 flex justify-end space-x-3">
            <button onClick={handleCancelManualEdit} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">取消</button>
            <button onClick={handleSubmitManualEdit} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">提交精修稿</button>
          </div>
        </div>
      </div>
    );
  };

  const renderOperation = (op: Operation) => {
    switch (op.type) {
      case 'INITIAL_INPUTS_PROVIDED':
        return (
          <div key={op.id} className="p-4 bg-gray-100 rounded-md shadow">
            <h4 className="font-semibold text-gray-700">初始输入 ({op.timestamp.toLocaleTimeString()})</h4>
            {op.referenceMaterial && <div className="mt-2"><p className="text-sm font-medium">参考资料:</p><pre className="whitespace-pre-wrap text-xs bg-white p-2 rounded">{op.referenceMaterial}</pre></div>}
            {op.writingGoal && <div className="mt-2"><p className="text-sm font-medium">写作目标:</p><pre className="whitespace-pre-wrap text-xs bg-white p-2 rounded">{op.writingGoal}</pre></div>}
          </div>
        );
      case 'PROMPT_GENERATED':
        return (
          <div key={op.id} className="p-4 bg-indigo-50 rounded-md shadow">
            <h4 className="font-semibold text-indigo-700">
              提示词已生成 ({op.timestamp.toLocaleTimeString()}) - 类型: {op.contextType} - 用于: {op.promptFor}
            </h4>
            <textarea readOnly value={op.prompt} rows={5} className="w-full mt-2 p-2 text-xs border rounded bg-white" />
            <CopyButton text={op.prompt} label="复制提示词" copiedLabel="已复制" className="mt-2" />
          </div>
        );
      case 'AI_RESPONSE_PASTED':
        return (
          <div key={op.id} className="p-4 bg-green-50 rounded-md shadow">
            <h4 className="font-semibold text-green-700">AI回复已粘贴 ({op.timestamp.toLocaleTimeString()}) - 类型: {op.responseType}</h4>
            <pre className="whitespace-pre-wrap text-sm bg-white p-2 mt-2 rounded">{op.content}</pre>
            <CopyButton text={op.content} label="复制回复" copiedLabel="已复制" className="mt-2" />
          </div>
        );
      case 'USER_REVIEW_ADDED':
        return (
          <div key={op.id} className="p-4 bg-yellow-50 rounded-md shadow">
            <h4 className="font-semibold text-yellow-700">用户审阅意见 ({op.timestamp.toLocaleTimeString()})</h4>
            <pre className="whitespace-pre-wrap text-sm bg-white p-2 mt-2 rounded">{op.notes}</pre>
            <CopyButton text={op.notes} label="复制审阅" copiedLabel="已复制" className="mt-2" />
          </div>
        );
      case 'MARKDOWN_GUIDE_UPDATED':
        return (
          <div key={op.id} className="p-4 bg-purple-50 rounded-md shadow">
            <h4 className="font-semibold text-purple-700">Markdown指南已更新 ({op.timestamp.toLocaleTimeString()})</h4>
            <pre className="whitespace-pre-wrap text-sm bg-white p-2 mt-2 rounded">{op.guideContent}</pre>
            <CopyButton text={op.guideContent} label="复制指南" copiedLabel="已复制" className="mt-2" />
          </div>
        );
      case 'MANUAL_EDIT_STARTED':
        return (
          <div key={op.id} className="p-4 bg-orange-50 rounded-md shadow">
            <h4 className="font-semibold text-orange-700">手动精修开始 ({op.timestamp.toLocaleTimeString()})</h4>
            <p className="text-xs text-gray-500 mt-1">原稿ID: {op.originalDraftId.substring(0,8)}</p>
            <div className="grid grid-cols-2 gap-3 mt-2 text-xs">
              <div>
                <p className="font-medium">精修前:</p>
                <pre className="whitespace-pre-wrap bg-white p-2 rounded max-h-32 overflow-y-auto">{op.originalDraftContent}</pre>
              </div>
            </div>
          </div>
        );
      case 'MANUAL_EDIT_COMPLETED':
        return (
          <div key={op.id} className="p-4 bg-orange-50 rounded-md shadow">
            <h4 className="font-semibold text-orange-700">手动精修完成 ({op.timestamp.toLocaleTimeString()})</h4>
            <p className="text-xs text-gray-500 mt-1">原稿ID: {op.originalDraftId.substring(0,8)}</p>
            <div className="grid grid-cols-2 gap-3 mt-2 text-xs">
              <div>
                <p className="font-medium">精修前:</p>
                <pre className="whitespace-pre-wrap bg-white p-2 rounded max-h-32 overflow-y-auto">{op.originalContent}</pre>
              </div>
              <div>
                <p className="font-medium">精修后:</p>
                <pre className="whitespace-pre-wrap bg-white p-2 rounded max-h-32 overflow-y-auto">{op.editedContent}</pre>
              </div>
            </div>
          </div>
        );
    }
    // 理论上不可达
    return <div></div>;
  };

  // --- 当前可执行的操作/输入区域 ---
  const renderCurrentActions = () => {
    const lastOp = operationHistory.length > 0 ? operationHistory[operationHistory.length - 1] : null;

    // 1. 初始状态
    if (!lastOp) {
      return (
        <div className="mt-4 p-4 border-t space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">开始新的写作任务</h3>
          <div>
            <label htmlFor="currentReferenceMaterial" className="block text-sm font-medium text-gray-700">参考资料 (若使用增量提示词, 可先在聊天AI中粘贴):</label>
            <textarea id="currentReferenceMaterial" value={currentReferenceMaterial} onChange={e => setCurrentReferenceMaterial(e.target.value)} rows={5} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label htmlFor="currentWritingGoal" className="block text-sm font-medium text-gray-700">写作目标:</label>
            <textarea id="currentWritingGoal" value={currentWritingGoal} onChange={e => setCurrentWritingGoal(e.target.value)} rows={3} className="w-full p-2 border rounded" />
          </div>
          <div className="flex space-x-3">
            <button onClick={() => handleInitialInputSubmit('INCREMENTAL')} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300">生成初稿提示 (增量)</button>
            <button onClick={() => handleInitialInputSubmit('FULL')} className="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300">生成初稿提示 (全文)</button>
          </div>
        </div>
      );
    }

    // 2. 等待AI回复
    if (lastOp?.type === 'PROMPT_GENERATED') {
      return (
        <div className="mt-4 p-4 border-t space-y-3">
          <h3 className="font-semibold">粘贴AI的回复 (针对上方 "{lastOp.promptFor} - {lastOp.contextType}" 提示词):</h3>
          <textarea value={currentAiResponse} onChange={e => setCurrentAiResponse(e.target.value)} rows={7} className="w-full p-2 border rounded" placeholder="粘贴AI回复..." />
          <div className="flex space-x-2">
            <button onClick={() => handlePasteAiResponse('DRAFT')} className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm">粘贴为草稿</button>
            {lastOp.promptFor === 'SUMMARIZE_EDITS' && 
              <button onClick={() => handlePasteAiResponse('SUMMARY')} className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">粘贴为总结</button>}
            {lastOp.promptFor === 'AI_EVALUATION' && 
              <button onClick={() => handlePasteAiResponse('EVALUATION')} className="px-3 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm">粘贴为评价</button>}
          </div>
        </div>
      );
    }

    // 3. AI草稿已粘贴 -> 可审阅 或 手动精修/其他操作
    if (lastOp?.type === 'AI_RESPONSE_PASTED' && lastOp.responseType === 'DRAFT') {
      return (
        <div className="mt-4 p-4 border-t space-y-3">
          <div>
            <h3 className="font-semibold">添加审阅意见 (针对上方草稿):</h3>
            <textarea value={currentUserReview} onChange={e => setCurrentUserReview(e.target.value)} rows={4} className="w-full p-2 border rounded" placeholder="输入修改意见..." />
            <div className="flex space-x-2 mt-2">
              <button onClick={() => handleAddReviewNotes('INCREMENTAL')} className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm">提交审阅 (增量提示)</button>
              <button onClick={() => handleAddReviewNotes('FULL')} className="flex-1 px-4 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-800 text-sm">提交审阅 (全文提示)</button>
            </div>
          </div>
          <div className="pt-3 border-t mt-3">
            <h3 className="font-semibold mb-2">或对最新AI草稿执行其他操作:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button onClick={handleStartManualEdit} className="px-4 py-2 bg-orange-600 text-white rounded text-sm hover:bg-orange-700">我要手动精修此稿</button>
              <button onClick={() => handleGeneratePrompt('AI_REINFORCE', 'INCREMENTAL')} className="px-4 py-2 bg-sky-500 text-white rounded text-sm">强化润色 (增量)</button>
              <button onClick={() => handleGeneratePrompt('AI_REINFORCE', 'FULL')} className="px-4 py-2 bg-sky-700 text-white rounded text-sm">强化润色 (全文)</button>
              <button onClick={() => handleGeneratePrompt('AI_EVALUATION', 'INCREMENTAL')} className="px-4 py-2 bg-teal-500 text-white rounded text-sm">获取评价 (增量)</button>
              <button onClick={() => handleGeneratePrompt('AI_EVALUATION', 'FULL')} className="px-4 py-2 bg-teal-700 text-white rounded text-sm">获取评价 (全文)</button>
              <button onClick={() => handleGeneratePrompt('FORMATTING', 'INCREMENTAL')} className="px-4 py-2 bg-violet-500 text-white rounded text-sm">格式化 (增量)</button>
              <button onClick={() => handleGeneratePrompt('FORMATTING', 'FULL')} className="px-4 py-2 bg-violet-700 text-white rounded text-sm">格式化 (全文)</button>
            </div>
          </div>
        </div>
      );
    }
    
    // 4. 手动精修已提交 -> 可总结修改
    if (lastOp?.type === 'MANUAL_EDIT_COMPLETED') {
      return (
        <div className="mt-4 p-4 border-t space-y-3">
            <h3 className="font-semibold">手动精修已提交。接下来您可以:</h3>
            <div className="flex space-x-2">
                <button onClick={() => handleGeneratePrompt('SUMMARIZE_EDITS', 'INCREMENTAL')} className="flex-1 px-4 py-2 bg-lime-500 text-white rounded text-sm hover:bg-lime-600">总结我的修改 (增量)</button>
                <button onClick={() => handleGeneratePrompt('SUMMARIZE_EDITS', 'FULL')} className="flex-1 px-4 py-2 bg-lime-700 text-white rounded text-sm hover:bg-lime-800">总结我的修改 (全文)</button>
            </div>
            <div className="pt-3 border-t mt-3">
              <h3 className="font-semibold mb-2">或对精修后的稿件执行其他操作:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button onClick={() => handleGeneratePrompt('AI_REINFORCE', 'INCREMENTAL')} className="px-4 py-2 bg-sky-500 text-white rounded text-sm">强化润色 (增量)</button>
                  <button onClick={() => handleGeneratePrompt('AI_REINFORCE', 'FULL')} className="px-4 py-2 bg-sky-700 text-white rounded text-sm">强化润色 (全文)</button>
                  <button onClick={() => handleGeneratePrompt('AI_EVALUATION', 'INCREMENTAL')} className="px-4 py-2 bg-teal-500 text-white rounded text-sm">获取评价 (增量)</button>
                  <button onClick={() => handleGeneratePrompt('AI_EVALUATION', 'FULL')} className="px-4 py-2 bg-teal-700 text-white rounded text-sm">获取评价 (全文)</button>
                  <button onClick={() => handleGeneratePrompt('FORMATTING', 'INCREMENTAL')} className="px-4 py-2 bg-violet-500 text-white rounded text-sm">格式化 (增量)</button>
                  <button onClick={() => handleGeneratePrompt('FORMATTING', 'FULL')} className="px-4 py-2 bg-violet-700 text-white rounded text-sm">格式化 (全文)</button>
              </div>
            </div>
        </div>
      );
    }
        
    // 5. AI总结或评价已粘贴 -> 可进行下一步操作，或回到对最新草稿/精修稿的操作
    if (lastOp?.type === 'AI_RESPONSE_PASTED' && (lastOp.responseType === 'SUMMARY' || lastOp.responseType === 'EVALUATION')) {
         return (
            <div className="mt-4 p-4 border-t space-y-3">
                <h3 className="font-semibold">基于最新 {lastOp.responseType === 'SUMMARY' ? '总结' : '评价'}，或对最新稿件执行操作:</h3>
                <p className="text-xs text-gray-500">您可对最新的内容（可能是AI草稿或您手动精修后的版本）进行强化、再次评价或格式化。</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button onClick={() => handleGeneratePrompt('AI_REINFORCE', 'INCREMENTAL')} className="px-4 py-2 bg-sky-500 text-white rounded text-sm">强化润色 (增量)</button>
                  <button onClick={() => handleGeneratePrompt('AI_REINFORCE', 'FULL')} className="px-4 py-2 bg-sky-700 text-white rounded text-sm">强化润色 (全文)</button>
                  <button onClick={() => handleGeneratePrompt('AI_EVALUATION', 'INCREMENTAL')} className="px-4 py-2 bg-teal-500 text-white rounded text-sm">再次获取评价 (增量)</button>
                  <button onClick={() => handleGeneratePrompt('AI_EVALUATION', 'FULL')} className="px-4 py-2 bg-teal-700 text-white rounded text-sm">再次获取评价 (全文)</button>
                   <button onClick={() => handleGeneratePrompt('FORMATTING', 'INCREMENTAL')} className="px-4 py-2 bg-violet-500 text-white rounded text-sm">格式化 (增量)</button>
                  <button onClick={() => handleGeneratePrompt('FORMATTING', 'FULL')} className="px-4 py-2 bg-violet-700 text-white rounded text-sm">格式化 (全文)</button>
                </div>
                 <p className="text-xs text-gray-500 mt-2">如果需要再次手动精修，请先粘贴一份新的AI草稿或找到您希望编辑的旧版AI草稿并从其操作历史条目中开始新的精修流程。</p>
            </div>
        );
    }

    return <div className="mt-4 p-4 border-t text-sm text-gray-500">请按流程操作，或等待系统提供下一步行动选项。</div>;
  };

  // --- Main Return ---
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white shadow-xl rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">小说写作工作流 (流式迭代版)</h2>
      
      <div className="space-y-5">
        {operationHistory.map(op => renderOperation(op))}
      </div>
      
      {renderManualEditZone()}
      {renderCurrentActions()} 
      
      <div className="mt-10 p-4 border-t pt-6 space-y-2 bg-gray-50 rounded-b-lg">
        <label htmlFor="currentMarkdownGuide" className="block text-sm font-medium text-gray-600">Markdown 格式优化指南:</label>
        <textarea id="currentMarkdownGuide" value={currentMarkdownGuide} onChange={e => setCurrentMarkdownGuide(e.target.value)} rows={5} className="w-full p-2 border rounded-md bg-white" />
        <button onClick={() => addOperation<MarkdownGuideUpdatedOp>({type: 'MARKDOWN_GUIDE_UPDATED', guideContent: currentMarkdownGuide})} className="mt-2 px-3 py-1.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-xs">更新/记录指南到历史</button>
      </div>
    </div>
  );
} 