import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-white overflow-hidden h-screen flex flex-col justify-center items-center">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-violet-50 opacity-50">
        <div className="absolute inset-0" style={{
        //   backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234c1d95' fill-opacity='0.07'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}></div>
      </div>

      {/* Content Section */}
      <div className="text-center relative z-10">
        <div className="h-2 w-20 bg-violet-600 mb-8 mx-auto rounded-full"></div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Get Things Done with <span className="text-violet-700">Neighborly</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-10 max-w-lg mx-auto">
          Post a task and let our vetted helpers take care of the rest—fast and easy.
        </p>
        
        {/* Search Section */}
        <div className="bg-white p-2 rounded-xl shadow-lg max-w-md mx-auto">
          <div className="flex flex-col md:flex-row gap-2 justify-center">
            <input
              type="text"
              placeholder="What do you need help with today?"
              className="flex-1 px-6 py-4 text-lg rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent"
            />
            <button className="bg-violet-600 text-white px-8 py-4 rounded-lg hover:bg-violet-700 transition-colors font-medium text-lg">
                        <span className="text-3xl font-bold">→</span>

            </button>
          </div>
        </div>
      </div>

      {/* Decorative Shapes */}<div className="absolute top-0 right-10 w-44 h-44 bg-purple-400 rounded-full opacity-20"></div>
<div className="absolute top-0 right-5 w-32 h-32 bg-violet-600 rounded-full opacity-20"></div>
<div className="absolute top-0 left-10 w-52 h-52 bg-blue-500 rounded-full opacity-20"></div>
<div className="absolute top-0 left-26 w-40 h-40 bg-green-500 rounded-full opacity-20"></div>

{/* Additional Shapes */}
{/* Top-left corner */}
{/* Top-right corner */}
<div className="absolute top-20 right-20 w-24 h-24 bg-violet-400 opacity-20 rounded-full"></div>
{/* Bottom-left corner */}
<div className="absolute top-20 left-20 w-56 h-56 bg-violet-400 opacity-30 rounded-full"></div>
{/* Bottom-right corner */}
<div className="absolute bottom-52 right-52 w-16 h-16 bg-teal-600 opacity-25 rounded-full"></div>
<div className="absolute bottom-32 right-40 w-28 h-28 bg-teal-600 opacity-25 rounded-full"></div>
<div className="absolute bottom-10 right-10 w-10 h-10 bg-teal-600 opacity-25 rounded-full"></div>
<div className="absolute bottom-12 right-20 w-52 h-52 bg-teal-600 opacity-25 rounded-full"></div>


    </section>
  );
};

export default HeroSection;
