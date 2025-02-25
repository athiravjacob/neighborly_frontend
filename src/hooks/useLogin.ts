import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface LoginFormData {
  email: string;
  password: string;
}

export const useLogin = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login logic (replace with actual API call)
    console.log('Login submitted:', formData);
    // Redirect to home or dashboard after successful login
    navigate('/home'); // You can change this route later
  };

  return {
    formData,
    handleChange,
    handleSubmit,
  };
};