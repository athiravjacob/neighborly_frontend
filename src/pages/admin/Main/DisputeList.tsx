import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchAllDisputes } from '../../../api/adminApiRequests';
import { RootState } from '../../../redux/store';
import { format } from 'date-fns';
import DataTable from '../../../components/common/DataTable';
import { populated_disputeDetails } from '../../../types/complaintDetails';

const DisputeList: React.FC = () => {
  const [disputes, setDisputes] = useState<populated_disputeDetails[]>([]);
  const [filteredDispute, setFilteredDispute] = useState<populated_disputeDetails[]>([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchDisputes = async () => {
      if (user?.type !== 'admin') {
        navigate('/admin');
        return;
      }
      setIsLoading(true);
      try {
        const disputeList = await fetchAllDisputes();
        setDisputes(disputeList);
        setFilteredDispute(disputeList);
        setError('');
      } catch (err: any) {
        setError(err.message || 'Failed to fetch disputes');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDisputes();
  }, [user, navigate]);

  useEffect(() => {
    const filtered = disputes.filter((dispute) =>
      [
        dispute._id?.toLowerCase(),
        dispute.taskId?._id?.toLowerCase(),
        dispute.reportedBy?.name?.toLowerCase(),
        dispute.details?.toLowerCase(),
        dispute.dispute_status?.toLowerCase(),
      ].some((field) => field && field.includes(searchTerm.toLowerCase()))
    );
    setFilteredDispute(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, disputes]);

  const handleDisputeClick = (dispute: populated_disputeDetails) => {
    navigate('/admin/home/disputes/details', { state: { dispute } });
  };

  const formatDate = (date: string | Date): string => {
    try {
      const parsedDate = new Date(date);
      return isNaN(parsedDate.getTime()) ? 'Invalid Date' : format(parsedDate, 'MMMM d, yyyy');
    } catch {
      return 'Invalid Date';
    }
  };

  const columns = [
    { 
      key: '_id',
      header: 'Dispute ID',
      render: (dispute: populated_disputeDetails) => (
        <div className="flex items-center">
          <span className="font-medium text-gray-200">{dispute._id || '—'}</span>
        </div>
      ),
    },
    
    {
      key: 'reportedBy',
      header: 'Reported By',
      render: (dispute: populated_disputeDetails) => dispute.reportedBy.name || '—',
    },
    {
      key: 'details',
      header: 'Details',
      render: (dispute: populated_disputeDetails) => dispute.details || '—',
    },
    {
      key: 'reporter_role',
      header: 'Reporter Role',
      render: (dispute: populated_disputeDetails) => dispute.reporter_role || '—',
    },
    {
      key: 'dispute_status',
      header: 'Status',
      render: (dispute: populated_disputeDetails) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            dispute.dispute_status === 'resolved'
              ? 'bg-green-900 bg-opacity-40 text-green-400'
              : dispute.dispute_status === 'open'
              ? 'bg-yellow-900 bg-opacity-40 text-yellow-400'
              : 'bg-red-900 bg-opacity-40 text-red-400'
          }`}
        >
          {dispute.dispute_status
            ? dispute.dispute_status.charAt(0).toUpperCase() + dispute.dispute_status.slice(1)
            : '—'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created At',
      render: (dispute: populated_disputeDetails) => formatDate(dispute.createdAt),
    },
  ];

  const paginatedDisputes = filteredDispute.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DataTable
      data={paginatedDisputes}
      columns={columns}
      isLoading={isLoading}
      error={error}
      searchTerm={searchTerm}
      onSearch={setSearchTerm}
      onRowClick={handleDisputeClick}
      totalItems={filteredDispute.length}
      itemsPerPage={itemsPerPage}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
    />
  );
};

export default DisputeList;