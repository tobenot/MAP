import { Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import Layout from './components/Layout';
import HomePage from './workflows/HomePage';
import SopDetailPage from './sops/SopDetailPage';
import { WORKFLOWS } from './workflows/registry';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="sop/:id" element={<SopDetailPage />} />
        {WORKFLOWS.map((wf) => (
          <Route
            key={wf.path}
            path={wf.path.slice(1)}
            element={
              <Suspense fallback={<div className="p-8 text-center text-primary-600">加载中...</div>}>
                <wf.component />
              </Suspense>
            }
          />
        ))}
        <Route 
          path="*" 
          element={<div className="text-center py-10"><h1 className="text-2xl">404 - 页面未找到</h1></div>} 
        />
      </Route>
    </Routes>
  );
}

export default App;
