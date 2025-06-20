import React from 'react';
import { useTaskDetails } from '../../hooks/useTaskDetails';
import { CategoryIcon } from './CategoryIcon';
import { StatusBadge } from './StatusBadge';
import { TaskDetailsSection } from './Task/TaskDetailSection';
import { ScheduleHelperSection } from './Task/ScheduleHelperSection';
import { formatCreatedAt, formatDateTime } from '../../utilis/formatDate';
import { TaskActionsSection } from './Task/TaskActionSection';
import { TaskTimeline } from './Task/TaskTimeline';
import { TaskFooterActions } from './Task/TaskFooterActions';
import Chat from '../user/task/ChatWithHelper';


interface TaskDetailsProps {
  taskId: string;
  onBack: () => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ taskId, onBack }) => {
  const {
    task,
    taskAcceptanceForm,
    isCodeInputOpen,
    codeInput,
    verifying,
    chatOpen,
    chatTaskId,
    chatHelperId,
    helperName,
    setChatOpen,
    handleFormChange,
    handleAcceptTask,
    handleChat,
    handleStartTask,
    verifyCodeAndStartTask,
    cancelCodeVerification,
  } = useTaskDetails(taskId);

  if (!task) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900">Task not found</h3>
        <p className="mt-2 text-gray-600">The task you are looking for does not exist.</p>
        <button
          className="mt-4 bg-violet-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          onClick={onBack}
        >
          Back to Tasks
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <header className="bg-gray-50 py-4 px-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <CategoryIcon category={task.category} />
            {task.category} - {task.subCategory}
          </h2>
          <StatusBadge status={task.task_status || 'pending'} />
        </header>
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
              <TaskDetailsSection task={task} />
              <ScheduleHelperSection task={task} formatDateTime={formatDateTime} />
            </div>
          </div>
          <TaskActionsSection
            task={task}
            taskAcceptanceForm={taskAcceptanceForm}
            isCodeInputOpen={isCodeInputOpen}
            codeInput={codeInput}
            verifying={verifying}
            handleFormChange={handleFormChange}
            handleAcceptTask={handleAcceptTask}
            handleStartTask={handleStartTask}
            verifyCodeAndStartTask={verifyCodeAndStartTask}
            cancelCodeVerification={cancelCodeVerification}
            handleChat={handleChat}
          />
          <TaskTimeline task={task} formatDateTime={formatDateTime} formatCreatedAt={formatCreatedAt} />
        </div>
        <TaskFooterActions task={task} handleChat={handleChat} onBack={onBack} />
      </div>
      {chatOpen && (
        <Chat
          userId={task.createdBy?.id!}
          helperId={chatHelperId}
          helperName={helperName}
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  );
};

export default TaskDetails;