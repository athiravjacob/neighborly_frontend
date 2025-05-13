import React from 'react';
import { NavigateFunction } from 'react-router-dom';
import { CheckCircle, CreditCard } from 'lucide-react';
import { newTaskDetails, TaskStatus, PaymentStatus } from '../../../types/newTaskDetails';

interface PaymentButtonProps {
  task: newTaskDetails;
  navigate: NavigateFunction;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ task, navigate }) => {
  if (!task) return null;
  
  const isPending = 
    task.task_status === 'assigned' && 
    task.payment_status === PaymentStatus.PENDING;
  
  const isPaid = task.payment_status === PaymentStatus.PAID;
  
  if (isPending) {
    return (
      <button
        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 py-1.5 rounded-md font-medium text-sm shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1.5"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/payment/${task._id}`, { state: { task } });
        }}
      >
        <CreditCard className="w-4 h-4" />
        <span>Make Payment</span>
      </button>
    );
  }
  
  if (isPaid) {
    return (
      <span className="flex items-center bg-green-50 text-green-600 px-3 py-1.5 rounded-md text-sm font-medium border border-green-100 shadow-sm">
        <CheckCircle className="w-4 h-4 mr-1.5" />
        <span>Paid</span>
      </span>
    );
  }
  
  return null;
};

export default PaymentButton;