import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { useTaskstats } from '../../../hooks/dashboard/useTaskstats';
import { taskStats } from '../../../types/dashboard';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];
const GRADIENT_COLORS = [
  { id: 'completed', colors: ['#3B82F6', '#1E40AF'] },
  { id: 'in_progress', colors: ['#10B981', '#047857'] },
  { id: 'assigned', colors: ['#F59E0B', '#D97706'] },
  { id: 'pending', colors: ['#EF4444', '#DC2626'] },
  { id: 'dispute', colors: ['#EC4899', '#BE185D'] }
];

const TaskStatusPieChart = () => {
  const { data, isLoading, error } = useTaskstats();

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[400px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-t-2 border-blue-400 opacity-20"></div>
        </div>
        <span className="mt-4 text-gray-600 dark:text-gray-300 font-medium">Loading chart...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200/50 dark:border-red-700/50 p-6 rounded-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-red-800 dark:text-red-200">Chart Error</h3>
            <p className="text-red-600 dark:text-red-300">{(error as Error).message}</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = data as taskStats;

  const chartData = [
    { name: 'Completed', value: stats.completed ?? 0, color: COLORS[0] },
    { name: 'In Progress', value: stats.in_progress ?? 0, color: COLORS[1] },
    { name: 'Assigned', value: stats.assigned ?? 0, color: COLORS[2] },
    { name: 'Pending', value: stats.pending ?? 0, color: COLORS[3] },
    { name: 'Dispute', value: stats.dispute ?? 0, color: COLORS[4] },
  ].filter(item => item.value > 0);

  const totalTasks = chartData.reduce((sum, item) => sum + item.value, 0);

  if (!chartData.length) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Task Status</h3>
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          <p className="text-center">No task data available</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / totalTasks) * 100).toFixed(1);
      return (
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-4 shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">{data.value}</span> tasks ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 w-full min-h-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Task Status</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Total: {totalTasks.toLocaleString()} tasks
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500 dark:text-gray-400">Live Data</span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <defs>
              {GRADIENT_COLORS.map((gradient, index) => (
                <linearGradient key={gradient.id} id={gradient.id} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={gradient.colors[0]} />
                  <stop offset="100%" stopColor={gradient.colors[1]} />
                </linearGradient>
              ))}
            </defs>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={40}
              paddingAngle={2}
              label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              labelLine={false}
              className="drop-shadow-lg"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={entry.name} 
                  fill={`url(#${GRADIENT_COLORS[index]?.id})`} 
                  className="hover:opacity-80 transition-opacity duration-200"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalTasks}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Total Tasks
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        {chartData.map((entry, index) => (
          <div key={entry.name} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50/50 dark:bg-gray-700/50">
            <div 
              className="w-4 h-4 rounded-full shadow-sm"
              style={{ backgroundColor: entry.color }}
            ></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {entry.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {entry.value} tasks
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskStatusPieChart;