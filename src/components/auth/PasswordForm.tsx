import React from 'react';
import { SignupFormData } from '../../types/auth';

interface PasswordFormProps {
  formData: SignupFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: { [key: string]: string };
}

const PasswordForm: React.FC<PasswordFormProps> = ({ formData, handleInputChange, errors }) => {
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    handleInputChange(e);
  };

  return (
    <>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-950 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Create a password"
        />
        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-950 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Confirm your password"
        />
        {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
      </div>
    </>
  );
};

export default PasswordForm;