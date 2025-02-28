import React from 'react';
import { SignupFormData } from '../../types/auth';

interface BasicInfoFormProps {
  formData: SignupFormData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errors: { [key: string]: string };
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ formData, handleInputChange,errors }) => (
  <>
    <div>
      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
        Full Name
      </label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-950"
        placeholder="Enter your name"
        
            />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
    </div>
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
        Email Address
      </label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-950"
        placeholder="Enter your email"
        required
      />
      {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
    </div>
    <div>
      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
        Phone Number
      </label>
      <input
        type="tel"
        id="phone"
        name="phone"
        value={formData.phone}
        onChange={handleInputChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-950"
        placeholder="Enter your phone number"
        
      />
      {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
    </div>
  </>
);

export default BasicInfoForm;