import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './workflows/HomePage';
import TranslationWorkflow from './workflows/TranslationWorkflow'; // 导入实际的组件
import NovelWriterWorkflow from './workflows/NovelWriterWorkflow'; // 导入实际的组件
// import NovelWriterWorkflow from './workflows/NovelWriterWorkflow'; // 稍后创建

// 临时的占位符组件，直到我们创建实际的工作流组件
const PlaceholderWorkflow = ({ title }: { title: string }) => (
  <div>
    <h2 className="text-2xl font-semibold mb-3">{title}</h2>
    <p>此工作流正在建设中...</p>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route 
          path="translate" 
          element={<TranslationWorkflow />} // 使用实际的组件替换占位符
        />
        <Route 
          path="novel-writer" 
          element={<NovelWriterWorkflow />} // 使用实际的组件替换占位符
        />
        {/* 其他工作流的路由 */}
        <Route 
          path="*" 
          element={<div className="text-center py-10"><h1 className="text-2xl">404 - 页面未找到</h1></div>} 
        />
      </Route>
    </Routes>
  );
}

export default App;
