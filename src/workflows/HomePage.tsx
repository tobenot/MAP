import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Workflow Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <WorkflowCard
          title="翻译工作流"
          description="高效的多语言翻译处理系统"
          path="/translate"
          status="active"
          icon="🔄"
        />
        <WorkflowCard
          title="小说写作"
          description="创意写作与内容生成工具"
          path="/novel-writer"
          status="active"
          icon="✍️"
        />
        <WorkflowCard
          title="数据分析"
          description="智能数据处理与可视化"
          path="/analytics"
          status="development"
          icon="📊"
        />
        <WorkflowCard
          title="自动化脚本"
          description="任务自动化与流程优化"
          path="/automation"
          status="development"
          icon="⚡"
        />
      </div>
      {/* System Status */}
      <div className="bg-white border border-primary-200 p-6">
        <h2 className="text-xl font-semibold text-primary-900 mb-4 flex items-center">
          <div className="w-3 h-3 bg-success-500 mr-3"></div>
          系统状态
        </h2>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-primary-600">运行时间</span>
            <span className="font-mono text-primary-900">24:07:15</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-primary-600">活跃模块</span>
            <span className="font-mono text-primary-900">2/4</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-primary-600">系统负载</span>
            <span className="font-mono text-success-600">低</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Workflow Card Component
interface WorkflowCardProps {
  title: string;
  description: string;
  path: string;
  status: 'active' | 'development' | 'maintenance';
  icon: string;
}

function WorkflowCard({ title, description, path, status, icon }: WorkflowCardProps) {
  const isActive = status === 'active';
  
  const statusConfig = {
    active: { 
      color: 'bg-success-500', 
      text: '可用',
      textColor: 'text-success-600'
    },
    development: { 
      color: 'bg-warning-500', 
      text: '开发中',
      textColor: 'text-warning-600'
    },
    maintenance: { 
      color: 'bg-danger-500', 
      text: '维护中',
      textColor: 'text-danger-600'
    }
  };

  const config = statusConfig[status];

  const CardContent = (
    <div className={`
      group bg-white border border-primary-200 p-6 h-full
      transition-all duration-200
      ${isActive 
        ? 'hover:border-accent-300 hover:shadow-md cursor-pointer' 
        : 'opacity-75 cursor-not-allowed'
      }
    `}>
      <div className="flex items-start justify-between mb-4">
        <div className="text-2xl">{icon}</div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 ${config.color}`}></div>
          <span className={`text-xs font-medium ${config.textColor}`}>
            {config.text}
          </span>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-primary-900 mb-2 group-hover:text-accent-600 transition-colors">
        {title}
      </h3>
      
      <p className="text-primary-600 text-sm leading-relaxed">
        {description}
      </p>
      
      {isActive && (
        <div className="mt-4 text-accent-600 text-sm font-medium">
          启动模块 →
        </div>
      )}
    </div>
  );

  return isActive ? (
    <Link to={path} className="block h-full">
      {CardContent}
    </Link>
  ) : (
    <div className="h-full">
      {CardContent}
    </div>
  );
} 