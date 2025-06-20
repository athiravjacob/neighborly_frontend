import React from 'react';
import { newTaskDetails } from '../../../types/newTaskDetails';

interface ScheduleHelperSectionProps {
  task: newTaskDetails;
  formatDateTime: (date: string | Date) => string;
}

export const ScheduleHelperSection: React.FC<ScheduleHelperSectionProps> = ({ task, formatDateTime }) => (
  <section className="p-6 lg:p-8">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-2 h-8 bg-green-500 rounded-full" />
      <h3 className="text-lg font-semibold text-gray-900">Schedule & Helper</h3>
    </div>
    <div className="space-y-5">
      <div className="group">
        <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Scheduled Date</dt>
        <dd className="text-gray-900 font-medium">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="text-lg font-semibold text-blue-900">{formatDateTime(task.prefferedDate)}</div>
          </div>
        </dd>
      </div>
      <div className="group">
        <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Task Creator</dt>
        <dd>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-700">
                {task.createdBy?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <div className="font-medium text-gray-900">{task.createdBy?.name || 'Unknown User'}</div>
              {task.createdBy?.email && (
                <div className="text-sm text-gray-500">{task.createdBy.email}</div>
              )}
            </div>
          </div>
        </dd>
      </div>
      <div className="group">
        <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Task Status</dt>
        <dd>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${
              task.task_status === 'completed'
                ? 'bg-green-100 text-green-800'
                : task.task_status === 'in_progress'
                ? 'bg-blue-100 text-blue-800'
                : task.task_status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {task.task_status || 'Pending'}
          </span>
        </dd>
      </div>
    </div>
  </section>
);