import React, { useState } from 'react';
import NavbarLanding from '../../components/user/common/Navbar-Landing';
import { DescribeTask } from '../../components/user/task/DescribeTask';
import { BrowseHelpers } from '../../components/user/task/BrowseHelpers';
import { ScheduleTask } from '../../components/user/task/ScheduleTask';
import { ConfirmTask } from '../../components/user/task/ConfirmTask';


const TaskCreationPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [taskData, setTaskData] = useState<{
    location: string;
    taskSize: string;
    taskDetails: string;
  } | null>(null);
  const [selectedHelper, setSelectedHelper] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<{ date: string; time: string } | null>(null);
  const steps = ['Describe Your Task', 'Browse Helpers & Prices', 'Schedule', 'Confirm'];

  const handleDescribeTaskContinue = (data: {
    location: string;
    taskSize: string;
    taskDetails: string;
  }) => {
    setTaskData(data);
    setCurrentStep(2);
  };

  const handleBrowseHelpersContinue = (helperId: string) => {
    setSelectedHelper(helperId);
    setCurrentStep(3);
  };

  const handleScheduleContinue = (scheduleData: { date: string; time: string }) => {
    setSchedule(scheduleData);
    setCurrentStep(4);
  };

  const handleConfirm = () => {
    alert("Task requested successfully!");
    // Here you can add logic to send the task request to the backend
    // Reset state or redirect user to a confirmation page/dashboard
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarLanding />
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${
                      currentStep >= index + 1
                        ? 'bg-violet-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="mt-2 text-sm font-medium text-gray-700">{step}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-violet-600 rounded-full"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Steps */}
          {currentStep === 1 && <DescribeTask onContinue={handleDescribeTaskContinue} />}
          {currentStep === 2 && taskData && (
            <BrowseHelpers onContinue={handleBrowseHelpersContinue} taskData={taskData} />
          )}
          {currentStep === 3 && taskData && selectedHelper && (
            <ScheduleTask
              onContinue={handleScheduleContinue}
              selectedHelper={selectedHelper}
              taskData={taskData}
            />
          )}
          {currentStep === 4 && taskData && selectedHelper && schedule && (
            <ConfirmTask
              onConfirm={handleConfirm}
              taskData={taskData}
              selectedHelper={selectedHelper}
              schedule={schedule}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCreationPage;