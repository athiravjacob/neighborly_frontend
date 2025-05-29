import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { NavigateAction, View, ToolbarProps } from 'react-big-calendar';

// Define the correct props interface that matches react-big-calendar's ToolbarProps
interface CustomToolbarProps extends ToolbarProps {
  isMobile: boolean;
}

export const CustomToolbar: React.FC<CustomToolbarProps> = ({
  date,
  view,
  views,
  label,
  localizer,
  onNavigate,
  onView,
  isMobile
}) => {
  const goToBack = () => {
    onNavigate('PREV');
  };

  const goToNext = () => {
    onNavigate('NEXT');
  };

  const goToCurrent = () => {
    onNavigate('TODAY');
  };

  const goToView = (view: View) => {
    onView(view);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100">
      {/* Left Section - Navigation */}
      <div className="flex items-center gap-2 mb-3 sm:mb-0">
        <button
          onClick={goToBack}
          className="p-2 rounded-lg bg-white border border-violet-200 hover:bg-violet-50 hover:border-violet-300 transition-all duration-200 shadow-sm"
        >
          <ChevronLeft className="h-4 w-4 text-violet-600" />
        </button>
        
        <button
          onClick={goToCurrent}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          Today
        </button>
        
        <button
          onClick={goToNext}
          className="p-2 rounded-lg bg-white border border-violet-200 hover:bg-violet-50 hover:border-violet-300 transition-all duration-200 shadow-sm"
        >
          <ChevronRight className="h-4 w-4 text-violet-600" />
        </button>
      </div>

      {/* Center Section - Date Label */}
      <div className="flex items-center gap-2 mb-3 sm:mb-0">
        <Calendar className="h-5 w-5 text-violet-600" />
        <h2 className="text-lg font-semibold text-gray-900">{label}</h2>
      </div>

      {/* Right Section - View Toggle */}
      <div className="flex items-center gap-1">
        {views && Array.isArray(views) && views.map((viewName) => (
          <button
            key={viewName}
            onClick={() => goToView(viewName)}
            className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 ${
              view === viewName
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-white text-violet-600 border border-violet-200 hover:bg-violet-50 hover:border-violet-300'
            }`}
          >
            {viewName.charAt(0).toUpperCase() + viewName.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};