import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { login } from '../../../api/apiRequests';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../../config/firebase';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../../redux/slices/authSlice';
import { UserDTO } from '../../../types/UserDTO';

const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

interface LoginFormProps {
  onLoginSuccess: () => void; // Add callback prop
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{ email: string; password: string }>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setGeneralError('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError('');
    setErrors({});

    try {
      await loginSchema.validate(formData, { abortEarly: false });
      setLoading(true);
      const user = await login(formData.email, formData.password);
      const userDTO: UserDTO = { id: user.id, name: user.name, email: user.email, type: user.type };
      dispatch(setCredentials({ user: userDTO }));
      setLoading(false);
      onLoginSuccess(); // Trigger the parent's loader logic
    } catch (err) {
      setLoading(false);
      if (err instanceof yup.ValidationError) {
        const newErrors: { [key: string]: string } = {};
        err.inner.forEach((error) => {
          if (error.path) newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      } else if (err instanceof Error) {
        setGeneralError(err.message || 'An error occurred during login');
      } else {
        setGeneralError('An unexpected error occurred');
      }
    }
  };

  const handleGoogleLogin = async () => {
    console.log('Continue with Google clicked');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onLoginSuccess(); // Trigger the parent's loader logic
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  };

  return (
    <div className="w-full max-w-md p-8">
      <h2 className="text-3xl font-bold text-violet-950 mb-2">Welcome Back!</h2>
      <p className="text-md text-gray-600 mb-6">Log in to connect, support, and earn.</p>

      {generalError && <p className="text-red-500 mb-4 text-center">{generalError}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-950"
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-950"
            placeholder="Enter your password"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          <p className="text-sm text-right mt-2">
            <a href="/forgot-password" className="text-violet-950 hover:underline">
              Forgot Password?
            </a>
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-violet-950 text-white py-2 rounded-md hover:bg-violet-800 transition duration-200 disabled:bg-violet-700 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Logging in...': 'Log In'}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Or</span>
        </div>
      </div>

      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition duration-200"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.02.68-2.32 1.09-3.71 1.09-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4.01 20.36 7.77 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.77 1 4.01 3.64 2.18 7.07l3.66 2.84c.87-2.60 3.30-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>

      <p className="mt-6 text-sm text-gray-600 text-center">
        Don’t have an account?{' '}
        <a href="/" className="text-violet-950 hover:underline">
          Sign Up
        </a>
      </p>
    </div>
  );
};

export default LoginForm;