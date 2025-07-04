import { useLocation } from "react-router-dom";
import NavbarLanding from "../../components/layout/Navbar-Landing";
import { CreditCard, Calendar, User, ClipboardList } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

// Initialize Stripe with your Publishable Key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

export const PaymentPage = () => {
  const { state } = useLocation();
  const task = state?.task;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load Stripe
      const stripe = await stripePromise;
      if (!stripe) {
        setError("Stripe failed to initialize. Please try again.");
        setLoading(false);
        return;
      }

      // Call backend to create Checkout Session
      const res = await fetch("http://localhost:4000/v1/payments/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: task?.final_amount * 100 || 1000, 
          currency: "inr",
          description: `Payment for task ${task?._id || "unknown"}`,
          metadata: {
            userId: task?.createdBy?._id, 
            neighborId: task?.assignedNeighbor?._id,
            taskId: task?._id,
            base_amount: task.base_amount,
            platform_fee :task.platform_fee
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to create checkout session: ${res.statusText}`);
      }

      // Parse response (match successResponse format)
      const { data, message } = await res.json();
      if (!data?.sessionId) {
        throw new Error(message || "No session ID returned from server");
      }

      const sessionId = data.sessionId;
      console.log(sessionId, "SessionId of Stripe");

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        console.error("Stripe redirect error:", error);
        setError(error.message || "Failed to redirect to Stripe Checkout");
        setLoading(false);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        console.error("Payment error:", err);
        setError(err.message || "Failed to initiate payment. Please try again.");
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavbarLanding />
      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Payment</h1>
          <p className="mt-2 text-gray-600">Secure payment for your requested service</p>
        </div>
        <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <ClipboardList size={20} className="mr-2" />
              Payment Summary
            </h2>
          </div>
          <div className="px-6 py-6 space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <Calendar size={18} className="mr-2 text-indigo-600" />
                Task Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <div>
                  <span className="font-medium text-gray-500 text-sm block">Task ID</span>
                  <span className="font-mono text-gray-800">{task?._id}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-500 text-sm block">Category</span>
                  <span>{task?.category} - {task?.subCategory}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-500 text-sm block">Description</span>
                  <span>{task?.description}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-500 text-sm block">Scheduled Time</span>
                  <span>{task?.prefferedDate} at {task?.timeSlot.startTime}</span>
                </div>
              </div>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <User size={18} className="mr-2 text-indigo-600" />
                Neighbor Information
              </h3>
              <div className="flex items-center">
                <div className="bg-indigo-100 rounded-full p-3 mr-4">
                  <User size={24} className="text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{task?.assignedNeighbor.name}</p>
                  <p className="text-sm text-gray-500">Your assigned helper</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <CreditCard size={18} className="mr-2 text-indigo-600" />
                Payment Breakdown
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between text-gray-700 py-2">
                  <span>Base Amount</span>
                  <span className="font-medium">${task?.base_amount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700 py-2">
                  <span>Platform Fee (5%)</span>
                  <span className="font-medium">${task?.platform_fee?.toFixed(2)}</span>
                </div>
                <div className="h-px bg-gray-300 my-3"></div>
                <div className="flex justify-between text-lg font-semibold text-gray-900 py-2">
                  <span>Total Amount</span>
                  <span>${task?.final_amount?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-6 bg-gray-50 border-t border-gray-200">
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            <button
              onClick={handlePayment}
              disabled={loading}
              className={`w-full py-4 px-4 rounded-lg flex items-center justify-center font-medium transition duration-200 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              }`}
            >
              <CreditCard size={20} className="mr-2" />
              {loading ? "Processing..." : "Pay Securely with Stripe"}
            </button>
            <p className="text-xs text-center mt-4 text-gray-500">
              Your payment information is encrypted and secure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};