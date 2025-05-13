import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EarningsDashboard = () => {
  // Placeholder data (replace with API data)
  const summaryData = {
    totalEarned: 2763.0,
    withdrawableAmount: 1763.0,
    todayEarnings: 344.0,
    thisMonthEarnings: 1328.0,
  };

  const chartData = {
    labels: ['May 06', 'May 07', 'May 08', 'May 09', 'May 10', 'May 11', 'May 12'],
    datasets: [
      {
        label: 'Earnings',
        data: [0, 0, 575, 0, 344, 0, 0],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Withdrawals',
        data: [0, 0, 0, 300, 0, 0, 0],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Earnings & Withdrawals (Last 7 Days)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 600,
        ticks: {
          stepSize: 150,
        },
      },
    },
  };

  const highestPaidTask = {
    amount: 575.0,
    description: 'E-commerce Task tab890',
    date: 'April 20th, 2025',
  };

  const transactions = [
    { date: 'May 12th, 2025', id: 'task123', description: 'Website development - Homepage', type: 'Earning', amount: 344.0 },
    { date: 'May 10th, 2025', id: 'task456', description: 'Mobile app UI design', type: 'Earning', amount: 275.0 },
    { date: 'May 8th, 2025', id: 'task789', description: 'API Integration service', type: 'Earning', amount: 520.0 },
    { date: 'May 7th, 2025', id: 'withdrawal1', description: 'Bank transfer', type: 'Withdrawal', amount: -300.0 },
  ];

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
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-sm text-gray-500">Today's Earnings</h2>
          <p className="text-2xl font-semibold">₹ {summaryData.todayEarnings.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-sm text-gray-500">This Month's Earnings</h2>
          <p className="text-2xl font-semibold">₹ {summaryData.thisMonthEarnings.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart and Highest Paid Task */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Highest Paid Task</h2>
          <p className="text-2xl font-semibold text-green-600">₹ {highestPaidTask.amount.toFixed(2)}</p>
          <p className="text-sm text-gray-600">{highestPaidTask.description}</p>
          <p className="text-sm text-gray-500">{highestPaidTask.date}</p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Transaction History</h2>
          <select className="border rounded px-2 py-1 text-sm">
            <option>All Transactions</option>
            <option>Earnings</option>
            <option>Withdrawals</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Task/Transaction ID</th>
                <th className="text-left py-2">Description</th>
                <th className="text-left py-2">Type</th>
                <th className="text-right py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{transaction.date}</td>
                  <td className="py-2">{transaction.id}</td>
                  <td className="py-2">{transaction.description}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        transaction.type === 'Earning'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className="text-right py-2">
                    {transaction.amount > 0 ? '+' : ''}₹ {Math.abs(transaction.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EarningsDashboard;