import * as yup from 'yup';

export const signupBasicInfoSchema = yup.object().shape({
  name: yup.string().required('Name is required').min(3, 'Name cannot be empty').trim().matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces"),
  email: yup.string().required('Email is required').email('Email must be valid'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^\d{10}$/, 'Phone number must be 10 digits'),
});

export const signupOTPSchema = yup.object().shape({
  otp: yup
    .string()
    .required('OTP is required')
    .matches(/^[A-Za-z0-9]{6}$/
    , 'OTP must be 6 digits or alphabets or both '),
});

export const signupPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain an uppercase letter')
    .matches(/[0-9]/, 'Password must contain a number'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});