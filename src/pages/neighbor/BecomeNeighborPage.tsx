import React, { useState } from "react";
import {
  Mail,
  User,
  Phone,
  Lock,
  Clock,
  DollarSign,
  TrendingUp,
  FileText,
  CheckSquare,
  CreditCard,
  Calendar,
  Star,
  Shield,
} from "lucide-react";
import neighbors from "../../assets/team.png";
import group from '../../assets/group-help.png'
import { NeighborLogin, NeighborSignup } from "../../api/neighborApiRequests";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";

const BecomeANeighbor: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSignup = async () => {
    setLoading(true);
    setError(null);
    const neighbor = {
      name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
    }
    try {
      const response = await NeighborSignup(neighbor)
      console.log('Signup successful:', response);
      alert('Signup successful! Please log in.');
      setIsLogin(true); 
      setFormData({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
      
    } catch (err: unknown) { 
      if (err instanceof Error) {
        setError(err.message || 'An error occurred during signup');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await NeighborLogin(formData.email, formData.password)
      const neighbor = {id:response.id,name:response.name,email:response.email,type:response.type}
      dispatch(setCredentials({user:neighbor}))
      navigate("/neighbor/home")
      
    } catch (err: unknown) { // Use `unknown`
      if (err instanceof Error) {
        setError(err.message || 'An error occurred during signup');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    if (isLogin) {
      handleLogin();
    } else {
      handleSignup();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-6 bg-white shadow-sm border-b border-violet-100">
        <div onClick={()=>navigate("/")} className="text-2xl font-bold text-violet-900">Neighborly</div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-violet-700 hover:text-violet-900"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
          <a
            href="#"
            className="px-4 py-2 bg-violet-700 text-white rounded-lg hover:bg-violet-800 transition"
          >
            {isLogin ? "Log In" : "Sign Up"}
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left: Image with overlay text */}
            <div className="md:w-5/12 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-violet-900/80 to-violet-900/40 flex flex-col justify-end p-8 text-white">
                <h2 className="text-3xl font-bold mb-4">
                  Join our community of helpful neighbors
                </h2>
                <div className="flex gap-4 flex-wrap">
                  <div className="flex items-center">
                    <Star className="text-yellow-400 mr-2" size={20} />
                  </div>
                  <div className="flex items-center">
                    <span>Secure Payments</span>
                  </div>
                </div>
              </div>
              <img
                src={group}
                alt="Become a Neighbor"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right: Form */}
            <div className="md:w-7/12 p-8 md:p-12">
              <h1 className="text-3xl font-bold text-violet-900 mb-2">
                {isLogin ? "Log In" : "Become A Neighbor"}
              </h1>
              <p className="text-gray-600 mb-8">
                {isLogin 
                  ? "Welcome back to Neighborly"
                  : "Start helping your community and earning on your schedule"}
              </p>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-1 flex items-center">
                      <User size={16} className="mr-2 text-violet-700" />
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
                      required
                      disabled={loading}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-gray-700 font-medium mb-1 flex items-center">
                    <Mail size={16} className="mr-2 text-violet-700" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
                    required
                    disabled={loading}
                  />
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-1 flex items-center">
                      <Phone size={16} className="mr-2 text-violet-700" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(555) 555-5555"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
                      required
                      disabled={loading}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-gray-700 font-medium mb-1 flex items-center">
                    <Lock size={16} className="mr-2 text-violet-700" />
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={isLogin ? "Enter your password" : "Create a password"}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
                    required
                    disabled={loading}
                  />
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-1 flex items-center">
                      <Lock size={16} className="mr-2 text-violet-700" />
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
                      required
                      disabled={loading}
                    />
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full px-6 py-4 bg-violet-700 text-white rounded-lg hover:bg-violet-800 transition text-lg font-medium disabled:bg-violet-400"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : (isLogin ? "Log In" : "Join Neighborly")}
                  </button>
                </div>

                <p className="text-sm text-gray-500 text-center">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-violet-700 hover:underline"
                    disabled={loading}
                  >
                    {isLogin ? "Sign Up" : "Log In"}
                  </button>
                </p>

                {!isLogin && (
                  <p className="text-sm text-gray-500 text-center">
                    By signing up, you agree to our{" "}
                    <a href="#" className="text-violet-700 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-violet-700 hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-violet-900 mb-4">
          Flexible work, at your fingertips

          </h2>
          <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
          Find local jobs that fit your skills and schedule. With Neighborly, you have the freedom and support to be your own boss.          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Benefit 1: Set Your Schedule */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-16 h-16 flex items-center justify-center bg-yellow-400 rounded-full mb-6 mx-auto">
                <Clock size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-violet-900 mb-3">
                Set Your Schedule
              </h3>
              <p className="text-gray-600">
                Work when it works for you. Accept jobs that fit your schedule and lifestyle, with no minimum hours required.
              </p>
            </div>

            {/* Benefit 2: Keep Your Earnings */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-16 h-16 flex items-center justify-center bg-yellow-400 rounded-full mb-6 mx-auto">
                <DollarSign size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-violet-900 mb-3">
                Keep Your Earnings
              </h3>
              <p className="text-gray-600">
                You keep 100% of what you charge, plus tips! Get paid securely through our platform within 24 hours of job completion.
              </p>
            </div>

            {/* Benefit 3: Build Your Business */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-16 h-16 flex items-center justify-center bg-yellow-400 rounded-full mb-6 mx-auto">
                <TrendingUp size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-violet-900 mb-3">
                Build Your Business
              </h3>
              <p className="text-gray-600">
                We connect you with clients in your area. Earn great reviews and build your reputation to attract more work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Neighborly Section */}
      <section className="py-20 px-4 bg-violet-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Left: Text */}
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-violet-900 mb-6">
              What is Neighborly?
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Neighborly connects people who need help with trusted locals who can lend a hand with everything from home repairs to errands. As a Neighbor, you can:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="mt-1 mr-3 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <CheckSquare size={14} className="text-white" />
                </div>
                <span className="text-gray-700">
                  Choose from 50+ service categories that match your skills
                </span>
              </li>
              <li className="flex items-start">
                <div className="mt-1 mr-3 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <CheckSquare size={14} className="text-white" />
                </div>
                <span className="text-gray-700">
                  Set your own rates and keep 100% of your earnings plus tips
                </span>
              </li>
              <li className="flex items-start">
                <div className="mt-1 mr-3 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <CheckSquare size={14} className="text-white" />
                </div>
                <span className="text-gray-700">
                  Work when and where you want with complete flexibility
                </span>
              </li>
              <li className="flex items-start">
                <div className="mt-1 mr-3 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <CheckSquare size={14} className="text-white" />
                </div>
                <span className="text-gray-700">
                  Make a meaningful difference in your community
                </span>
              </li>
            </ul>
          </div>

          {/* Right: Image */}
          <div className="md:w-1/2">
            <img
              src={neighbors} // Replace with more appropriate image
              alt="What is Neighborly"
              className="w-full h-auto rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-violet-900 text-center mb-12">
            Getting Started
          </h2>
          <div className="space-y-12">
            {/* Step 1: Sign Up */}
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 flex items-center justify-center bg-yellow-400 rounded-full">
                <User size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-violet-900 mb-2">1. Sign up</h3>
                <p className="text-gray-600">
                  Create your account. Then download the Neighborly app to continue registration.
                </p>
              </div>
            </div>

            {/* Step 2: Build Your Profile */}
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 flex items-center justify-center bg-yellow-400 rounded-full">
                <FileText size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-violet-900 mb-2">
                  2. Build your profile
                </h3>
                <p className="text-gray-600">
                  Select what services you want to offer and where.
                </p>
              </div>
            </div>

            {/* Step 3: Verify Your Eligibility */}
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 flex items-center justify-center bg-yellow-400 rounded-full">
                <CheckSquare size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-violet-900 mb-2">
                  3. Verify your eligibility to help
                </h3>
                <p className="text-gray-600">
                  Confirm your identity and submit business verifications, as required.
                </p>
              </div>
            </div>

            {/* Step 4: Pay Registration Fee */}
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 flex items-center justify-center bg-yellow-400 rounded-full">
                <CreditCard size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-violet-900 mb-2">
                  4. Pay registration fee
                </h3>
                <p className="text-gray-600">
                  In applicable cities, we charge a $25 registration fee that helps us provide the best service to you.
                </p>
              </div>
            </div>

            {/* Step 5: Set Your Schedule and Work Area */}
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 flex items-center justify-center bg-yellow-400 rounded-full">
                <Calendar size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-violet-900 mb-2">
                  5. Set your schedule and work area
                </h3>
                <p className="text-gray-600">
                  Set your weekly availability and opt in to receive same-day jobs.
                </p>
              </div>
            </div>

            {/* Step 6: Start Getting Jobs */}
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 flex items-center justify-center bg-yellow-400 rounded-full">
                <DollarSign size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-violet-900 mb-2">
                  6. Start getting jobs
                </h3>
                <p className="text-gray-600">Grow your business on your own terms.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BecomeANeighbor;

function setError(arg0: any) {
  throw new Error("Function not implemented.");
}
