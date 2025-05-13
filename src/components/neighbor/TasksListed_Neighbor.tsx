import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { PaymentStatus, TaskStatus, newTaskDetails } from '../../types/newTaskDetails';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../../hooks/useTasks';
import NavbarLanding from '../user/common/Navbar-Landing';
import Chat from '../user/task/ChatWithHelper';
import { acceptTask } from '../../api/taskApiRequests';
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
      {status ||"pending"}
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

const TaskListed_Neigbor: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<newTaskDetails | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const { user } = useSelector((state: RootState) => state.auth);
  const { tasks, isLoading, error } = useTasks(user?.id);
  const navigate = useNavigate();

  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatTaskId, setChatTaskId] = useState<string>('');
  const [chatHelperId, setChatHelperId] = useState<string>('');
  const [HelperName, setHelperName] = useState<string>('');

  // Placeholder function for handling payment request
  const handlePaymentRequest = (taskId:string, amount:number) => {
    // This is a placeholder - replace with actual payment request logic
    console.log(`Requesting payment for task ${taskId} with amount $${amount}`);
    // Example: Send request to backend
    // fetch('/api/request-payment', {
    //   method: 'POST',
    //   body: JSON.stringify({ taskId, amount }),
    //   headers: { 'Content-Type': 'application/json' },
    // });
  };

  
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
    console.log('handleChat called', { taskId, helperId,assignedHelperName });
    if (!taskId || !helperId || !user?.id) {
      console.warn('Cannot open chat: Invalid taskId, helperId, or userId', { taskId, helperId,assignedHelperName, userId: user?.id });
      return;
    }
    setChatTaskId(taskId);
    setChatHelperId(helperId);
    setHelperName(assignedHelperName);
    setChatOpen(true);
    setSelectedTask(null);
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
  const pendingTasks = tasks.filter(task => task.task_status === "pending").length;
  const scheduledTasks = tasks.filter(task => task.task_status === "assigned"|| task.task_status === "in_progress").length;

  async function handleAcceptTask(taskId: string | undefined): Promise<void> {
    try {
      if(!taskId) throw new Error("task Id is required to accept task")
      const accept = await acceptTask(taskId)
      if(accept) toast.info("you accepted this task.Let the user make payment")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
                className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'scheduled' ? 'bg-violet-700 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setFilter('scheduled')}
              >
                Scheduled
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
                      <StatusBadge status={task.task_status ||"pending"} />
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
                        {task.createdBy ? (
                          <span className="text-sm text-gray-600">Task created by :{ task.createdBy.name}</span>
                        ) : (
                          <span className="text-sm text-gray-500 italic">Unknown</span>
                        )}
                      </div>

                      {task.createdBy && (
                        <button
                          className="text-violet-700 hover:text-violet-800 text-sm font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChat(task._id, task.createdBy?._id!,task.createdBy?.name!);
                          }}
                        >
                          Chat
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="bg-gray-50 rounded-t-lg py-4 px-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <CategoryIcon category={selectedTask.category} />
              {selectedTask.category} - {selectedTask.subCategory}
            </h2>
            <StatusBadge status={selectedTask.task_status || "pending"} />
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Task Details</h3>
                <div className="space-y-3">
                  <p className="flex items-start">
                    <span className="w-24 text-gray-600 font-medium">Description:</span>
                    <span className="text-gray-900">{selectedTask.description}</span>
                  </p>
                  <p className="flex items-start">
                    <span className="w-24 text-gray-600 font-medium">Location:</span>
                    <span className="text-gray-900">{selectedTask.location}</span>
                  </p>
                  <p className="flex items-start">
                    <span className="w-24 text-gray-600 font-medium">Est. Hours:</span>
                    <span className="text-gray-900">{selectedTask.est_hours}</span>
                  </p>
                  <p className="flex items-start">
                    <span className="w-24 text-gray-600 font-medium">Rate:</span>
                    <span className="text-gray-900">₹{selectedTask.ratePerHour}/hour</span>
                  </p>   
                  <p className="flex items-start">
                    <span className="w-24 text-gray-600 font-medium">Total:</span>
                    <span className="text-gray-900 font-semibold">₹{selectedTask.ratePerHour * selectedTask.est_hours}</span>
                  </p>
                  <p className="flex items-start">
                    <span className="w-24 text-gray-600 font-medium">Payment:</span>
                    <span className="text-gray-900 capitalize">{selectedTask.payment_status || PaymentStatus.PENDING}</span>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Schedule & Helper</h3>
                <div className="space-y-3">
                  <p className="flex items-start">
                    <span className="w-24 text-gray-600 font-medium">Scheduled:</span>
                    <span className="text-gray-900">{formatDateTime(selectedTask.timeSlot.startTime, selectedTask.prefferedDate)}</span>
                  </p>
                  <p className="flex items-start">
                    <span className="w-24 text-gray-600 font-medium">Created By:</span>
                    <span className="text-gray-900">{selectedTask.createdBy ? selectedTask.createdBy?.name : 'Unknown'}</span>
                  </p>
                </div>
              </div>
              </div>
              <div>

              {selectedTask.task_status === "pending" && (
    <button
      onClick={() => handleAcceptTask(selectedTask._id)}
      className="inline-flex items-center px-4 py-2 bg-violet-700 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition duration-200"
    >
      Accept Task
    </button>
  )}         </div>

            {/* Timeline */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Task Timeline</h3>
              <div className="relative">
                <div className="absolute top-0 left-4 h-full w-0.5 bg-gray-200"></div>
                <div className="space-y-6">
                  <div className="relative flex items-start">
                    <div className="absolute mt-1 ml-1 h-6 w-6 rounded-full border-2 border-violet-700 bg-white"></div>
                    <div className="ml-12">
                      <p className="text-sm font-medium text-gray-900">Task Created</p>
                      <p className="text-xs text-gray-500">{formatCreatedAt(selectedTask.prefferedDate.toString())}</p>
                    </div>
                  </div>

                  {selectedTask.createdBy && (
                    <div className="relative flex items-start">
                      <div className="absolute mt-1 ml-1 h-6 w-6 rounded-full border-2 border-violet-700 bg-white"></div>
                      <div className="ml-12">
                        <p className="text-sm font-medium text-gray-900">Task Created By</p>
                        <p className="text-xs text-gray-500">Task Created By: {selectedTask.createdBy.name}</p>
                      </div>
                    </div>
                  )}

                  {(selectedTask.task_status === "assigned" || selectedTask.task_status === "in_progress") && (
                    <div className="relative flex items-start">
                      <div className="absolute mt-1 ml-1 h-6 w-6 rounded-full border-2 border-violet-700 bg-white"></div>
                      <div className="ml-12">
                        <p className="text-sm font-medium text-gray-900">Task Scheduled</p>
                        <p className="text-xs text-gray-500">{formatDateTime(selectedTask.timeSlot.startTime, selectedTask.prefferedDate)}</p>
                      </div>
                    </div>
                  )}

                  {selectedTask.task_status === "completed" && (
                    <div className="relative flex items-start">
                      <div className="absolute mt-1 ml-1 h-6 w-6 rounded-full border-2 border-green-500 bg-white"></div>
                      <div className="ml-12">
                        <p className="text-sm font-medium text-gray-900">Task Completed</p>
                        <p className="text-xs text-gray-500">Great job!</p>
                      </div>
                    </div>
                  )}

                  {selectedTask.task_status === "cancelled" && (
                    <div className="relative flex items-start">
                      <div className="absolute mt-1 ml-1 h-6 w-6 rounded-full border-2 border-red-500 bg-white"></div>
                      <div className="ml-12">
                        <p className="text-sm font-medium text-gray-900">Task Cancelled</p>
                        <p className="text-xs text-gray-500">Task was cancelled</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end space-x-3 border-t border-gray-200">
            {!selectedTask.assignedNeighbor && selectedTask.task_status === "pending" && (
              <button
                className="bg-violet-700 hover:bg-violet-800 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                onClick={() => handleChangeHelper(selectedTask._id)}
              >
                Find Helper
              </button>
            )}
            {selectedTask.assignedNeighbor && (
              <button
                className="bg-violet-700 hover:bg-violet-800 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                onClick={() => handleChat(selectedTask._id, selectedTask.createdBy?._id, selectedTask.createdBy?.name!)}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                Chat with Helper
              </button>
            )}
          
            <button
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium"
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

export default TaskListed_Neigbor