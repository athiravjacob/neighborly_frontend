// import React, { useState, ChangeEvent } from 'react';
// import { User, Upload, CheckCircle, X, Edit, Mail, Phone, Calendar, MapPin, Shield } from 'lucide-react';

// interface FormData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   dob: string;
//   address: string;
//   city: string;
//   state: string;
//   zipCode: string;
//   country: string;
//   idType: 'passport' | 'drivers_license' | 'national_id';
//   idNumber: string;
//   idFrontImage: File | null;
//   idBackImage: File | null;
//   profilePhoto: File | null;
// }

// interface Errors {
//   [key: string]: string;
// }

// const KYCProcess: React.FC = () => {
//   const [currentStep, setCurrentStep] = useState<number>(1);
//   const [kycStatus, setKycStatus] = useState<'pending' | 'under-review' | 'completed' | 'rejected'>('pending');
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [errors, setErrors] = useState<Errors>({});
//   const [formData, setFormData] = useState<FormData>({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     dob: '',
//     address: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     country: '',
//     idType: 'passport',
//     idNumber: '',
//     idFrontImage: null,
//     idBackImage: null,
//     profilePhoto: null
//   });

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     setErrors({ ...errors, [name]: '' });
//   };

//   const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, files } = e.target;
//     if (files && files[0]) {
//       const file = files[0];
//       if (file.size > 10 * 1024 * 1024) {
//         setErrors({ ...errors, [name]: 'File size must be less than 10MB' });
//         return;
//       }
//       if (!['image/png', 'image/jpeg', 'application/pdf'].includes(file.type)) {
//         setErrors({ ...errors, [name]: 'Only PNG, JPG, or PDF files are allowed' });
//         return;
//       }
//       setFormData({ ...formData, [name]: file });
//       setErrors({ ...errors, [name]: '' });
//     }
//   };

//   const validateStep = (): boolean => {
//     const requiredFields: { [key: number]: string[] } = {
//       1: ['firstName', 'lastName', 'email', 'phone', 'dob'],
//       2: ['address', 'city', 'state', 'zipCode', 'country'],
//       3: ['idNumber', 'idFrontImage', 'idBackImage']
//     };
    
//     const currentFields = requiredFields[currentStep];
//     if (!currentFields) return true;

//     const newErrors: Errors = {};
//     let isValid = true;

//     currentFields.forEach(field => {
//       if (!formData[field as keyof FormData]) {
//         newErrors[field] = 'This field is required';
//         isValid = false;
//       }
//     });

//     if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Invalid email format';
//       isValid = false;
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   const nextStep = () => {
//     if (validateStep()) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const prevStep = () => {
//     setCurrentStep(currentStep - 1);
//     setErrors({});
//   };

//   const submitKYC = async () => {
//     if (!validateStep()) return;

//     setIsLoading(true);
//     try {
//       setKycStatus('under-review');
//       await new Promise(resolve => setTimeout(resolve, 2000));
//       setKycStatus('completed');
//     } catch (error) {
//       setErrors({ submit: 'Failed to submit KYC. Please try again.' });
//       setKycStatus('pending');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const renderForm = () => {
//     switch (currentStep) {
//       case 1:
//         return <BasicInfoForm formData={formData} handleChange={handleChange} nextStep={nextStep} errors={errors} />;
//       case 2:
//         return <AddressForm formData={formData} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} errors={errors} />;
//       case 3:
//         return <IDVerificationForm formData={formData} handleChange={handleChange} handleFileUpload={handleFileUpload} nextStep={nextStep} prevStep={prevStep} errors={errors} />;
//       case 4:
//         return <ReviewSubmit formData={formData} prevStep={prevStep} submitKYC={submitKYC} isLoading={isLoading} errors={errors} />;
//       default:
//         return <KYCStatus status={kycStatus} />;
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
//       {kycStatus !== 'completed' ? (
//         <>
//           <StepIndicator currentStep={currentStep} />
//           {renderForm()}
//         </>
//       ) : (
//         <UserProfile formData={formData} kycStatus={kycStatus} handleFileUpload={handleFileUpload} />
//       )}
//     </div>
//   );
// };

// interface StepIndicatorProps {
//   currentStep: number;
// }

// const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
//   const steps = [
//     { number: 1, name: 'Basic Info' },
//     { number: 2, name: 'Address' },
//     { number: 3, name: 'ID Verification' },
//     { number: 4, name: 'Review' },
//   ];

//   return (
//     <div className="flex justify-between mb-8">
//       {steps.map((step) => (
//         <div key={step.number} className="flex flex-col items-center">
//           <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= step.number ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
//             {step.number}
//           </div>
//           <div className="text-sm mt-2">{step.name}</div>
//         </div>
//       ))}
//     </div>
//   );
// };

// interface BasicInfoFormProps {
//   formData: FormData;
//   handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
//   nextStep: () => void;
//   errors: Errors;
// }

// const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ formData, handleChange, nextStep, errors }) => {
//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">First Name</label>
//           <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.firstName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
//           {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Last Name</label>
//           <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.lastName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
//           {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Email</label>
//           <input type="email" name="email" value={formData.email} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
//           {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Phone Number</label>
//           <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.phone ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
//           {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
//         </div>
//         <div className="col-span-2">
//           <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
//           <input type="date" name="dob" value={formData.dob} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.dob ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
//           {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
//         </div>
//       </div>
//       <div className="mt-6 flex justify-end">
//         <button type="button" onClick={nextStep} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// interface AddressFormProps {
//   formData: FormData;
//   handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
//   nextStep: () => void;
//   prevStep: () => void;
//   errors: Errors;
// }

// const AddressForm: React.FC<AddressFormProps> = ({ formData, handleChange, nextStep, prevStep, errors }) => {
//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-6">Address Information</h2>
//       <div className="grid grid-cols-2 gap-4">
//         <div className="col-span-2">
//           <label className="block text-sm font-medium text-gray-700">Street Address</label>
//           <input type="text" name="address" value={formData.address} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.address ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
//           {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">City</label>
//           <input type="text" name="city" value={formData.city} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.city ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
//           {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">State/Province</label>
//           <input type="text" name="state" value={formData.state} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.state ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
//           {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Zip/Postal Code</label>
//           <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.zipCode ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
//           {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Country</label>
//           <select name="country" value={formData.country} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.country ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}>
//             <option value="">Select Country</option>
//             <option value="US">United States</option>
//             <option value="CA">Canada</option>
//             <option value="UK">United Kingdom</option>
//             <option value="AU">Australia</option>
//             <option value="IN">India</option>
//           </select>
//           {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
//         </div>
//       </div>
//       <div className="mt-6 flex justify-between">
//         <button type="button" onClick={prevStep} className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//           Back
//         </button>
//         <button type="button" onClick={nextStep} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// interface IDVerificationFormProps {
//   formData: FormData;
//   handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
//   handleFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
//   nextStep: () => void;
//   prevStep: () => void;
//   errors: Errors;
// }

// const IDVerificationForm: React.FC<IDVerificationFormProps> = ({ formData, handleChange, handleFileUpload, nextStep, prevStep, errors }) => {
//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-6">ID Verification</h2>
//       <div className="grid grid-cols-2 gap-4">
//         <div className="col-span-2">
//           <label className="block text-sm font-medium text-gray-700">ID Type</label>
//           <select name="idType" value={formData.idType} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
//             <option value="passport">Passport</option>
//             <option value="drivers_license">Driver's License</option>
//             <option value="national_id">National ID Card</option>
//           </select>
//         </div>
//         <div className="col-span-2">
//           <label className="block text-sm font-medium text-gray-700">ID Number</label>
//           <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.idNumber ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
//           {errors.idNumber && <p className="text-red-500 text-xs mt-1">{errors.idNumber}</p>}
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Front of ID</label>
//           <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//             <div className="space-y-1 text-center">
//               <Upload className="mx-auto h-12 w-12 text-gray-400" />
//               <div className="flex text-sm text-gray-600">
//                 <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
//                   <span>Upload a file</span>
//                   <input type="file" name="idFrontImage" className="sr-only" onChange={handleFileUpload} />
//                 </label>
//                 <p className="pl-1">or drag and drop</p>
//               </div>
//               <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
//             </div>
//           </div>
//           {formData.idFrontImage && <p className="text-sm text-gray-600 mt-1">{formData.idFrontImage.name}</p>}
//           {errors.idFrontImage && <p className="text-red-500 text-xs mt-1">{errors.idFrontImage}</p>}
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Back of ID</label>
//           <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//             <div className="space-y-1 text-center">
//               <Upload className="mx-auto h-12 w-12 text-gray-400" />
//               <div className="flex text-sm text-gray-600">
//                 <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
//                   <span>Upload a file</span>
//                   <input type="file" name="idBackImage" className="sr-only" onChange={handleFileUpload} />
//                 </label>
//                 <p className="pl-1">or drag and drop</p>
//               </div>
//               <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
//             </div>
//           </div>
//           {formData.idBackImage && <p className="text-sm text-gray-600 mt-1">{formData.idBackImage.name}</p>}
//           {errors.idBackImage && <p className="text-red-500 text-xs mt-1">{errors.idBackImage}</p>}
//         </div>
//       </div>
//       <div className="mt-6 flex justify-between">
//         <button type="button" onClick={prevStep} className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//           Back
//         </button>
//         <button type="button" onClick={nextStep} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// interface ReviewSubmitProps {
//   formData: FormData;
//   prevStep: () => void;
//   submitKYC: () => void;
//   isLoading: boolean;
//   errors: Errors;
// }

// const ReviewSubmit: React.FC<ReviewSubmitProps> = ({ formData, prevStep, submitKYC, isLoading, errors }) => {
//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-6">Review Your Information</h2>
//       <div className="bg-gray-50 p-4 rounded-lg mb-4">
//         <h3 className="text-lg font-medium mb-2">Basic Information</h3>
//         <div className="grid grid-cols-2 gap-2">
//           <div><p className="text-sm text-gray-500">Full Name</p><p>{formData.firstName} {formData.lastName}</p></div>
//           <div><p className="text-sm text-gray-500">Email</p><p>{formData.email}</p></div>
//           <div><p className="text-sm text-gray-500">Phone</p><p>{formData.phone}</p></div>
//           <div><p className="text-sm text-gray-500">Date of Birth</p><p>{formData.dob}</p></div>
//         </div>
//       </div>
//       <div className="bg-gray-50 p-4 rounded-lg mb-4">
//         <h3 className="text-lg font-medium mb-2">Address</h3>
//         <p>{formData.address}</p>
//         <p>{formData.city}, {formData.state} {formData.zipCode}</p>
//         <p>{formData.country}</p>
//       </div>
//       <div className="bg-gray-50 p-4 rounded-lg mb-4">
//         <h3 className="text-lg font-medium mb-2">ID Verification</h3>
//         <div><p className="text-sm text-gray-500">ID Type</p><p>{formData.idType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p></div>
//         <div><p className="text-sm text-gray-500">ID Number</p><p>{formData.idNumber}</p></div>
//         <div className="mt-2 flex space-x-4">
//           <div><p className="text-sm text-gray-500">Front of ID</p><div className="mt-1 h-16 w-24 bg-gray-200 flex items-center justify-center">{formData.idFrontImage ? <CheckCircle className="h-8 w-8 text-green-500" /> : <X className="h-8 w-8 text-red-500" />}</div></div>
//           <div><p className="text-sm text-gray-500">Back of ID</p><div className="mt-1 h-16 w-24 bg-gray-200 flex items-center justify-center">{formData.idBackImage ? <CheckCircle className="h-8 w-8 text-green-500" /> : <X className="h-8 w-8 text-red-500" />}</div></div>
//         </div>
//       </div>
//       {errors.submit && <p className="text-red-500 text-sm mb-4">{errors.submit}</p>}
//       <div className="mt-6 flex justify-between">
//         <button type="button" onClick={prevStep} className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//           Back
//         </button>
//         <button type="button" onClick={submitKYC} disabled={isLoading} className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
//           {isLoading ? 'Submitting...' : 'Submit for Verification'}
//         </button>
//       </div>
//     </div>
//   );
// };

// interface KYCStatusProps {
//   status: 'pending' | 'under-review' | 'completed' | 'rejected';
// }

// const KYCStatus: React.FC<KYCStatusProps> = ({ status }) => {
//   const statusInfo = {
//     'pending': { title: 'KYC Not Started', description: 'Complete your KYC process to verify your identity.', icon: <User className="h-16 w-16 text-gray-400" />, color: 'bg-gray-100' },
//     'under-review': { title: 'KYC Under Review', description: 'Your KYC documents are being reviewed by our team.', icon: <Shield className="h-16 w-16 text-yellow-400" />, color: 'bg-yellow-50' },
//     'completed': { title: 'KYC Verified', description: 'Your identity has been verified successfully.', icon: <CheckCircle className="h-16 w-16 text-green-500" />, color: 'bg-green-50' },
//     'rejected': { title: 'KYC Rejected', description: 'Your KYC verification was rejected. Please try again.', icon: <X className="h-16 w-16 text-red-500" />, color: 'bg-red-50' }
//   };

//   const { title, description, icon, color } = statusInfo[status];

//   return (
//     <div className={`text-center p-8 rounded-lg ${color}`}>
//       <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-white">{icon}</div>
//       <h2 className="mt-5 text-2xl font-bold">{title}</h2>
//       <p className="mt-2 text-gray-600">{description}</p>
//     </div>
//   );
// };

// interface UserProfileProps {
//   formData: FormData;
//   kycStatus: 'pending' | 'under-review' | 'completed' | 'rejected';
//   handleFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
// }

// const UserProfile: React.FC<UserProfileProps> = ({ formData, kycStatus, handleFileUpload }) => {
//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   const [profileData, setProfileData] = useState<FormData>(formData);

//   const handleProfileChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setProfileData({ ...profileData, [name]: value });
//   };

//   const saveProfile = () => {
//     setIsEditing(false);
//   };

//   const handleProfilePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
//     handleFileUpload(e);
//     const file = e.target.files?.[0];
//     if (file) setProfileData({ ...profileData, profilePhoto: file });
//   };

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="bg-white shadow rounded-lg">
//         <div className="relative">
//           <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-lg"></div>
//           <div className="absolute bottom-0 left-6 transform translate-y-1/2">
//             <div className="relative">
//               <div className="h-24 w-24 rounded-full border-4 border-white overflow-hidden bg-gray-100 flex items-center justify-center">
//                 {profileData.profilePhoto ? <img src={URL.createObjectURL(profileData.profilePhoto)} alt="Profile" className="h-full w-full object-cover" /> : <User className="h-12 w-12 text-gray-400" />}
//               </div>
//               <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 cursor-pointer hover:bg-blue-700">
//                 <Upload className="h-4 w-4 text-white" />
//                 <input type="file" name="profilePhoto" className="sr-only" onChange={handleProfilePhotoUpload} />
//               </label>
//             </div>
//           </div>
//           <div className="flex justify-end p-4">
//             {isEditing ? (
//               <button onClick={saveProfile} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Save</button>
//             ) : (
//               <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-2"><Edit className="h-4 w-4" /> Edit Profile</button>
//             )}
//           </div>
//         </div>
//         <div className="p-6 pt-14">
//           <div className="mb-6">
//             <h1 className="text-2xl font-bold">{profileData.firstName} {profileData.lastName}</h1>
//             <div className="flex items-center mt-1">
//               {kycStatus === 'completed' ? (
//                 <div className="flex items-center text-green-600"><CheckCircle className="h-5 w-5 mr-1" /><span>KYC Verified</span></div>
//               ) : (
//                 <div className="flex items-center text-yellow-600"><Shield className="h-5 w-5 mr-1" /><span>KYC {kycStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span></div>
//               )}
//             </div>
//           </div>
//           <div className="mb-8">
//             <h2 className="text-lg font-semibold mb-4 border-b pb-2">Basic Information</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="flex items-start">
//                 <Mail className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
//                 <div>
//                   <p className="text-sm text-gray-500">Email</p>
//                   {isEditing ? <input type="email" name="email" value={profileData.email} onChange={handleProfileChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" /> : <p>{profileData.email}</p>}
//                 </div>
//               </div>
//               <div className="flex items-start">
//                 <Phone className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
//                 <div>
//                   <p className="text-sm text-gray-500">Phone</p>
//                   {isEditing ? <input type="tel" name="phone" value={profileData.phone} onChange={handleProfileChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" /> : <p>{profileData.phone}</p>}
//                 </div>
//               </div>
//               <div className="flex items-start">
//                 <Calendar className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
//                 <div><p className="text-sm text-gray-500">Date of Birth</p><p>{profileData.dob}</p></div>
//               </div>
//             </div>
//           </div>
//           <div className="mb-8">
//             <h2 className="text-lg font-semibold mb-4 border-b pb-2">Address Information</h2>
//             <div className="flex items-start">
//               <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
//               <div>
//                 <p className="text-sm text-gray-500">Residential Address</p>
//                 {isEditing ? (
//                   <div className="space-y-2 mt-1">
//                     <input type="text" name="address" value={profileData.address} onChange={handleProfileChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
//                     <div className="grid grid-cols-2 gap-2">
//                       <input type="text" name="city" value={profileData.city} onChange={handleProfileChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
//                       <input type="text" name="state" value={profileData.state} onChange={handleProfileChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
//                     </div>
//                     <div className="grid grid-cols-2 gap-2">
//                       <input type="text" name="zipCode" value={profileData.zipCode} onChange={handleProfileChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
//                       <select name="country" value={profileData.country} onChange={handleProfileChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
//                         <option value="">Select Country</option>
//                         <option value="US">United States</option>
//                         <option value="CA">Canada</option>
//                         <option value="UK">United Kingdom</option>
//                         <option value="AU">Australia</option>
//                         <option value="IN">India</option>
//                       </select>
//                     </div>
//                   </div>
//                 ) : (
//                   <p>{profileData.address}<br />{profileData.city}, {profileData.state} {profileData.zipCode}<br />{profileData.country}</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default KYCProcess;