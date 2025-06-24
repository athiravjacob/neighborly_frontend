import React, { useState } from 'react';
import { newTaskDetails } from '../../../types/newTaskDetails';
import { toast } from 'react-toastify';
import { reportAnIssue } from '../../../api/taskApiRequests';
import { DisputeDetails } from '../../../types/complaintDetails';

interface RaiseComplaintProps {
  task: newTaskDetails;
}

export const RaiseComplaint: React.FC<RaiseComplaintProps> = ({ task }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [issue, setIssue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const buttonBaseClasses =
    'px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200';
  const primaryButtonClasses = `${buttonBaseClasses} bg-violet-700 text-white hover:bg-violet-800`;
  const secondaryButtonClasses = `${buttonBaseClasses} bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`;

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
    if (!task._id || !task.assignedNeighbor?._id || !task.createdBy?._id) {
      toast.error('Cannot report issue: Missing required task details.');
      return;
    }
 
    setIsSubmitting(true);
    const complaintDetails: DisputeDetails = {
      taskId: task._id,
      reporter_role:"Neighbor",
      reportedBy: task.assignedNeighbor._id,
      details: issue,
    };

    try {
      await reportAnIssue(complaintDetails);
      toast.success('You have registered a complaint. Admin will reach out soon. Please wait until then.');
      setIssue('');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Couldn't report the issue. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIssue('');
  };

  return (
    <>
      <footer className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
        <button
          className={primaryButtonClasses}
          onClick={() => setIsModalOpen(true)}
          aria-label="Report an issue"
        >
          Report Issue
        </button>
      </footer>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Report an Issue</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="issue" className="block text-sm font-medium text-gray-700 mb-2">
                  Describe the issue
                </label>
                <textarea
                  id="issue"
                  rows={4}
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                  placeholder="Please provide details about the issue you're facing..."
                  aria-label="Describe the issue"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className={secondaryButtonClasses}
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${primaryButtonClasses} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};