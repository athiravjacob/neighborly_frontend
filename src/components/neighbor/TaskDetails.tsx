import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { PaymentStatus, TaskStatus, newTaskDetails } from '../../types/newTaskDetails';
import { useTasks } from '../../hooks/useTasks';
import { toast } from 'react-toastify';
import { VerifyCode, acceptTask } from '../../api/taskApiRequests';
import Chat from '../user/task/ChatWithHelper';
import { CategoryIcon } from './CategoryIcon';
import { StatusBadge } from './StatusBadge';


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

  // New state for task acceptance form
  const [taskAcceptanceForm, setTaskAcceptanceForm] = useState({
    estimatedHours: 0,
    paymentAmount: 0,
    extraCharges: 0,
    arrivalTime: '',
    materialsCoverage: 'none', // 'none', 'user' or 'helper'
    notes: ''
  });

  const formatDateTime = (time: string, date: string | Date) => {
    const dateObj = new Date(date);
    return `${dateObj.toLocaleDateString()} , ${time}`;
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

  const handleFormChange = (field: string, value: string) => {
    setTaskAcceptanceForm(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      
      // Clear extra charges if not providing materials
      if (field === 'materialsCoverage' && value !== 'helper') {
        updated.extraCharges = 0;
      }
      
      return updated;
    });
  };

  async function handleAcceptTask(taskId: string | undefined): Promise<void> {
    try {
      if (!taskId) throw new Error("task Id is required to accept task");
      
      // Validate form data
      if (!taskAcceptanceForm.estimatedHours || !taskAcceptanceForm.paymentAmount || !taskAcceptanceForm.arrivalTime) {
        toast.error("Please fill in all required fields");
        return;
      }

      const accept = await acceptTask(taskId,user?.id!,taskAcceptanceForm);
      if (accept) {
        toast.success("Task accepted successfully! The user has been notified.");
        // You might want to send the form data to the backend here as well
        console.log('Task acceptance details:', taskAcceptanceForm);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to accept task. Please try again.");
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
        setIsCodeInputOpen(false);
        setCodeInput('');
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
  <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
    {/* Task Details Section */}
    <div className="p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
        <h3 className="text-lg font-semibold text-gray-900">Task Details</h3>
      </div>
      
      <div className="space-y-5">
        <div className="group">
          <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Description
          </dt>
          <dd className="text-gray-900 font-medium leading-relaxed">
            {selectedTask.description}
          </dd>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="group">
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Location
            </dt>
            <dd className="text-gray-900 font-medium">
              {selectedTask.location}
            </dd>
          </div>

          <div className="group">
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Est. Hours
            </dt>
            <dd className="text-gray-900 font-medium">
              {selectedTask.est_hours}
            </dd>
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          {!selectedTask.baseAmount && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Service Charge</span>
              <span className="font-semibold text-gray-900">
                ₹{selectedTask.ratePerHour * selectedTask.est_hours}
              </span>
            </div>
          )}
          
          {selectedTask.baseAmount && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Service Charge</span>
              <span className="font-semibold text-gray-900">
                ₹{selectedTask.baseAmount}
              </span>
            </div>
          )}

          {selectedTask.extra_charges && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Extra Charges</span>
              <span className="font-semibold text-gray-900">
                ₹{selectedTask.extra_charges}
              </span>
            </div>
          )}

          {selectedTask.platform_fee && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Platform Fee</span>
              <span className="font-semibold text-gray-900">
                ₹{selectedTask.platform_fee}
              </span>
            </div>
          )}

          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-base font-semibold text-gray-900">Total Amount</span>
              <span className="text-xl font-bold text-blue-600">
                ₹{selectedTask.final_amount || selectedTask.ratePerHour * selectedTask.est_hours}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <div className="group">
          <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            Payment Status
          </dt>
          <dd>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${
               selectedTask.payment_status === 'paid'
                ? 'bg-green-100 text-green-800'
                : selectedTask.payment_status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : selectedTask.payment_status === 'disputed'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {selectedTask.payment_status || PaymentStatus.PENDING}
            </span>
          </dd>
        </div>
      </div>
    </div>

    {/* Schedule & Helper Section */}
    <div className="p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-8 bg-green-500 rounded-full"></div>
        <h3 className="text-lg font-semibold text-gray-900">Schedule & Helper</h3>
      </div>
      
      <div className="space-y-5">
        <div className="group">
          <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            Scheduled Time
          </dt>
          <dd className="text-gray-900 font-medium">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="text-lg font-semibold text-blue-900">
                {formatDateTime(selectedTask.prefferedTime, selectedTask.prefferedDate)}
              </div>
            </div>
          </dd>
        </div>

        <div className="group">
          <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            Task Creator
          </dt>
          <dd>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-700">
                  {selectedTask.createdBy?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {selectedTask.createdBy?.name || 'Unknown User'}
                </div>
                {selectedTask.createdBy?.email && (
                  <div className="text-sm text-gray-500">
                    {selectedTask.createdBy.email}
                  </div>
                )}
              </div>
            </div>
          </dd>
        </div>

        {/* Additional Info Section */}
        <div className="group">
          <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            Task Status
          </dt>
          <dd>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${
              selectedTask.task_status === 'completed'
                ? 'bg-green-100 text-green-800'
                : selectedTask.task_status === 'in_progress'
                ? 'bg-blue-100 text-blue-800'
                : selectedTask.task_status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {selectedTask.task_status || 'Pending'}
            </span>
          </dd>
        </div>
      </div>
    </div>
  </div>
</div>

           {/* Enhanced Task Actions Section */}
{selectedTask.task_status === "pending" && (
  <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl p-6 border border-violet-200 shadow-sm">
    <div className="flex items-center mb-4">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
      </div>
      <div className="ml-4">
        <h3 className="text-lg font-semibold text-gray-900">Accept This Task</h3>
        <p className="text-sm text-gray-600">Provide your service details to accept this task</p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - Service Details */}
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Service Estimation
          </h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Estimated Hours <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={taskAcceptanceForm.estimatedHours}
                onChange={(e) => handleFormChange('estimatedHours', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="e.g., 4.0"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Total Payment Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 text-sm">₹</span>
                <input
                  type="number"
                  min="0"
                  value={taskAcceptanceForm.paymentAmount}
                  onChange={(e) => handleFormChange('paymentAmount', e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Additional Charges</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 text-sm">₹</span>
                <input
                  type="number"
                  min="0"
                  value={taskAcceptanceForm.extraCharges}
                  onChange={(e) => handleFormChange('extraCharges', e.target.value)}
                  disabled={taskAcceptanceForm.materialsCoverage !== 'helper'}
                  className={`w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                    taskAcceptanceForm.materialsCoverage !== 'helper' 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : ''
                  }`}
                  placeholder="0.00"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {taskAcceptanceForm.materialsCoverage === 'helper' 
                  ? 'Cost of materials, transport, etc.'
                  : 'Additional charges only apply when you provide materials'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Schedule & Materials */}
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 5v4a2 2 0 002 2h4a2 2 0 002-2v-4M4 7h16v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7z"/>
            </svg>
            Schedule & Materials
          </h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Arrival Date & Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={taskAcceptanceForm.arrivalTime}
                onChange={(e) => handleFormChange('arrivalTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Materials Coverage</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="materialsCoverage"
                    value="none"
                    checked={taskAcceptanceForm.materialsCoverage === 'none'}
                    onChange={(e) => handleFormChange('materialsCoverage', e.target.value)}
                    className="text-violet-600 focus:ring-violet-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">No materials needed</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="materialsCoverage"
                    value="user"
                    checked={taskAcceptanceForm.materialsCoverage === 'user'}
                    onChange={(e) => handleFormChange('materialsCoverage', e.target.value)}
                    className="text-violet-600 focus:ring-violet-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Customer provides materials</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="materialsCoverage"
                    value="helper"
                    checked={taskAcceptanceForm.materialsCoverage === 'helper'}
                    onChange={(e) => handleFormChange('materialsCoverage', e.target.value)}
                    className="text-violet-600 focus:ring-violet-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">I will provide materials</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Additional Notes</label>
              <textarea
                rows={3}
                value={taskAcceptanceForm.notes}
                onChange={(e) => handleFormChange('notes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                placeholder="Any special requirements or notes..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="mt-6 flex flex-col sm:flex-row gap-3">
      <button
        onClick={() => handleAcceptTask(selectedTask._id)}
        disabled={!taskAcceptanceForm.estimatedHours || !taskAcceptanceForm.paymentAmount || !taskAcceptanceForm.arrivalTime}
        className="flex-1 inline-flex justify-center items-center px-6 py-3 bg-violet-600 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
        </svg>
        Accept Task & Send Quote
      </button>
      
      <button
        onClick={() => handleChat(selectedTask._id, selectedTask.createdBy?._id, selectedTask.createdBy?.name!)}
        className="inline-flex justify-center items-center px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium text-sm rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition duration-200"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
        Chat First
      </button>
    </div>

    {/* Info Banner */}
    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div className="flex items-start">
        <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p className="text-sm text-blue-700">
          Once you accept this task, the customer will be notified with your quote and schedule. Make sure all details are accurate before accepting.
        </p>
      </div>
    </div>
  </div>
            )}
            







            

            {/* Start Task Section */}
            {selectedTask.task_status === "assigned" && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Ready to Start?</h3>
                    <p className="text-sm text-gray-600">Enter the verification code provided by the customer</p>
                  </div>
                </div>

                {!isCodeInputOpen ? (
                  <button
                    onClick={handleStartTask}
                    className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    Start Task
                  </button>
                ) : (
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Enter Verification Code</h4>
                    <p className="text-xs text-gray-500 mb-3">
                      Please enter the 6-digit alphanumeric code provided by {selectedTask.createdBy?.name || "the customer"}.
                    </p>

                    <div className="flex space-x-2 mb-4">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="Enter 6-digit code"
                        value={codeInput}
                        onChange={(e) => setCodeInput(e.target.value.replace(/[^a-zA-Z0-9]/g, "").substring(0, 6).toUpperCase())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center text-lg font-mono"
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
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            Verifying...
                          </>
                        ) : (
                          "Verify & Start Task"
                        )}
                      </button>
                      <button
                        onClick={cancelCodeVerification}
                        className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Timeline */}
            <div className="mt-8 border-t border-gray-200 pt-6">
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
                        <p className="text-sm font-medium text-gray-900">Created by {selectedTask.createdBy.name}</p>
                      </div>
                    </div>
                  )}

                  {(selectedTask.task_status === "assigned" || selectedTask.task_status === "in_progress") && (
                    <div className="relative flex items-start">
                      <div className="absolute mt-1 ml-1 h-6 w-6 rounded-full border-2 border-violet-700 bg-white"></div>
                      <div className="ml-12">
                        <p className="text-sm font-medium text-gray-900">Task Scheduled</p>
                        <p className="text-xs text-gray-500">{formatDateTime(selectedTask.prefferedTime, selectedTask.prefferedDate)}</p>
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