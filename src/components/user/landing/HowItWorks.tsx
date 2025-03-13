import React from 'react';
import { ArrowRight, UserCircle2, Calendar, MessageCircle } from 'lucide-react';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: 1,
      title: 'Choose a Tasker',
      description: 'Choose a Tasker by price, skills, and reviews.',
      icon: <UserCircle2 size={28} className="text-violet-700" />,
    },
    {
      step: 2,
      title: 'Schedule',
      description: 'Schedule a Tasker as early as today.',
      icon: <Calendar size={28} className="text-violet-700" />,
    },
    {
      step: 3,
      title: 'All in One',
      description: 'Chat, pay, tip, and review all in one place.',
      icon: <MessageCircle size={28} className="text-violet-700" />,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-violet-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get your tasks done in three simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <div
              key={step.step}
              className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 relative z-10"
            >
              {/* Step number badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-violet-800 text-white flex items-center justify-center font-bold text-sm">
                {step.step}
              </div>

              {/* Icon */}
              <div className="w-20 h-20 flex items-center justify-center bg-violet-100 rounded-full mb-6 transition-transform hover:scale-105 duration-300">
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="text-2xl font-semibold text-violet-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}

          {/* Connector lines between cards (visible on md screens and up) */}
          <div className="hidden md:block absolute top-1/4 left-1/3 w-1/4 h-px bg-violet-300 z-0"></div>
          <div className="hidden md:block absolute top-1/4 right-1/3 w-1/4 h-px bg-violet-300 z-0"></div>
        </div>

        {/* Call to action button */}
        <div className="mt-16 text-center">
          <button className="bg-violet-800 hover:bg-violet-900 text-white px-8 py-4 rounded-lg font-medium flex items-center mx-auto transition-all duration-300 hover:scale-105">
            Get Started Today
            <ArrowRight size={20} className="ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;