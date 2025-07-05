import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, className = '' }) => {
  return (
    <div
      className={`group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200/50 dark:border-gray-700/50 ${className}`}
      role="region"
      aria-label={`${title} statistic`}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
            {title}
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tabular-nums">
            {value}
          </p>
          
          {/* Progress indicator */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out"></div>
          </div>
        </div>
        
        {/* Icon */}
        {icon && (
          <div className="ml-4 transform group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        )}
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      
      {/* Subtle shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>
      </div>
    </div>
  );
};

export default StatCard;