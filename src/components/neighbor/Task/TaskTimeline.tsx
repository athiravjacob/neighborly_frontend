import React from 'react';
import { newTaskDetails } from '../../../types/newTaskDetails';

interface TaskTimelineProps {
  task: newTaskDetails;
  formatDateTime: (date: string | Date) => string;
  formatCreatedAt: (isoString: string) => string;
}

export const TaskTimeline: React.FC<TaskTimelineProps> = ({ task, formatDateTime, formatCreatedAt }) => (
  <div className="mt-8 border-t border-gray-200 pt-6">
    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Task Timeline</h3>
    <div className="relative">
      <div className="absolute top-0 left-4 h-full w-0.5 bg-gray-200" />
      <div className="space-y-6">
        <div className="relative flex items-start">
          <div className="absolute mt-1 ml-1 h-6 w-6 rounded-full border-2 border-violet-700 bg-white" />
          <div className="ml-12">
            <p className="text-sm font-medium text-gray-900">Task Created</p>
            <p className="text-xs text-gray-500">{formatCreatedAt(task.prefferedDate.toString())}</p>
          </div>
        </div>
        {task.createdBy && (
          <div className="relative flex items-start">
            <div className="absolute mt-1 ml-1 h-6 w-6 rounded-full border-2 border-violet-700 bg-white" />
            <div className="ml-12">
              <p className="text-sm font-medium text-gray-900">Created by {task.createdBy.name}</p>
            </div>
          </div>
        )}
        {(task.task_status === 'assigned' || task.task_status === 'in_progress') && (
          <div className="relative flex items-start">
            <div className="absolute mt-1 ml-1 h-6 w-6 rounded-full border-2 border-violet-700 bg-white" />
            <div className="ml-12">
              <p className="text-sm font-medium text-gray-900">Task Scheduled</p>
              <p className="text-xs text-gray-500">{formatDateTime(task.prefferedDate)}</p>
            </div>
          </div>
        )}
        {task.task_status === 'in_progress' && (
          <div className="relative flex items-start">
            <div className="absolute mt-1 ml-1 h-6 w-6 rounded-full border-2 border-violet-700 bg-white" />
            <div className="ml-12">
              <p className="text-sm font-medium text-gray-900">Task Started</p>
              <p className="text-xs text-gray-500">Work in progress</p>
            </div>
          </div>
        )}
        {task.task_status === 'completed' && (
          <div className="relative flex items-start">
            <div className="absolute mt-1 ml-1 h-6 w-6 rounded-full border-2 border-green-500 bg-white" />
            <div className="ml-12">
              <p className="text-sm font-medium text-gray-900">Task Completed</p>
              <p className="text-xs text-gray-500">Great job!</p>
            </div>
          </div>
        )}
        {task.task_status === 'cancelled' && (
          <div className="relative flex items-start">
            <div className="absolute mt-1 ml-1 h-6 w-6 rounded-full border-2 border-red-500 bg-white" />
            <div className="ml-12">
              <p className="text-sm font-medium text-gray-900">Task Cancelled</p>
              <p className="text-xs text-gray-500">Task was cancelled</p>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);