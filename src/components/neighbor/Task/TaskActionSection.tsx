import React, { useState } from 'react';
import { Icon } from './Icon';
import { newTaskDetails } from '../../../types/newTaskDetails';

interface TaskAcceptanceForm {
  estimatedHours: number;
  paymentAmount: number;
  arrivalTime: number | null;
  formattedArrivalTime?: string;
}

interface TaskActionsSectionProps {
  task: newTaskDetails;
  taskAcceptanceForm: TaskAcceptanceForm;
  isCodeInputOpen: boolean;
  codeInput: string;
  verifying: boolean;
  handleFormChange: (field: string, value: string) => void;
  handleAcceptTask: (taskId: string | undefined) => void;
  handleStartTask: () => void;
  verifyCodeAndStartTask: () => void;
  cancelCodeVerification: () => void;
  handleChat: (taskId: string | undefined, helperId: string | undefined, name: string) => void;
}

export const TaskActionsSection: React.FC<TaskActionsSectionProps> = ({
  task,
  taskAcceptanceForm,
  isCodeInputOpen,
  codeInput,
  verifying,
  handleFormChange,
  handleAcceptTask,
  handleStartTask,
  verifyCodeAndStartTask,
  cancelCodeVerification,
  handleChat,
}) => {


  const [tempHours, setTempHours] = useState<string>(
    taskAcceptanceForm.estimatedHours ? taskAcceptanceForm.estimatedHours.toString() : ''
  );
  // Helper function to format arrivalTime if formattedArrivalTime isn't provided
  const formatTime = (minutes: number) => {
    let hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const isPM = hours >= 12;
    const displayHours = hours % 12 === 0 ? 12 : hours % 12; // convert 0 or 12 to 12
    const ampm = isPM ? 'PM' : 'AM';
  
    return `${displayHours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${ampm}`;
  };
  
  // Handle OK button click to trigger API call
  const handleOkClick = () => {
    if (tempHours) {
      handleFormChange('estimatedHours', tempHours);
    }
  };

  return (
    <>
      {task.task_status === 'pending' && (
        <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl border border-gray-100">
          {/* Gradient Header */}
          <div className="relative bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-8 py-6">
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="relative flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                  <Icon className="w-6 h-6 text-white" path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </div>
              </div>
              <div className="ml-5">
                <h3 className="text-xl font-bold text-white">Accept This Task</h3>
                <p className="text-sm text-white leading-relaxed">
                  Based on similar tasks, this typically requires <span className="font-semibold">{task.est_hours} hours</span>. 
                  Please review the task description carefully and provide your realistic time estimate. 
                  <span className="font-medium"> Use chat to clarify requirements if needed before accepting.</span>
                </p>              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Service Estimation Card */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-6 border border-gray-200/50 shadow-sm">
             

              <div className="space-y-6">
                
                {/* Hours Input */}
                {task.est_hours && (
                  
                  <div className="group">
                   
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Actual Hours Needed 
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <Icon 
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" 
                        path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                      <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        max={parseFloat(task.est_hours.split('-')[1]) || undefined}
                        value={tempHours}
                        onChange={(e) => setTempHours(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 shadow-sm hover:shadow-md"
                        placeholder="Enter hours (e.g., 4.0)"
                      />
<button
                          onClick={handleOkClick}
                          disabled={!tempHours || parseFloat(tempHours) <= 0}
                          className="px-4 py-2 bg-violet-600 text-white font-medium text-sm rounded-xl shadow-sm hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                        >
                          OK
                        </button>                    </div>
                    <p className="text-xs text-gray-500 mt-2 ml-1">
                      Estimated range: <span className="font-medium">{task.est_hours} hours</span>
                    </p>
                  </div>
                )}

                {/* Payment Display */}
                {taskAcceptanceForm.paymentAmount && (
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-200/50 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                          <Icon className="w-4 h-4 text-emerald-600" path="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Service charge</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-emerald-700">₹{taskAcceptanceForm.paymentAmount}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Schedule Display */}
                {taskAcceptanceForm.arrivalTime && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200/50 shadow-sm">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <Icon className="w-4 h-4 text-blue-600" path="M12 6v6l4 2" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Scheduled Time</p>
                        <p className="text-lg font-semibold text-blue-700">{formatTime(taskAcceptanceForm.arrivalTime)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleAcceptTask(task._id)}
                disabled={
                  !taskAcceptanceForm.estimatedHours ||
                  !taskAcceptanceForm.paymentAmount ||
                  taskAcceptanceForm.arrivalTime === null
                }
                className="flex-1 relative overflow-hidden inline-flex justify-center items-center px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
                <Icon className="w-5 h-5 mr-3 relative z-10" path="M5 13l4 4L19 7" />
                <span className="relative z-10">Accept Task & Send Quote</span>
              </button>
              
              <button
                onClick={() => handleChat(task._id, task.createdBy?.id, task.createdBy?.name || '')}
                className="inline-flex justify-center items-center px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold text-sm rounded-xl shadow-sm hover:shadow-md hover:border-violet-300 hover:text-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-all duration-200 hover:scale-[1.02]"
              >
                <Icon className="w-5 h-5 mr-3" path="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                Chat First
              </button>
            </div>

            
          </div>
        </div>
      )}

      {task.task_status === 'assigned' && (
        <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl border border-gray-100">
          {/* Gradient Header */}
          <div className="relative bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 px-8 py-6">
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="relative flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                  <Icon className="w-6 h-6 text-white" path="M13 10V3L4 14h7v7l9-11h-7z" />
                </div>
              </div>
              <div className="ml-5">
                <h3 className="text-xl font-bold text-white">Ready to Start?</h3>
                <p className="text-green-100 text-sm mt-1">Enter the verification code provided by the customer</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {!isCodeInputOpen ? (
              <div className="text-center">
                <button
                  onClick={handleStartTask}
                  className="relative overflow-hidden inline-flex items-center px-12 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
                  <Icon className="w-6 h-6 mr-3 relative z-10" path="M13 10V3L4 14h7v7l9-11h-7z" />
                  <span className="relative z-10">Start Task</span>
                </button>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-6 border border-gray-200/50 shadow-sm">
                <div className="text-center mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Enter Verification Code</h4>
                  <p className="text-sm text-gray-600">
                    Please enter the 6-digit alphanumeric code provided by{' '}
                    <span className="font-medium text-gray-800">{task.createdBy?.name || 'the customer'}</span>
                  </p>
                </div>

                <div className="max-w-sm mx-auto mb-6">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    value={codeInput}
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-center text-2xl font-mono tracking-widest bg-white hover:shadow-md transition-all duration-200"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <button
                    onClick={verifyCodeAndStartTask}
                    disabled={codeInput.length !== 6 || verifying}
                    className="flex-1 relative overflow-hidden inline-flex justify-center items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] disabled:hover:scale-100"
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
                    {verifying ? (
                      <div className="relative z-10 flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Verifying...
                      </div>
                    ) : (
                      <span className="relative z-10">Verify & Start Task</span>
                    )}
                  </button>
                  
                  <button
                    onClick={cancelCodeVerification}
                    className="inline-flex justify-center items-center px-6 py-3 border-2 border-gray-200 shadow-sm text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 hover:scale-[1.02]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};