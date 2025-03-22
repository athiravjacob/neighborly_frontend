// OTPForm.tsx
import React, { useState, useEffect } from 'react';
import { SignupFormData } from '../../../types/auth';

interface OTPFormProps {
  formData: SignupFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: { [key: string]: string };
  onResend: () => Promise<void>;
  setNextDisabled: (disabled: boolean) => void;
}

const OTPForm: React.FC<OTPFormProps> = ({ 
  formData, 
  handleInputChange, 
  errors, 
  onResend, 
  setNextDisabled 
}) => {
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(true);

  useEffect(() => {
    if (!isTimerActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimerActive(false);
          setNextDisabled(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive, setNextDisabled]);

  const handleResend = async () => {
    await onResend();
    setTimeLeft(120);
    setIsTimerActive(true);
    setNextDisabled(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div>
      <div className="text-center mb-4">
        <p className="text-sm font-medium text-gray-700">
          Time remaining: <span className="text-violet-950">{formatTime(timeLeft)}</span>
        </p>
      </div>
      
      <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
        Verification Code
      </label>
      <input
        type="text"
        id="otp"
        name="otp"
        value={formData.otp}
        onChange={handleInputChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-950"
        placeholder="Enter the 6-digit code"
        required
      />
      {errors.otp && <p className="text-sm text-red-500 mt-1">{errors.otp}</p>}
      
      <div className="mt-2">
        <p className="text-sm text-gray-600">
          We sent a verification code to {formData.email}
        </p>
        {!isTimerActive && (
          <button
            type="button"
            onClick={handleResend}
            className="mt-2 text-sm text-violet-950 hover:underline focus:outline-none"
          >
            Resend Code
          </button>
        )}
      </div>
    </div>
  );
};

export default OTPForm;