import { useState } from "react";
import StatCard from "../../../components/admin/Dashboard/StatCard";
import { useRevenue } from "../../../hooks/dashboard/useRevenue";
import TaskStatusPieChart from "../../../components/admin/Dashboard/TaskStatPiechart";
import { useTopNeighbors } from "../../../hooks/dashboard/useTopNeighbors";
import TopItems from "../../../components/admin/Dashboard/TopItems";

export const Dashboard = () => {
  const [selectedRange, setSelectedRange] = useState<'today' | 'past7Days' | 'thisMonth' | 'thisYear'>('today');
  const { data: revenueData, isLoading } = useRevenue();
  const { data: topNeighbors = [], isLoading: isNeighborsLoading, error: neighborsError } = useTopNeighbors();

  const revenue = revenueData?.[selectedRange]?.totalRevenue || 0;
  const helpersEarned = revenueData?.[selectedRange]?.helpersEarned || 0;
  const neighborFields = [
    { key: 'name', label: 'Name' },
    { key: 'taskCount', label: 'Tasks Completed' },
    { key: 'earnings', label: 'Earnings (₹)' },
  ];

  const rangeLabels = {
    today: 'Today',
    past7Days: 'Last 7 Days',
    thisMonth: 'This Month',
    thisYear: 'This Year',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
      {/* Header Section */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-10">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Monitor your platform's performance and analytics
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Live Data</span>
            </div>
          </div>

          {/* Enhanced Range Selector */}
          <div className="flex flex-wrap gap-3">
            {['today', 'past7Days', 'thisMonth', 'thisYear'].map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range as any)}
                className={`group relative px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                  selectedRange === range
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 border border-gray-200/50 dark:border-gray-600/50 hover:border-blue-300 dark:hover:border-blue-500'
                }`}
                aria-pressed={selectedRange === range}
              >
                <span className="relative z-10">{rangeLabels[range]}</span>
                {selectedRange === range && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-30"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={isLoading ? 'Loading...' : `₹${revenue.toLocaleString()}`}
            icon={
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </div>
            }
            className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border-blue-200/50 dark:border-blue-700/50"
          />
          <StatCard
            title="Helpers Earned"
            value={isLoading ? 'Loading...' : `₹${helpersEarned.toLocaleString()}`}
            icon={
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </div>
            }
            className="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/20 border-green-200/50 dark:border-green-700/50"
          />
        </div>

        {/* Loading and Error States */}
        {isNeighborsLoading && (
          <div className="flex justify-center items-center py-8 bg-white/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-sm mb-6">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-t-2 border-blue-400 opacity-20"></div>
            </div>
            <span className="ml-4 text-gray-600 dark:text-gray-300 font-medium">Loading analytics...</span>
          </div>
        )}
        
        {neighborsError && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200/50 dark:border-red-700/50 p-6 rounded-2xl mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-red-800 dark:text-red-200">Error Loading Data</h3>
                <p className="text-red-600 dark:text-red-300">{neighborsError.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Top Neighbors - Takes 2 columns */}
          <div className="xl:col-span-2">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top Performers</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Live Rankings</span>
                </div>
              </div>
              <TopItems
                title="Top Neighbors"
                items={isNeighborsLoading ? [] : topNeighbors}
                fields={neighborFields}
              />
            </div>
          </div>

          {/* Pie Chart - Takes 1 column */}
          <div className="xl:col-span-1">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
              <TaskStatusPieChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};