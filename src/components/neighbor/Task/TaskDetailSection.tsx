import React from 'react';
import { DetailItem } from './DetailItem';
import { newTaskDetails } from '../../../types/newTaskDetails';

interface TaskDetailsSectionProps {
  task: newTaskDetails;
}

export const TaskDetailsSection: React.FC<TaskDetailsSectionProps> = ({ task }) => (
  <section className="p-6 lg:p-8">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-2 h-8 bg-blue-500 rounded-full" />
      <h3 className="text-lg font-semibold text-gray-900">Task Details</h3>
    </div>
    <div className="space-y-5">
      <DetailItem label="Description" value={task.description} />
      <div className="grid grid-cols-2 gap-4">
        <DetailItem label="Location" value={task.location} />
        <DetailItem
  label={task?.actual_hours ? "Task Duration" : "Est. Hours"}
  value={
    task?.actual_hours != null && task.actual_hours !== 0
      ? `${task.actual_hours} hours`
      : task?.est_hours != null && task.est_hours !== ""
      ? `${task.est_hours} hours`
      : "N/A"
  }/>      </div>
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        {task.base_amount ? (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Service Charge</span>
            <span className="font-semibold text-gray-900">₹{task.base_amount}</span>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Service Charge</span>
            <span className="font-semibold text-gray-900">₹{task.est_amount}</span>
          </div>
        )}
        
        {task.base_amount && (
          <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold text-gray-900">Price</span>
            <span className="text-xl font-bold text-blue-600">
              ₹{task.base_amount}
            </span>
          </div>
          </div>
        )}
        
        
      </div>
      <div className="group">
        <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Payment Status</dt>
        <dd>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${
              task.payment_status === 'paid'
                ? 'bg-green-100 text-green-800'
                : task.payment_status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : task.payment_status === 'disputed'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {task.payment_status || 'pending'}
          </span>
        </dd>
      </div>
    </div>
  </section>
);