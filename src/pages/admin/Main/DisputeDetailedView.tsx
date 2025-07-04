import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateDisputeStatus } from '../../../api/adminApiRequests';
import { populated_disputeDetails } from '../../../types/complaintDetails';
import { format } from 'date-fns';
import { formatDateTime } from '../../../utilis/formatDate';

const DisputeDetailedView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispute = location.state?.dispute as populated_disputeDetails;
    console.log(dispute)
  if (!dispute) {
    return (
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 text-center">
          No dispute data available. Please select a dispute from the list.
        </div>
        <button
          className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors duration-200"
          onClick={() => navigate('/admin/dashboard/disputes')}
        >
          Back to Disputes List
        </button>
      </main>
    );
  }

  const handleStatusChange = async (status: string) => {
      try {
    console.log(status)
      const updatedDispute = await updateDisputeStatus(dispute._id, status);
      console.log(updatedDispute)
      toast.success(`Dispute status updated to ${status}`);
      // Optionally refresh dispute data or update local state
      navigate('/admin/dashboard/disputes', { replace: true }); // Navigate back after update
      } catch (error) {
          console.log(error)
      toast.error('Failed to update dispute status');
    }
  };

  const formatDate = (date: string | Date): string => {
    try {
      const parsedDate = typeof date === 'string' ? new Date(date) : date;
      return format(parsedDate, 'MMMM d, yyyy, h:mm a');
    } catch {
      return typeof date === 'string' ? date : 'Invalid Date';
    }
  };

  return (
    <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto bg-gray-900 text-gray-200">
      <button
        className="group flex items-center mb-6 text-violet-400 hover:text-violet-300 font-medium transition-colors duration-200"
        onClick={() => navigate('/admin/dashboard/disputes')}
      >
        <span className="text-xl mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200">←</span>
        <span>Back to Disputes</span>
      </button>

      <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-violet-700 to-violet-900 p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Dispute Details</h1>
          <div className="mt-2">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                dispute.dispute_status === 'resolved'
                  ? 'bg-green-600 bg-opacity-30 text-green-200'
                  : dispute.dispute_status === 'open'
                  ? 'bg-yellow-600 bg-opacity-30 text-yellow-200'
                  : dispute.dispute_status === 'under_review'
                  ? 'bg-blue-600 bg-opacity-30 text-blue-200'
                  : 'bg-red-600 bg-opacity-30 text-red-200'
              }`}
            >
              {dispute.dispute_status!.charAt(0).toUpperCase() + dispute.dispute_status!.slice(1)}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Dispute Info */}
            <div className="lg:col-span-1">
              <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                <h2 className="text-xl font-bold text-white mb-6">Dispute Information</h2>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-400 block">Dispute ID</span>
                    <span className="font-medium text-white">{dispute._id}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400 block">Task ID</span>
                    <span className="font-medium text-white">{dispute.taskId._id || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400 block">Reporter Role</span>
                    <span className="font-medium text-white">{dispute.reporter_role || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400 block">Reported By</span>
                    <span className="font-medium text-white">{dispute.reportedBy.name || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400 block">Created At</span>
                    <span className="font-medium text-white">{formatDateTime(dispute.createdAt)}</span>
                  </div>
                  
                </div>
              </div>
            </div>

            {/* Right Column: Dispute Details and Actions */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-gray-300 mb-4">Dispute Description</h3>
              <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                <p className="text-gray-200">{dispute.details || 'No description provided'}</p>
              </div>

              {/* Admin Actions */}
<div className="mt-8 pt-6 border-t border-gray-700">
  <h3 className="text-lg font-semibold text-gray-300 mb-4">Admin Actions</h3>
  <div className="flex flex-wrap gap-3">
    <select
      value={dispute.dispute_status}
      onChange={(e) => handleStatusChange(e.target.value)}
      className={`px-6 py-3 rounded-lg text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        dispute.dispute_status === 'resolved'
          ? 'bg-green-600 focus:ring-green-700'
          : dispute.dispute_status === 'open'
          ? 'bg-yellow-600 focus:ring-yellow-700'
          : dispute.dispute_status === 'under_review'
          ? 'bg-blue-600 focus:ring-blue-700'
          : 'bg-red-600 focus:ring-red-700'
      }`}
    >
      {['open', 'under review', 'resolved', 'rejected'].map((status) => (
        <option
          key={status}
          value={status}
          disabled={dispute.dispute_status === status}
          className="bg-gray-800 text-white"
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </option>
      ))}
    </select>
  </div>
</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DisputeDetailedView;
