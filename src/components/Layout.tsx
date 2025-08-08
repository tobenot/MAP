import { Outlet, Link, useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();
  
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col bg-primary-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-primary-200 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Title */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 text-primary-900 hover:text-accent-600 transition-colors"
            >
              <div className="w-8 h-8 bg-accent-500 flex items-center justify-center">
                <div className="w-4 h-4 bg-white transform rotate-45"></div>
              </div>
              <span className="text-xl font-semibold tracking-tight">
                MAP
              </span>
              <span className="hidden sm:inline text-sm text-primary-600 font-mono">
                // 个人机械飞升程序
              </span>
            </Link>
            
            {/* Navigation */}
            <div className="flex items-center space-x-1">
              <NavLink to="/" isActive={isActiveRoute('/')}>
                首页
              </NavLink>
              <NavLink to="/translate" isActive={isActiveRoute('/translate')}>
                翻译工作流
              </NavLink>
              <NavLink to="/novel-writer" isActive={isActiveRoute('/novel-writer')}>
                小说写作
              </NavLink>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-primary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12 text-sm">
            <div className="flex items-center space-x-4 text-primary-600">
              <span className="font-mono">© 2025 MAP Project</span>
              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-2 h-2 bg-success-500"></div>
                <span>系统运行中</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-primary-500 text-xs">
              <span className="font-mono">v1.0.0</span>
              <span className="hidden sm:inline">构建于 React + TypeScript</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Navigation Link Component
interface NavLinkProps {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
}

function NavLink({ to, isActive, children }: NavLinkProps) {
  return (
    <Link
      to={to}
      className={`
        px-4 py-2 text-sm font-medium transition-all duration-200
        border-l-2 border-transparent
        ${isActive 
          ? 'text-accent-600 bg-accent-50 border-l-accent-500' 
          : 'text-primary-700 hover:text-accent-600 hover:bg-primary-50'
        }
      `}
    >
      {children}
    </Link>
  );
} 