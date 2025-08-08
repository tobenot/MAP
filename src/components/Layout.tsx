import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4 shadow-md">
        <nav className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold hover:text-gray-300">
            MAP - 个人机械飞升程序
          </Link>
          <div className="space-x-4">
            <Link to="/" className="hover:text-gray-300">首页</Link>
            <Link to="/translate" className="hover:text-gray-300">翻译工作流</Link>
            <Link to="/novel-writer" className="hover:text-gray-300">小说写作</Link>
            {/* 其他导航链接 */}
          </div>
        </nav>
      </header>

      <main className="flex-grow container mx-auto p-4">
        <Outlet /> {/* 子路由的组件将在这里渲染 */}
      </main>

      <footer className="bg-gray-700 text-white text-center p-3">
        © 2025 MAP Project
      </footer>
    </div>
  );
} 