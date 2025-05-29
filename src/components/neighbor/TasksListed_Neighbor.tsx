import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { PaymentStatus, TaskStatus, newTaskDetails } from '../../types/newTaskDetails';
import { RootState } from '../../redux/store';
import { useTasks } from '../../hooks/useTasks';
import NavbarLanding from '../layout/Navbar-Landing';
import Chat from '../user/task/ChatWithHelper';
import { acceptTask } from '../../api/taskApiRequests';
import { toast } from 'react-toastify';
import { StatusBadge } from './StatusBadge';
import { CategoryIcon } from './CategoryIcon';





interface TaskListedNeighborProps {
  onTaskSelect: (taskId: string) => void;
}

const TaskListed_Neighbor: React.FC<TaskListedNeighborProps> = ({ onTaskSelect }) => {
  const [filter, setFilter] = useState<string>('all');
  const { user } = useSelector((state: RootState) => state.auth);
  const { tasks, isLoading, error } = useTasks(user?.id,user?.type!);
  
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatTaskId, setChatTaskId] = useState<string>('');
  const [chatHelperId, setChatHelperId] = useState<string>('');
  const [HelperName, setHelperName] = useState<string>('');

  const handlePaymentRequest = (taskId: string, amount: number) => {
    console.log(`Requesting payment for task ${taskId} with amount $${amount}`);
  };

  useEffect(() => {
    tasks.forEach(task => {
      if (!task._id) {
        console.warn('Task with missing ID:', task);
      }
    });
  }, [tasks]);

  const formatDateTime = (time: string, date: string | Date) => {
    const dateObj = new Date(date);
    // const time = new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${dateObj.toLocaleDateString()} at ${time}`;
  };

  const handleChat = (taskId: string | undefined, helperId: string | undefined, assignedHelperName: string) => {
    console.log('handleChat called', { taskId, helperId, assignedHelperName });
    if (!taskId || !helperId || !user?.id) {
      console.warn('Cannot open chat: Invalid taskId, helperId, or userId', { taskId, helperId, assignedHelperName, userId: user?.id });
      return;
    }
    setChatTaskId(taskId);
    setChatHelperId(helperId);
    setHelperName(assignedHelperName);
    setChatOpen(true);
    console.log('Opening chat with', { taskId, helperId });
  };

  const handleChangeHelper = (taskId: string | undefined) => {
    if (taskId) {
      console.log(`Changing helper for task ${taskId}`);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.task_status?.toLowerCase() === filter.toLowerCase();
  });

  // Calculate statistics for the dashboard
  const completedTasks = tasks.filter(task => task.task_status === "completed").length;
  const pendingTasks = tasks.filter(task => task.task_status === "pending").length;
  const scheduledTasks = tasks.filter(task => task.task_status === "assigned" || task.task_status === "in_progress").length;

  async function handleAcceptTask(taskId: string | undefined): Promise<void> {
    try {
      if (!taskId) throw new Error("task Id is required to accept task");
      const accept = await acceptTask(taskId);
      if (accept) toast.info("You accepted this task. Let the user make payment");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen ">
      <div className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-violet-950">Your Neighborhood Tasks</h1>
            <p className="mt-2 text-sm text-gray-600">Manage your tasks and connect with neighbors</p>
          </div>

          {/* Stats Cards with Shadow Effects */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-b-4 border-violet-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium uppercase text-violet-500">Total Tasks</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{tasks.length}</p>
                </div>
                <div className="bg-violet-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-b-4 border-emerald-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium uppercase text-emerald-500">Completed</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{completedTasks}</p>
                </div>
                <div className="bg-emerald-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-b-4 border-amber-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium uppercase text-amber-500">Pending</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{pendingTasks}</p>
                </div>
                <div className="bg-amber-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Filters with pill design */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-8">
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'all' ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setFilter('all')}
              >
                All Tasks
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'pending' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setFilter('pending')}
              >
                Pending
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'assigned' ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setFilter('assigned')}
              >
                Assigned
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'in_progress' ? 'bg-violet-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setFilter('in_progress')}
              >
                In Progress
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'completed' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'cancelled' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setFilter('cancelled')}
              >
                Cancelled
              </button>
            </div>
          </div>

          {/* Tasks list with improved cards */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mt-4">Error loading tasks</h3>
              <p className="mt-2 text-gray-600">Please try again later or refresh the page.</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks found</h3>
              <p className="mt-2 text-gray-600">
                {filter === 'all' ? "You haven't created any tasks yet." : `You don't have any ${filter} tasks at the moment.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                  onClick={() => onTaskSelect(task._id!)}
                >
                  <div className="px-5 py-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <CategoryIcon category={task.category} />
                        <div>
                          <h2 className="text-lg font-semibold text-gray-800">
                            {task.category}
                          </h2>
                          <p className="text-sm text-violet-600">{task.subCategory}</p>
                        </div>
                      </div>
                      <StatusBadge status={task.task_status || "pending"} />
                    </div>

                    <p className="mt-3 text-gray-600 line-clamp-2 min-h-[3rem]">{task.description}</p>

                    <div className="mt-4 flex flex-col space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {formatDateTime(task.prefferedTime, task.prefferedDate)}
                      </div>

                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                        <span className="font-medium text-violet-800">₹{task.ratePerHour}</span> / hour
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          {task.createdBy?.name ? (
                            <div className="flex items-center">
                              <div className="h-8 w-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-800 font-medium mr-2">
                                {task.createdBy.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm text-gray-600">{task.createdBy.name}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500 italic">Unknown</span>
                          )}
                        </div>

                        {task.createdBy && (
                          <button
                            className="flex items-center text-violet-600 hover:text-violet-800 text-sm font-medium bg-violet-50 hover:bg-violet-100 px-3 py-1 rounded-full transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleChat(task._id, task.createdBy?._id!, task.createdBy?.name!);
                            }}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                            </svg>
                            Chat
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Component */}
      {chatOpen && user?.id && (
        <Chat
          userId={user.id}
          helperId={chatHelperId}
          helperName={HelperName}
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  );
};

export default TaskListed_Neighbor;