import React from 'react';
import { SignupFormData } from '../../../types/auth';

interface OTPFormProps {
  formData: SignupFormData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errors:{[key:string]:string}
}

const OTPForm: React.FC<OTPFormProps> = ({ formData, handleInputChange ,errors}) => (
  <div>
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
    <p className="text-sm text-gray-600 mt-2">
      We sent a verification code to {formData.email}
    </p>
  </div>
);

export default OTPForm;