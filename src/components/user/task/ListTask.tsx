import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import NavbarLanding from '../common/Navbar-Landing';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../../../hooks/useTasks';
import { newTaskDetails, TaskStatus, PaymentStatus } from '../../../types/newTaskDetails';
import Chat from './ChatWithHelper';
import PaymentButton from '../payment/PaymentButton';
import { TaskComplete } from '../../../api/taskApiRequests';
import { toast } from 'react-toastify';

// Status badge component for better visual distinction
const StatusBadge = ({ status }: { status: TaskStatus }) => {
  let bgColor = '';
  let textColor = '';
  
  switch (status) {
    case "completed":
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case "assigned":
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
    case "in_progress":
      bgColor = 'bg-violet-100';
      textColor = 'text-violet-800';
      break;
    case "cancelled":
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    case "pending":
    default:
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      break;
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {status || "pending"}
    </span>
  );
};

// Category icon component to add visual cues
const CategoryIcon = ({ category }: { category: string }) => {
  let icon = '📋'; // Default icon
  
  switch (category.toLowerCase()) {
    case 'handyman':
      icon = '🔧';
      break;
    case 'cleaning':
      icon = '🧹';
      break;
    case 'garden':
      icon = '🌱';
      break;
    default:
      icon = '📋';
  }
  
  return <span className="text-xl mr-2">{icon}</span>;
};

const TaskListPage: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<newTaskDetails | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const { user } = useSelector((state: RootState) => state.auth);
  const { tasks, isLoading, error } = useTasks(user?.id);
  const [isCompleting, setIsCompleting] = useState<string | null>(null); // Track task being completed
  const navigate = useNavigate();

  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatTaskId, setChatTaskId] = useState<string>('');
  const [chatHelperId, setChatHelperId] = useState<string>('');
  const [HelperName, setHelperName] = useState<string>('');

  // Debug tasks with missing IDs
  useEffect(() => {
    tasks.forEach(task => {
      if (!task._id) {
        console.warn('Task with missing ID:', task);
      }
    });
  }, [tasks]);

  const formatDateTime = (timestamp: number, date: string | Date) => {
    const dateObj = new Date(date);
    const time = new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${dateObj.toLocaleDateString()} at ${time}`;
  };

  const formatCreatedAt = (isoString: string) => {
    return new Date(isoString).toLocaleString();
  };

  const handleChat = (taskId: string | undefined, helperId: string | undefined,assignedHelperName:string) => {
    console.log('handleChat called', { taskId, helperId });
    if (!taskId || !helperId || !user?.id) {
      console.warn('Cannot open chat: Invalid taskId, helperId, or userId', { taskId, helperId,assignedHelperName, userId: user?.id });
      return;
    }
    setChatTaskId(taskId);
    setChatHelperId(helperId);
    setHelperName(assignedHelperName);
    setChatOpen(true);
    setSelectedTask(null); // Close task details modal
    console.log('Opening chat with', { taskId, helperId });
  };

  const handleChangeHelper = (taskId: string | undefined) => {
    if (taskId) {
      console.log(`Changing helper for task ${taskId}`);
      setSelectedTask(null);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.task_status?.toLowerCase() === filter.toLowerCase();
  });

  // Calculate statistics for the dashboard
  const completedTasks = tasks.filter(task => task.task_status === "completed").length;
  const pendingTasks = tasks.filter(task => task.task_status === "completed").length;
  const scheduledTasks = tasks.filter(task => task.task_status === "assigned" || task.task_status === "in_progress").length;

  const handleTaskComplete = async (taskId: string | undefined) => {
    if (!taskId) {
      toast.error('Invalid task ID');
      return;
    }
    setIsCompleting(taskId);
    try {
      const success = await TaskComplete(taskId);
      if (success) {
        toast.success('Task marked as complete!');
        // Optionally refetch tasks or update state
        setSelectedTask(null); // Close modal
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to mark task as complete';
      toast.error(message);
    } finally {
      setIsCompleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarLanding />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-violet-900">Your Tasks</h1>
            <p className="mt-2 text-sm text-gray-600">Manage and track all your neighborhood tasks in one place</p>
          </div>

          {/* Stats overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-violet-700">
              <p className="text-sm text-gray-600 uppercase">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900">{tasks.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <p className="text-sm text-gray-600 uppercase">Completed</p>
              <p className="text-3xl font-bold text-gray-900">{completedTasks}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
              <p className="text-sm text-gray-600 uppercase">Pending</p>
              <p className="text-3xl font-bold text-gray-900">{pendingTasks}</p>
            </div>
          </div>

          {/* Filters and actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
            <div className="flex space-x-2">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'all' ? 'bg-violet-700 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setFilter('all')}
              >
                All Tasks
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setFilter('pending')}
              >
                Pending
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'assigned' ? 'bg-violet-700 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setFilter('assigned')}
              >
                Assigned
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'in_progress' ? 'bg-violet-700 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setFilter('in_progress')}
              >
                In Progress
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'completed' ? 'bg-green-600 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'cancelled' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setFilter('cancelled')}
              >
                Cancelled
              </button>
            </div>

            <button
              onClick={() => navigate('/create-task')}
              className="bg-violet-700 hover:bg-violet-800 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Create New Task
            </button>
          </div>

          {/* Tasks list */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-700"></div>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900">Error loading tasks</h3>
              <p className="mt-2 text-gray-600">Please try again later.</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks found</h3>
              <p className="mt-2 text-gray-600">
                {filter === 'all' ? "You haven't created any tasks yet. Click 'Create New Task' to get started." : `You don't have any ${filter} tasks.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map((task) => (
                <div
                  key={task._id }
                  className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <CategoryIcon category={task.category} />
                        <h2 className="text-lg font-semibold text-gray-800">
                          {task.category} - {task.subCategory}
                        </h2>
                      </div>
                      <StatusBadge status={task.task_status || "pending"} />
                    </div>

                    <p className="mt-3 text-gray-600 line-clamp-2">{task.description}</p>

                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {formatDateTime(task.timeSlot.startTime, task.prefferedDate)}
                    </div>

                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      ₹{task.ratePerHour} / hour
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
  <div className="flex items-center">
    {task.assignedNeighbor ? (
      <span className="text-sm text-gray-600">Helper Assigned: {task.assignedNeighbor.name}</span>
    ) : (
      <span className="text-sm text-gray-500 italic">No helper assigned</span>
    )}
  </div>

  <div className="flex items-center space-x-2">
    {task.assignedNeighbor && (
      <button
        className="text-violet-700 hover:text-violet-800 text-sm font-medium"
        onClick={(e) => {
          e.stopPropagation();
          handleChat(task._id, task.assignedNeighbor?._id!, task.assignedNeighbor?.name!);
        }}
      >
        Chat
      </button>
    )}

<PaymentButton task={task} navigate={navigate} />
  </div>
</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {selectedTask && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-violet-50 to-white">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
          <CategoryIcon category={selectedTask.category}  />
          <div>
            <span className="block text-violet-800">{selectedTask.category}</span>
            <span className="block text-sm text-gray-500 font-normal mt-0.5">{selectedTask.subCategory}</span>
          </div>
        </h2>
        <div className="flex items-center gap-3">
          <StatusBadge status={selectedTask.task_status || "pending"} />
          <button 
            className="text-gray-400 hover:text-gray-700 transition-colors"
            onClick={() => setSelectedTask(null)}
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Task Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-medium text-violet-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  Task Details
                </h3>
                <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Description</span>
                    <p className="text-gray-800 font-medium">{selectedTask.description}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Location</span>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <p className="text-gray-800 font-medium">{selectedTask.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-medium text-violet-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Scheduling
                </h3>
                <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Scheduled Time</span>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <p className="text-gray-800 font-medium">{formatDateTime(selectedTask.timeSlot.startTime, selectedTask.prefferedDate)}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Helper</span>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      <p className="text-gray-800 font-medium">
                        {selectedTask.assignedNeighbor ? (
                          selectedTask.assignedNeighbor.name
                        ) : (
                          <span className="text-amber-600">Not assigned yet</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Task Code Section */}
          {(selectedTask.payment_status === 'paid' && selectedTask.task_status === 'assigned') && (
            <div className="mb-8 bg-green-50 border border-green-100 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                <p className="text-green-800 font-medium">Task is ready to start</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-green-100 mb-2">
                <span className="text-xs text-gray-500 block mb-1">Task Code</span>
                <p className="text-lg font-mono font-semibold text-center tracking-wider text-gray-800">{selectedTask.task_code}</p>
              </div>
              <p className="text-sm text-green-700">To start the task, share this code with the assigned Helper</p>
            </div>
          )}

          {/* Payment Information */}
          <div className="mb-8">
            <h3 className="text-xs font-medium text-violet-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Payment Information
            </h3>
            <div className="bg-gradient-to-r from-violet-50 to-white rounded-xl p-5 border border-violet-100">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-4 lg:mb-0">
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Est. Hours</span>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <p className="text-gray-800 font-medium">{selectedTask.est_hours}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Rate</span>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <p className="text-gray-800 font-medium">₹{selectedTask.ratePerHour}/hour</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Payment Status</span>
                    <div className="flex items-center gap-2">
                      {selectedTask.payment_status === 'paid' ? (
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      )}
                      <p className="text-gray-800 font-medium capitalize">{selectedTask.payment_status || PaymentStatus.PENDING}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-violet-100 w-full lg:w-auto">
                  <span className="text-xs text-gray-500 block mb-1">Total Amount</span>
                  <p className="text-gray-900 text-xl font-semibold">₹{selectedTask.ratePerHour * selectedTask.est_hours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* In Progress Action */}
          {selectedTask.task_status === 'in_progress' && (
        <div className="mb-8">
          <button
            onClick={() => handleTaskComplete(selectedTask._id)}
            disabled={isCompleting === selectedTask._id}
            aria-busy={isCompleting === selectedTask._id}
            aria-label="Mark task as complete"
            className={`w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${
              isCompleting === selectedTask._id ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {isCompleting === selectedTask._id ? 'Marking...' : 'Mark Task Complete'}
          </button>
        </div>
      )}

          {/* Timeline */}
          <div>
            <h3 className="text-xs font-medium text-violet-600 uppercase tracking-wider mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              Task Progress
            </h3>
            <div className="relative bg-gray-50 p-5 rounded-xl">
              <div className="absolute top-0 left-6 h-full w-0.5 bg-violet-100"></div>
              <div className="space-y-8">
                <div className="relative flex items-start">
                  <div className="absolute mt-1 h-6 w-6 rounded-full border-2 border-violet-200 bg-violet-100 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-violet-600"></div>
                  </div>
                  <div className="ml-12">
                    <p className="text-sm font-medium text-gray-800">Task Created</p>
                    <p className="text-xs text-gray-500 mt-1">{formatCreatedAt(selectedTask.prefferedDate.toString())}</p>
                  </div>
                </div>

                {selectedTask.assignedNeighbor && (
                  <div className="relative flex items-start">
                    <div className="absolute mt-1 h-6 w-6 rounded-full border-2 border-violet-200 bg-violet-100 flex items-center justify-center">
                      <div className="h-3 w-3 rounded-full bg-violet-600"></div>
                    </div>
                    <div className="ml-12">
                      <p className="text-sm font-medium text-gray-800">Helper Assigned</p>
                      <p className="text-xs text-gray-500 mt-1">Helper: {selectedTask.assignedNeighbor.name}</p>
                    </div>
                  </div>
                )}

                {(selectedTask.task_status === "assigned" || selectedTask.task_status === "in_progress") && (
                  <div className="relative flex items-start">
                    <div className="absolute mt-1 h-6 w-6 rounded-full border-2 border-violet-200 bg-violet-100 flex items-center justify-center">
                      <div className="h-3 w-3 rounded-full bg-violet-600"></div>
                    </div>
                    <div className="ml-12">
                      <p className="text-sm font-medium text-gray-800">Task Scheduled</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDateTime(selectedTask.timeSlot.startTime, selectedTask.prefferedDate)}</p>
                    </div>
                  </div>
                )}

                {selectedTask.task_status === "in_progress" && (
                  <div className="relative flex items-start">
                    <div className="absolute mt-1 h-6 w-6 rounded-full border-2 border-blue-200 bg-blue-100 flex items-center justify-center">
                      <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                    </div>
                    <div className="ml-12">
                      <p className="text-sm font-medium text-gray-800">Task In Progress</p>
                      <p className="text-xs text-gray-500 mt-1">Helper is working on your task</p>
                    </div>
                  </div>
                )}

                {selectedTask.task_status === "completed" && (
                  <div className="relative flex items-start">
                    <div className="absolute mt-1 h-6 w-6 rounded-full border-2 border-green-200 bg-green-100 flex items-center justify-center">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="ml-12">
                      <p className="text-sm font-medium text-gray-800">Task Completed</p>
                      <p className="text-xs text-gray-500 mt-1">Great job!</p>
                    </div>
                  </div>
                )}

                {selectedTask.task_status === "cancelled" && (
                  <div className="relative flex items-start">
                    <div className="absolute mt-1 h-6 w-6 rounded-full border-2 border-red-200 bg-red-100 flex items-center justify-center">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    </div>
                    <div className="ml-12">
                      <p className="text-sm font-medium text-gray-800">Task Cancelled</p>
                      <p className="text-xs text-gray-500 mt-1">This task was cancelled</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
        {!selectedTask.assignedNeighbor && selectedTask.task_status === "pending" && (
          <button
            className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
            onClick={() => handleChangeHelper(selectedTask._id)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            Find Helper
          </button>
        )}
        {selectedTask.assignedNeighbor && (
          <button
            className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
            onClick={() => handleChat(selectedTask._id, selectedTask.assignedNeighbor?._id!, selectedTask.assignedNeighbor?.name!)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            Chat with Helper
          </button>
        )}
        <button
          className="border border-gray-200 text-gray-700 hover:bg-gray-100 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          onClick={() => setSelectedTask(null)}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

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

export default TaskListPage;