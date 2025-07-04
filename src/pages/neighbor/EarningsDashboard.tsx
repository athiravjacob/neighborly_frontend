import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useWalletDetails } from '../../hooks/payment/useWalletDetails';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Transaction } from '../../types/transactions'; // Adjust path to Transaction interface
import { FetchTransactionDetails } from '../../api/neighborApiRequests';
import { formatDateTime } from '../../utilis/formatDate';

// Register Chart.js components (Bar component removed if not used)
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Interface for table row data
interface TableTransaction {
  transactionId: string;
  taskId: string;
  amount: number;
  type: string;
  date: string;
}

const EarningsDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: walletData, isLoading, error } = useWalletDetails(user?.id!);

  // State for transactions
  const [transactions, setTransactions] = useState<TableTransaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [transactionError, setTransactionError] = useState<string | null>(null);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.id) {
        setTransactionError('User ID not available');
        return;
      }

      setIsLoadingTransactions(true);
      setTransactionError(null);

      try {
        const fetchedTransactions = await FetchTransactionDetails(user.id); // Using user.id as neighborId
        // Map API transactions to table format
        const mappedTransactions: TableTransaction[] = fetchedTransactions.map((transaction) => ({
          transactionId: transaction.id || 'N/A', // Handle optional id
          taskId: transaction.taskId,
          amount: transaction.base_amount,
          type: 'earnings', // Hardcoded as per requirement
          date:  formatDateTime(transaction.transactionDate)
      }));
        setTransactions(mappedTransactions);
      } catch (err) {
        setTransactionError(err instanceof Error ? err.message : 'Failed to load transactions');
      } finally {
        setIsLoadingTransactions(false);
      }
    };

    fetchTransactions();
  }, [user?.id]);

  const summaryData = walletData
    ? {
        totalEarned: walletData.balance || 0,
        withdrawableAmount: walletData.withdrawableBalance || 0,
        // todayEarnings: 344.0, // Static or fetch from another API
        // thisMonthEarnings: 1328.0, // Static or fetch from another API
      }
    : {
        totalEarned: 0,
        withdrawableAmount: 0,
        // todayEarnings: 344.0,
        // thisMonthEarnings: 1328.0,
      };

  if (isLoading) {
    return <div>Loading wallet details...</div>;
  }

  if (error) {
    return <div>Error loading wallet details: {error.message}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Earnings Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-sm text-gray-500">Total Earned</h2>
          <p className="text-2xl font-semibold">₹ {summaryData.totalEarned.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-sm text-gray-500">Withdrawable Amount</h2>
          <p className="text-2xl font-semibold">₹ {summaryData.withdrawableAmount.toFixed(2)}</p>
        </div>
        {/* <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-sm text-gray-500">Today's Earnings</h2>
          <p className="text-2xl font-semibold">₹ {summaryData.todayEarnings.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-sm text-gray-500">This Month's Earnings</h2>
          <p className="text-2xl font-semibold">₹ {summaryData.thisMonthEarnings.toFixed(2)}</p>
        </div> */}
      </div>

      {/* Transaction History */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Transaction History</h2>
          {/* Removed select since type is hardcoded to 'earnings' */}
        </div>
        {isLoadingTransactions && <div>Loading transactions...</div>}
        {transactionError && <div className="text-red-600">Error: {transactionError}</div>}
        {!isLoadingTransactions && !transactionError && transactions.length === 0 && (
          <div>No transactions found.</div>
        )}
        {!isLoadingTransactions && !transactionError && transactions.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Transaction ID</th>
                  <th className="text-left py-2">Task ID</th>
                  <th className="text-left py-2">Type</th>
                  <th className="text-right py-2(AP)">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{transaction.date}</td>
                    <td className="py-2">{transaction.transactionId}</td>
                    <td className="py-2">{transaction.taskId}</td>
                    <td className="py-2">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-600">
                        {transaction.type}
                      </span>
                    </td>
                    <td className="text-right py-2">
                      +₹ {transaction.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EarningsDashboard;