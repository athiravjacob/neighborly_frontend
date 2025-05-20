import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { PaymentStatus, TaskStatus, newTaskDetails } from '../../types/newTaskDetails';
import { useTasks } from '../../hooks/useTasks';
import { toast } from 'react-toastify';
import { VerifyCode, acceptTask } from '../../api/taskApiRequests';
import Chat from '../user/task/ChatWithHelper';

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

interface TaskDetailsProps {
  taskId: string;
  onBack: () => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ taskId, onBack }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { tasks } = useTasks(user?.id,user?.type!);
  const selectedTask = tasks.find(task => task._id === taskId);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatTaskId, setChatTaskId] = useState<string>('');
  const [chatHelperId, setChatHelperId] = useState<string>('');
  const [HelperName, setHelperName] = useState<string>('');
  const [isCodeInputOpen, setIsCodeInputOpen] = useState<boolean>(false);
  const [codeInput, setCodeInput] = useState<string>('');
  const [verifying, setVerifying] = useState<boolean>(false);

  const formatDateTime = (timestamp: number, date: string | Date) => {
    const dateObj = new Date(date);
    const time = new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${dateObj.toLocaleDateString()} at ${time}`;
  };

  const formatCreatedAt = (isoString: string) => {
    return new Date(isoString).toLocaleString();
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
  };

  const handleChangeHelper = (taskId: string | undefined) => {
    if (taskId) {
      console.log(`Changing helper for task ${taskId}`);
    }
  };

  async function handleAcceptTask(taskId: string | undefined): Promise<void> {
    try {
      if (!taskId) throw new Error("task Id is required to accept task");
      const accept = await acceptTask(taskId);
      if (accept) toast.info("You accepted this task. Let the user make payment");
    } catch (error) {
      console.log(error);
    }
  }

  // Show input field for 6-digit alphanumeric code
  const handleStartTask = () => {
    if (!selectedTask?._id) {
      toast.error("Task ID is required to start task");
      return;
    }
    setIsCodeInputOpen(true);
  };

  // Verify the 6-digit alphanumeric code
  const verifyCodeAndStartTask = async () => {
    if (!selectedTask?._id || !selectedTask.createdBy?._id) {
      toast.error("Task ID or Helper ID is missing");
      return;
    }

    try {
      setVerifying(true);
      const isVerified = await VerifyCode(selectedTask._id, selectedTask.createdBy._id, codeInput);

      if (isVerified) {
        toast.success("Code verified successfully. Task started!");
        // Reset code input state
        setIsCodeInputOpen(false);
        setCodeInput('');
        // Refresh tasks or update state (simulating a page refresh for demo)
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error("Invalid code. Please try again.");
      }
    } catch (error: any) {
      console.error("Failed to verify code:", error);
      toast.error(error.message || "Failed to verify code. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  // Reset code input
  const cancelCodeVerification = () => {
    setIsCodeInputOpen(false);
    setCodeInput('');
  };

  if (!selectedTask) {
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
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gray-50 py-4 px-6 border-b border-gray-200 flex justify-between items-center">
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

            {/* Task Actions */}
            <div className="space-y-4">
              {/* Accept Task Button */}
              {selectedTask.task_status === "pending" && (
                <button
                  onClick={() => handleAcceptTask(selectedTask._id)}
                  className="inline-flex items-center px-4 py-2 bg-violet-700 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition duration-200"
                >
                  Accept Task
                </button>
              )}

              {/* Start Task Button (appears for assigned tasks) */}
              {selectedTask.task_status === "assigned" && !isCodeInputOpen && (
                <button
                  onClick={handleStartTask}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  Start Task
                </button>
              )}

              {/* Code Input Area */}
              {isCodeInputOpen && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Enter Verification Code</h4>
                  <p className="text-xs text-gray-500 mb-3">
                    Please enter the 6-digit alphanumeric code provided by {selectedTask.createdBy?.name || "the user"}.
                  </p>
                  
                  <div className="flex space-x-2 mb-4">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit code"
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value.replace(/[^a-zA-Z0-9]/g, '').substring(0, 6).toUpperCase())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-center text-lg font-mono"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={verifyCodeAndStartTask}
                      disabled={codeInput.length !== 6 || verifying}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 bg-green-600 text-white font-medium text-sm rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {verifying ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Verifying...
                        </>
                      ) : (
                        "Verify & Start Task"
                      )}
                    </button>
                    <button
                      onClick={cancelCodeVerification}
                      className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

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
                        <p> {selectedTask.createdBy.name}</p>
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

                  {selectedTask.task_status === "in_progress" && (
                    <div className="relative flex items-start">
                      <div className="absolute mt-1 ml-1 h-6 w-6 rounded-full border-2 border-violet-700 bg-white"></div>
                      <div className="ml-12">
                        <p className="text-sm font-medium text-gray-900">Task Started</p>
                        <p className="text-xs text-gray-500">Work in progress</p>
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

          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.in_progressM12 12h.in_progressM16 12h.in_progressM21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 in_progress-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                Chat with Helper
              </button>
            )}
            <button
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium"
              onClick={onBack}
            >
              Back to Tasks
            </button>
          </div>
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

export default TaskDetails;