import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { newTaskDetails } from '../../../types/newTaskDetails';
import { toast } from 'react-toastify';
import { reportAnIssue, fetchComplaintDetails } from '../../../api/taskApiRequests';
import { DisputeDetails } from '../../../types/complaintDetails';
import { AlertTriangle, Eye, FileText, User, Clock, X, Send, Shield } from 'lucide-react';

interface RaiseComplaintProps {
  task: newTaskDetails;
  role:"Neighbor"|"User"
}

export const RaiseComplaint: React.FC<RaiseComplaintProps> = ({ task ,role}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [issue, setIssue] = useState('');
  const queryClient = useQueryClient();

  // Ensure task._id is a string
  if (typeof task._id !== 'string') {
    toast.error('Invalid task ID format.');
    return null;
  }

  // Fetch dispute details
  const { data: dispute, isLoading: isDisputeLoading } = useQuery({
    queryKey: ['dispute', task._id],
    queryFn: () => fetchComplaintDetails(task._id!),
    enabled: !!task._id,
  });

  // Mutation for reporting an issue
  const mutation = useMutation({
    mutationFn: reportAnIssue,
    onSuccess: () => {
      toast.success('You have registered a complaint. Admin will reach out soon.');
      setIssue('');
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['dispute', task._id] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Couldn't report the issue. Please try again.";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task._id || !task.assignedNeighbor?._id || !task.createdBy?._id) {
      toast.error('Cannot report issue: Missing required task details.');
      return;
    }
    let reporter
    if (role === "Neighbor") {
       reporter = task.assignedNeighbor._id
    }else reporter = task.createdBy._id
    const complaintDetails: DisputeDetails = {
      taskId: task._id,
      reporter_role: role,
      reportedBy: reporter,
      details: issue,
    };

    mutation.mutate(complaintDetails);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIssue('');
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
  };

  // Show loading state
  if (isDisputeLoading) {
    return (
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-6 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-violet-500 border-t-transparent"></div>
          <span className="text-gray-600 font-medium">Loading dispute status...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-r from-slate-50 via-white to-slate-50 px-6 py-6 border-t border-gray-200">
      <div className="bg-gradient-to-r from-slate-50 via-white to-slate-50 px-6 py-6 border-t border-gray-200">
  <div className="flex justify-end">
    {dispute ? (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full">
          <Shield className="w-4 h-4 text-amber-600" />
          <span className="text-amber-800 font-medium text-sm">Task Under Dispute</span>
        </div>
        <button
          className="group relative px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
          onClick={() => setIsViewModalOpen(true)}
          aria-label="View dispute details"
        >
          <Eye className="w-4 h-4" />
          <span>View Details</span>
          <div className="absolute inset-0 bg-gradient-to-r from-violet-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </button>
      </div>
    ) : (
      (task.task_status === "completed" || task.task_status === "in_progress") && (
        <button
          className="group relative px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
          onClick={() => setIsModalOpen(true)}
          aria-label="Report an issue"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Report Issue</span>
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </button>
      )
    )}
  </div>
</div>
      </div>

      {/* Report Issue Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Report an Issue</h2>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="issue" className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                    <FileText className="w-4 h-4" />
                    <span>Describe the issue in detail</span>
                  </label>
                  <textarea
                    id="issue"
                    rows={4}
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Please provide detailed information about the issue you're experiencing with this task..."
                    aria-label="Describe the issue"
                    required
                    disabled={mutation.isPending}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200"
                    onClick={handleCloseModal}
                    disabled={mutation.isPending}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 ${
                      mutation.isPending ? 'opacity-50 cursor-not-allowed transform-none' : ''
                    }`}
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Report</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Dispute Modal */}
      {isViewModalOpen && dispute && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Dispute Details</h2>
                </div>
                <button
                  onClick={handleCloseViewModal}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-600 mb-2">
                    <FileText className="w-4 h-4" />
                    <span>Task ID</span>
                  </label>
                  <p className="text-gray-900 font-mono text-sm bg-white px-3 py-2 rounded-lg border">
                    {dispute.taskId._id}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-600 mb-2">
                    <User className="w-4 h-4" />
                    <span>Reported By</span>
                  </label>
                  <p className="text-gray-900 font-medium">{dispute.reportedBy?.name}</p>
                  <p className="text-sm text-gray-500 mt-1">Role: {dispute.reporter_role}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-600 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Issue Details</span>
                  </label>
                  <p className="text-gray-900 leading-relaxed">{dispute.details}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-600 mb-2">
                    <Clock className="w-4 h-4" />
                    <span>Status</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                    <span className="text-amber-800 font-medium capitalize">
                      {dispute.dispute_status || 'pending'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200"
                  onClick={handleCloseViewModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};