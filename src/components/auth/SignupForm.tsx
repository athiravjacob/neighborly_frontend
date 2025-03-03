import React, { useState, FormEvent, useEffect } from 'react'
import * as yup from 'yup';
import { useNavigate } from "react-router-dom";

import { SignupFormData } from '../../types/auth';
import BasicInfoForm from './Basic';
import OTPForm from './OTPform';
import PasswordForm from './PasswordForm';
import { signupBasicInfoSchema, signupOTPSchema, signupPasswordSchema } from '../../validations/schemas/SignupSchema';
import { sendMail, verifyOTP, signup } from '../../utilis/api'; // Fixed typo: 'utilis' -> 'utils'


const SignupForm = () => {
    const navigate = useNavigate()
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<SignupFormData>({
      name: '',
      email: '',
      phone: '',
      otp: '',
      password: '',
      confirmPassword: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [generalError, setGeneralError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(false);
  
    useEffect(() => {
      setStep(1);
      setFormData({ name: '', email: '', phone: '', otp: '', password: '', confirmPassword: '' });
      setErrors({});
      setGeneralError('');
      setSignupSuccess(false);
    }, []);
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
      setErrors(prev => ({ ...prev, [name]: '' }));
      setGeneralError('');
    };
  
    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      setGeneralError('');
      try {
        if (step === 1) {
          await signupBasicInfoSchema.validate(formData, { abortEarly: false });
          setErrors({});
          setLoading(true);
          const result = await sendMail(formData.email);
          console.log(result)
          setLoading(false);
          setStep(2);
        } else if (step === 2) {
          await signupOTPSchema.validate(formData, { abortEarly: false });
          setErrors({});
          setLoading(true);
          await verifyOTP(formData.email, formData.otp);
          setLoading(false);
          setStep(3);
        } else if (step === 3) {
          await signupPasswordSchema.validate(formData, { abortEarly: false });
          setErrors({});
          setLoading(true);
          await signup(formData.name, formData.email, formData.phone, formData.password);
          setLoading(false);
          // setSignupSuccess(true);
          navigate("/login")
        }
      } catch (err) {
        setLoading(false);
        if (err instanceof yup.ValidationError) {
          const newErrors: { [key: string]: string } = {};
          err.inner.forEach(error => {
            if (error.path) newErrors[error.path] = error.message;
          });
          setErrors(newErrors);
        } else if (err instanceof Error) {
          if (step === 2) {
            setErrors({ otp: err.message });
          } else {
            setGeneralError(err.message);
          }
        }
      }
    };
  
    const renderStepContent = () => {
      // if (signupSuccess) {
      //   return (
      //     <div className="text-center">
      //       <h3 className="text-xl font-bold text-green-600 mb-4">Signup Successful!</h3>
      //       <p className="text-gray-600">Your account has been created. Please log in.</p>
      //       <a
      //         href="/login"
      //         className="mt-4 inline-block bg-violet-950 text-white py-2 px-4 rounded-md hover:bg-violet-700 transition-colors duration-200"
      //       >
      //         Go to Login
      //       </a>
      //     </div>
      //   );
      // }
      switch (step) {
        case 1:
          return <BasicInfoForm formData={formData} handleInputChange={handleInputChange} errors={errors} />;
        case 2:
          return <OTPForm formData={formData} handleInputChange={handleInputChange} errors={errors} />;
        case 3:
          return <PasswordForm formData={formData} handleInputChange={handleInputChange} errors={errors} />;
        default:
          return <p className="text-red-500">An unexpected error occurred. Please refresh the page.</p>;
      }
    };
  
    const getStepTitle = () => {
      switch (step) {
        case 1: return 'Basics';
        case 2: return 'Verify OTP';
        case 3: return 'Set Password';
        default: return '';
      }
    };
  return (
    <div className="w-full max-w-md">
    <h2 className="text-3xl font-bold mb-4 text-gray-800">Create Account</h2>
    <p className="text-gray-600 mb-6">Fill out the form below—it only takes a few minutes!</p>
    <h3 className="text-xl mb-4 text-gray-800">{getStepTitle()}</h3>
    {!signupSuccess && (
      <div className="flex justify-between mb-6">
        <div className={`w-1/3 h-1 ${step >= 1 ? 'bg-violet-950' : 'bg-gray-300'}`} />
        <div className={`w-1/3 h-1 ${step >= 2 ? 'bg-violet-950' : 'bg-gray-300'}`} />
        <div className={`w-1/3 h-1 ${step >= 3 ? 'bg-violet-950' : 'bg-gray-300'}`} />
      </div>
    )}
    {generalError && (
      <p className="text-red-500 mb-4 text-center">{generalError}</p>
    )}
    <form onSubmit={handleSubmit} className="space-y-6">
      {renderStepContent()}
      <button
        type="submit"
        className="w-full bg-violet-950 text-white py-2 px-4 rounded-md hover:bg-violet-700 transition-colors duration-200 disabled:bg-violet-700 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? 'Loading...' : step === 3 ? 'Complete' : 'Next'}
      </button>
      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/login" className="text-violet-950 hover:underline">
          Login
        </a>
      </p>
    </form>
  </div>
  )
}

export default SignupForm