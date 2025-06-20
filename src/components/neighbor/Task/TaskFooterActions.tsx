import React from 'react';
import { Icon } from './Icon';
import { newTaskDetails } from '../../../types/newTaskDetails';

interface TaskFooterActionsProps {
  task: newTaskDetails;
  handleChat: (taskId: string | undefined, helperId: string | undefined, name: string) => void;
  onBack: () => void;
}

export const TaskFooterActions: React.FC<TaskFooterActionsProps> = ({ task, handleChat, onBack }) => {
  const buttonBaseClasses =
    'px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200';
  const primaryButtonClasses = `${buttonBaseClasses} bg-violet-700 text-white hover:bg-violet-800`;
  const secondaryButtonClasses = `${buttonBaseClasses} bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`;

  return (
    <footer className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
      {!task.assignedNeighbor && task.task_status === 'pending' && (
        <button
          className={primaryButtonClasses}
          onClick={() => handleChat(task._id, task.createdBy?.id, task.createdBy?.name || '')}
        >
          Find Helper
        </button>
      )}
      {task.assignedNeighbor && (
        <button
          className={primaryButtonClasses}
          onClick={() => handleChat(task._id, task.createdBy?.id, task.createdBy?.name || '')}
        >
          <Icon
            className="w-4 h-4 mr-2"
            path="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
          Chat with Helper
        </button>
      )}
      <button className={secondaryButtonClasses} onClick={onBack}>
        Back to Tasks
      </button>
    </footer>
  );
};