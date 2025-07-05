import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchAllTransactions } from '../../../api/adminApiRequests';
import { RootState } from '../../../redux/store';
import { format } from 'date-fns';
import DataTable from '../../../components/common/DataTable';
import { Transaction } from '../../../types/transactions';


const TransactionsList: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (user?.type !== 'admin') {
        navigate('/admin');
        return;
      }
      setIsLoading(true);
      try {
        const transactions = await fetchAllTransactions();
        // Map _id to id if the API returns _id
        const normalizedTransactions = transactions.map((t: any) => ({
          ...t,
          id: t._id || t.id,
        }));
        setTransactions(normalizedTransactions);
        setFilteredTransactions(normalizedTransactions);
        setError('');
      } catch (err: any) {
        setError(err.message || 'Failed to fetch transactions');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [user, navigate]);

  useEffect(() => {
    const filtered = transactions.filter((transaction) =>
      [
        transaction.id?.toLowerCase(),
        transaction.userId?.toLowerCase(),
        transaction.neighborId?.toLowerCase(),
        transaction.taskId?.toLowerCase(),
        transaction.stripeTransactionId?.toLowerCase(),
        transaction.base_amount?.toString(),
        transaction.platform_fee?.toString(),
        transaction.total_amount?.toString(),
      ].some((field) => field && field.includes(searchTerm.toLowerCase()))
    );
    setFilteredTransactions(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, transactions]);

  const handleTransactionClick = (transaction: Transaction) => {
    navigate('/admin/home/transactions/details', { state: { transaction } });
  };

  const formatDate = (date: Date | string): string => {
    try {
      const parsedDate = typeof date === 'string' ? new Date(date) : date;
      return isNaN(parsedDate.getTime()) ? 'Invalid Date' : format(parsedDate, 'MMMM d, yyyy');
    } catch {
      return 'Invalid Date';
    }
  };

  const columns = [
    {
      key: 'id',
      header: 'Transaction ID',
      render: (transaction: Transaction) => (
        <div className="flex items-center">
          <span className="font-medium text-gray-200">{transaction.id || '—'}</span>
        </div>
      ),
    },
    
    {
      key: 'stripeTransactionId',
      header: 'Stripe Transaction ID',
      render: (transaction: Transaction) => transaction.stripeTransactionId || '—',
    },
    {
      key: 'base_amount',
      header: 'Base Amount',
      render: (transaction: Transaction) => (
        <span>
          {transaction.base_amount != null ? `$${transaction.base_amount.toFixed(2)}` : '—'}
        </span>
      ),
    },
    {
      key: 'platform_fee',
      header: 'Platform Fee',
      render: (transaction: Transaction) => (
        <span>
          {transaction.platform_fee != null ? `$${transaction.platform_fee.toFixed(2)}` : '—'}
        </span>
      ),
    },
    {
      key: 'total_Amount',
      header: 'Total Amount',
      render: (transaction: Transaction) => (
        <span>
          {transaction.total_amount != null ? `$${transaction.total_amount.toFixed(2)}` : '—'}
        </span>
      ),
    },
    {
      key: 'transactionDate',
      header: 'Transaction Date',
      render: (transaction: Transaction) => formatDate(transaction.createdAt),
    },
  ];

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DataTable
      data={paginatedTransactions}
      columns={columns}
      isLoading={isLoading}
      error={error}
      searchTerm={searchTerm}
      onSearch={setSearchTerm}
      onRowClick={handleTransactionClick}
      totalItems={filteredTransactions.length}
      itemsPerPage={itemsPerPage}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
    />
  );
};

export default TransactionsList;