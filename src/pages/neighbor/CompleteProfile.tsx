import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Upload, Mail, Home, MapPin, User } from 'lucide-react';

// Define the User interface
interface User {
  email: string;
  isEmailVerified: boolean;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  hasAddress: boolean;
  serviceLocation: string;
  hasServiceLocation: boolean;
  idUrl: string;
  isIdVerified: boolean;
  isVerifiedUser: boolean;
}

const CompleteYourProfile = () => {
  const navigate = useNavigate();

  // Initialize user state with TypeScript type
  const [user, setUser] = useState<User>({
    email: 'user@example.com',
    isEmailVerified: false,
    address: { street: '', city: '', state: '', zip: '' },
    hasAddress: false,
    serviceLocation: '',
    hasServiceLocation: false,
    idUrl: '',
    isIdVerified: false,
    isVerifiedUser: false,
  });

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [idFile, setIdFile] = useState<string | null>(null);
  const [isEmailSending, setIsEmailSending] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Step progression logic
  useEffect(() => {
    if (user.isEmailVerified && currentStep === 1) setCurrentStep(2);
    if (user.hasAddress && currentStep === 2) setCurrentStep(3);
    if (user.hasServiceLocation && currentStep === 3) setCurrentStep(4);
    if (user.isIdVerified && currentStep === 4) {
      setUser((prev) => ({ ...prev, isVerifiedUser: true }));
    }
  }, [user, currentStep]);

  // Load Cloudinary script
  // useEffect(() => {
  //   const script = document.createElement('script');
  //   script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
  //   script.async = true;
  //   document.body.appendChild(script);
  //   return () => document.body.removeChild(script);
  // }, []);

  // Handle email verification
  const handleResendEmail = () => {
    setIsEmailSending(true);
    console.log('Resending email to', user.email);
    setTimeout(() => {
      setUser((prev) => ({ ...prev, isEmailVerified: true }));
      setIsEmailSending(false);
    }, 2000); // Mock
  };

  // Handle address submission with type safety
  const handleAddressSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const street = formData.get('street') as string | null;
    const city = formData.get('city') as string | null;
    const state = formData.get('state') as string | null;
    const zip = formData.get('zip') as string | null;

    // Simulate network request
    setTimeout(() => {
      if (street && city && state && zip) {
        const newAddress = { street, city, state, zip };
        setUser((prev) => ({ ...prev, address: newAddress, hasAddress: true }));
      } else {
        console.error('All address fields are required');
      }
      setIsSubmitting(false);
    }, 800);
  };

  // Handle service location
  const handleLocationSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const location = (e.currentTarget.elements.namedItem('location') as HTMLSelectElement).value;
    
    // Simulate network request
    setTimeout(() => {
      if (location) {
        setUser((prev) => ({ ...prev, serviceLocation: location, hasServiceLocation: true }));
      }
      setIsSubmitting(false);
    }, 800);
  };

  // Handle ID upload with Cloudinary
  const handleIdUpload = () => {
    // Mock upload for demo purposes
    setIdFile('/api/placeholder/400/250');
    setTimeout(() => {
      setUser((prev) => ({ 
        ...prev, 
        idUrl: '/api/placeholder/400/250'
      }));
      
      // Mock verification after 3 seconds
      setTimeout(() => {
        setUser((prev) => ({ ...prev, isIdVerified: true }));
      }, 3000);
    }, 1500);
    
    // Actual Cloudinary implementation (commented out)
    // window.cloudinary.openUploadWidget(
    //   {
    //     cloudName: 'your-cloud-name',
    //     uploadPreset: 'your-upload-preset',
    //     sources: ['local', 'camera'],
    //     multiple: false,
    //     resourceType: 'image',
    //   },
    //   (error: any, result: any) => {
    //     if (!error && result && result.event === 'success') {
    //       const url = result.info.secure_url;
    //       setIdFile(url);
    //       setUser((prev) => ({ ...prev, idUrl: url }));
    //       console.log('ID uploaded:', url);
    //       setTimeout(() => setUser((prev) => ({ ...prev, isIdVerified: true })), 3000);
    //     }
    //   }
    // );
  };

  // User Info view
  if (user.isVerifiedUser) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg mx-auto mt-10 border border-violet-100">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-green-50 rounded-full p-3">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-violet-950 text-center mb-2">Verification Complete!</h2>
        <p className="text-gray-500 text-center mb-8">Your profile has been fully verified</p>
        
        <div className="bg-violet-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-violet-900 mb-4">User Information</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-violet-700 mr-3" />
              <div>
                <p className="text-gray-700">{user.email}</p>
                <span className="text-green-600 text-sm font-medium">Verified</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <Home className="h-5 w-5 text-violet-700 mr-3" />
              <div>
                <p className="text-gray-700">{`${user.address.street}, ${user.address.city}`}</p>
                <p className="text-gray-700">{`${user.address.state} ${user.address.zip}`}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-violet-700 mr-3" />
              <p className="text-gray-700">{user.serviceLocation}</p>
            </div>
            
            <div className="flex items-center">
              <User className="h-5 w-5 text-violet-700 mr-3" />
              <div>
                <p className="text-gray-700">Government ID</p>
                <span className="text-green-600 text-sm font-medium">Verified</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/neighbor/home')}
            className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors shadow-md"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Stepper Component
  const steps = [
    // { label: 'Email', icon: <Mail className="h-4 w-4" /> },
    // { label: 'Address', icon: <Home className="h-4 w-4" /> },
    // { label: 'Location', icon: <MapPin className="h-4 w-4" /> },
    { label: 'ID', icon: <User className="h-4 w-4" /> }
  ];
  
  const Stepper = () => (
    <div className="relative mb-10 mt-4">
      {/* Progress bar */}
      <div className="absolute top-4 left-0 h-1 bg-gray-200 w-full -z-10"></div>
      <div 
        className="absolute top-4 left-0 h-1 bg-violet-600 -z-10 transition-all duration-500" 
        style={{ width: `${(currentStep - 1) / (steps.length - 1) * 100}%` }}
      ></div>
      
      {/* Steps */}
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={step.label} className="flex flex-col items-center">
            <div
              className={`h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                index + 1 < currentStep
                  ? 'bg-green-500 text-white'
                  : index + 1 === currentStep
                  ? 'bg-violet-600 text-white'
                  : 'bg-white text-gray-400 border-2 border-gray-200'
              }`}
            >
              {index + 1 < currentStep ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                step.icon
              )}
            </div>
            <span className={`text-sm mt-2 ${
              index + 1 === currentStep ? 'text-violet-700 font-medium' : 'text-gray-500'
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg mx-auto mt-10 border border-violet-100">
      <h2 className="text-2xl font-bold text-violet-950">Complete Your Profile</h2>
      <p className="text-gray-500 mb-8">Finish these steps to start posting tasks</p>

      <Stepper />

      {/* Step 1: Email Verification */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="bg-violet-50 rounded-lg p-6">
            <h3 className="font-semibold text-violet-900 mb-3">Email Verification</h3>
            <p className="text-gray-600 mb-4">
              We've sent a verification link to <strong>{user.email}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Please check your inbox and click the link in the email to verify your account.
            </p>
            
            {user.isEmailVerified ? (
              <div className="flex items-center text-green-600 bg-green-50 p-3 rounded-lg">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Email successfully verified!</span>
              </div>
            ) : (
              <button
                onClick={handleResendEmail}
                disabled={isEmailSending}
                className="w-full px-4 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:bg-violet-300 flex items-center justify-center"
              >
                {isEmailSending ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Resend Verification Email"
                )}
              </button>
            )}
          </div>
          
          <div className="flex justify-end">
            <button
              disabled={!user.isEmailVerified}
              onClick={() => setCurrentStep(2)}
              className={`px-5 py-3 rounded-lg flex items-center transition-colors ${
                user.isEmailVerified
                  ? 'bg-violet-600 text-white hover:bg-violet-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Address */}
      {currentStep === 2 && (
        <form onSubmit={handleAddressSubmit} className="space-y-5">
          <div className="bg-violet-50 rounded-lg p-6 mb-2">
            <h3 className="font-semibold text-violet-900 mb-4">Your Address</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  id="street"
                  name="street"
                  type="text"
                  placeholder="123 Main St"
                  required
                  className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="New York"
                    required
                    className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    placeholder="NY"
                    required
                    className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                <input
                  id="zip"
                  name="zip"
                  type="text"
                  placeholder="10001"
                  required
                  className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-5 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Back
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:bg-violet-300 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  Save and Continue <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Service Location */}
      {currentStep === 3 && (
        <form onSubmit={handleLocationSubmit} className="space-y-5">
          <div className="bg-violet-50 rounded-lg p-6 mb-2">
            <h3 className="font-semibold text-violet-900 mb-4">Service Location</h3>
            <p className="text-sm text-gray-600 mb-4">
              Select the location where you'll be providing or requiring services
            </p>
            
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <select
              id="location"
              name="location"
              required
              className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1rem'
              }}
            >
              <option value="">Select Service Location</option>
              <option value="New York">New York</option>
              <option value="Los Angeles">Los Angeles</option>
              <option value="Chicago">Chicago</option>
              <option value="Houston">Houston</option>
              <option value="Phoenix">Phoenix</option>
              <option value="Philadelphia">Philadelphia</option>
              <option value="San Antonio">San Antonio</option>
              <option value="San Diego">San Diego</option>
            </select>
          </div>
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-5 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Back
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:bg-violet-300 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  Save and Continue <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Step 4: ID Upload */}
      {currentStep === 4 && (
        <div className="space-y-5">
          <div className="bg-violet-50 rounded-lg p-6 mb-2">
            <h3 className="font-semibold text-violet-900 mb-4">Identity Verification</h3>
            <p className="text-sm text-gray-600 mb-6">
              Please upload a government-issued ID to verify your identity. We accept driver's licenses, passports, or state ID cards.
            </p>
            
            <div className={`border-2 ${idFile ? 'border-green-400' : 'border-dashed border-gray-300'} rounded-lg p-6 bg-white text-center`}>
              {idFile ? (
                <div className="space-y-4">
                  <div className="relative mx-auto">
                    <img src={idFile} alt="ID Preview" className="max-w-full h-auto rounded-lg mx-auto" />
                    <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  </div>
                  
                  {!user.isIdVerified && (
                    <p className="text-amber-600 bg-amber-50 p-2 rounded-lg text-sm flex items-center justify-center">
                      <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying your ID...
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="mx-auto flex justify-center">
                    <Upload className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">Drag and drop your ID, or click to browse</p>
                  <button
                    onClick={handleIdUpload}
                    className="px-5 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors inline-flex items-center"
                  >
                    <Upload className="h-4 w-4 mr-2" /> Upload ID
                  </button>
                </div>
              )}
            </div>
            
            {user.isIdVerified && (
              <div className="mt-4 flex items-center text-green-600 bg-green-50 p-3 rounded-lg">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>ID successfully verified!</span>
              </div>
            )}
          </div>
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-5 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Back
            </button>
            
            <button
              disabled={!idFile || user.isIdVerified}
              onClick={() => console.log('Submitted for review')}
              className={`px-5 py-3 rounded-lg flex items-center ${
                idFile && !user.isIdVerified
                  ? 'bg-violet-600 text-white hover:bg-violet-700 transition-colors'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {user.isIdVerified ? 'Verified' : 'Complete Verification'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompleteYourProfile;