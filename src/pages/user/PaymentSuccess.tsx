import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, ArrowLeft, Copy, ClipboardCheck } from "lucide-react";
import NavbarLanding from "../../components/layout/Navbar-Landing";
import { newTaskDetails } from "../../types/newTaskDetails";

interface TransactionDetails {
  stripeTransactionId: string;
  amount: number;
  transactionDate: string;
  taskDetails: newTaskDetails,
  taskCode: string;
}

export const PaymentSuccess = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Extract session_id from URL
  const queryParams = new URLSearchParams(search);
  const sessionId = queryParams.get("session_id");

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      if (!sessionId) {
        setError("No session ID found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:4000/v1/payments/session-details/${sessionId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch transaction details");
        }

        const { data } = await response.json();
        setTransactionDetails(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load transaction details.");
        setLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [sessionId]);

  const handleBackToTasks = () => {
    navigate("/home/taskList");
  };

  const copyTaskCode = () => {
    if (transactionDetails?.taskCode) {
      navigator.clipboard.writeText(transactionDetails.taskCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <NavbarLanding />
      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-4">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Payment Successful!
          </h1>
          <p className="mt-2 text-gray-600">Your transaction has been completed successfully.</p>
        </div>
        
        {/* Task Code Card - Prominent Display */}
        {!loading && !error && transactionDetails?.taskCode && (
          <div className="mb-8 bg-white shadow-lg rounded-xl border-2 border-green-500 overflow-hidden">
            <div className="bg-green-500 px-6 py-3">
              <h2 className="text-xl font-semibold text-white">Your Task Code</h2>
            </div>
            <div className="p-6 flex flex-col items-center">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 mb-2">Share this code with your helper to start the task</p>
                <div className="bg-gray-50 border-2 border-green-100 rounded-lg py-4 px-8 flex items-center justify-center">
                  <span className="text-3xl font-mono font-bold tracking-wider text-green-700">
                    {transactionDetails.taskCode}
                  </span>
                </div>
              </div>
              <button 
                onClick={copyTaskCode}
                className="flex items-center justify-center px-4 py-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 font-medium transition-colors"
              >
                {copied ? (
                  <>
                    <ClipboardCheck size={18} className="mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={18} className="mr-2" />
                    Copy Code
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-5">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <CheckCircle size={22} className="mr-2" />
              Transaction Details
            </h2>
          </div>
          <div className="px-6 py-6 space-y-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700">{error}</p>
              </div>
            ) : (
              <>
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                    <CheckCircle size={18} className="mr-2 text-green-600" />
                    Task Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <span className="font-medium text-gray-500 text-sm block">Task ID</span>
                      <span className="font-mono text-gray-800">{transactionDetails?.taskDetails._id || "N/A"}</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <span className="font-medium text-gray-500 text-sm block">Category</span>
                      <span className="font-medium">
                        {transactionDetails?.taskDetails.category ? `${transactionDetails?.taskDetails.category} - ${transactionDetails?.taskDetails.subCategory}` : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                    <CheckCircle size={18} className="mr-2 text-green-600" />
                    Payment Details
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-5">
                    <div className="flex justify-between text-gray-700 py-2 border-b border-gray-200">
                      <span>Stripe Transaction ID</span>
                      <span className="font-mono">
                        {transactionDetails?.stripeTransactionId || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold text-gray-900 py-3 mt-2">
                      <span>Total Amount</span>
                      <span className="text-xl">${transactionDetails?.amount.toFixed(2) || "0.00"}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="px-6 py-6 bg-gray-50 border-t border-gray-200">
            <button
              onClick={handleBackToTasks}
              className="w-full py-3 px-4 rounded-lg flex items-center justify-center font-medium bg-indigo-600 hover:bg-indigo-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Tasks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};