// import React, { useState, useCallback } from 'react';
// import NavbarLanding from '../../components/layout/Navbar-Landing';
// import { DescribeTask } from '../../components/user/task/DescribeTask';
// import { BrowseNeighbors } from '../../components/user/task/BrowseHelpers';
// import { ScheduleTask } from '../../components/user/task/ScheduleTask';
// import { ConfirmTask } from '../../components/user/task/ConfirmTask';
// import { NeighborInfo } from '../../types/neighbor';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../redux/store';
// import { createTask } from '../../api/taskApiRequests';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { Availability } from '../../pages/neighbor/Schedules/FetchAvailability';

// interface TaskData {
//   lat: number;
//   lng: number;
//   address: string;
//   taskSize: string;
//   taskDetails: string;
//   category: string;
//   subCategory: string;
//   preferredTiming?: string;
//   neighbors: NeighborInfo[];
// }

// const TaskCreationPage: React.FC = () => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [neighborsList, setNeighborsList] = useState<NeighborInfo[]>([]);
//   const [taskData, setTaskData] = useState<TaskData | null>(null);
//   const [selectedHelper, setSelectedHelper] = useState<NeighborInfo | null>(null);
//   const [selectedHelperAvailability, setSelectedHelperAvailability] = useState<Availability[]>([]); // New state for availability
//   const [schedule, setSchedule] = useState<{ date: string; time: string } | null>(null);
//   const steps = ['Describe Your Task', 'Browse Helpers & Prices', 'Schedule', 'Confirm'];
//   const { user } = useSelector((state: RootState) => state.auth);
//   const navigate = useNavigate();

//   const handleDescribeTaskContinue = useCallback((data: TaskData) => {
//     setTaskData(data);
//     setNeighborsList(data.neighbors);
//     setCurrentStep(2);
//   }, []);

//   const handleBrowseHelpersContinue = useCallback((neighbor: NeighborInfo, availability: Availability[]) => {
//     console.log(neighbor)
//     setSelectedHelper(neighbor);
//     setSelectedHelperAvailability(availability); // Store availability
//     setCurrentStep(3);
//   }, []);

//   const handleScheduleContinue = useCallback((scheduleData: { date: string; time: string }) => {
//     setSchedule(scheduleData);
//     setCurrentStep(4);
//   }, []);

//   const calculateEstHours = (taskSize: string): number => {
//     const hoursMap: { [key: string]: number } = {
//       Small: 1,
//       Medium: 3,
//       Large: 6,
//     };
//     return hoursMap[taskSize] || 1;
//   };

//   const handleConfirm = useCallback(async () => {
//     if (!taskData || !selectedHelper || !schedule || !user) {
//       toast.error('Missing required data. Please complete all steps.');
//       return;
//     }
//     const taskDetails = {
//       _id: '',
//       createdBy: user.id,
//       assignedNeighbor: selectedHelper._id,
//       lat: taskData.lat,
//       lng: taskData.lng,
//       address: taskData.address,
//       category: taskData.category,
//       subCategory: taskData.subCategory,
//       description: taskData.taskDetails,
//       est_hours: calculateEstHours(taskData.taskSize),
//       preferredDate: schedule.date,
//       ratePerHour: selectedHelper.skills[0].hourlyRate,
//     };
//     try {
//       await createTask(taskDetails);
//       navigate('/home/taskList');
//       toast.success('Task requested successfully!');
//     } catch (error) {
//       toast.error('Failed to create task. Please try again.');
//     }
//   }, [taskData, selectedHelper, schedule, user, navigate]);

//   const handleBack = useCallback(() => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   }, [currentStep]);

//   const isNextDisabled = useCallback(() => {
//     return (
//       (currentStep === 1 && !taskData) ||
//       (currentStep === 2 && !selectedHelper) ||
//       (currentStep === 3 && !schedule)
//     );
//   }, [currentStep, taskData, selectedHelper, schedule]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <NavbarLanding />
//       <div className="py-12">
//         <div className="max-w-4xl mx-auto px-4">
//           <div className="mb-12">
//             <div className="flex justify-between items-center">
//               {steps.map((step, index) => (
//                 <div key={index} className="flex flex-col items-center">
//                   <div
//                     className={`w-10 h-10 flex items-center justify-center rounded-full ${
//                       currentStep >= index + 1
//                         ? 'bg-violet-600 text-white'
//                         : 'bg-gray-300 text-gray-600'
//                     }`}
//                     aria-label={`Step ${index + 1}: ${step}`}
//                   >
//                     {index + 1}
//                   </div>
//                   <span className="mt-2 text-sm font-medium text-gray-700">{step}</span>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-4 h-2 bg-gray-200 rounded-full">
//               <div
//                 className="h-full bg-violet-600 rounded-full"
//                 style={{ width: `${(currentStep / steps.length) * 100}%` }}
//               ></div>
//             </div>
//           </div>

//           {currentStep === 1 && <DescribeTask onContinue={handleDescribeTaskContinue} />}
//           {currentStep === 2 && taskData && (
//             <BrowseNeighbors
//               onContinue={handleBrowseHelpersContinue}
//               neighbors={neighborsList}
//               taskData={taskData}
//             />
//           )}
//           {currentStep === 3 && taskData && selectedHelper && (
//             <ScheduleTask
//               onContinue={handleScheduleContinue}
//               selectedHelper={selectedHelper}
//               taskData={taskData}
//               availability={selectedHelperAvailability} // Pass availability
//             />
//           )}
//           {currentStep === 4 && taskData && selectedHelper && schedule && (
//             <ConfirmTask
//               onConfirm={handleConfirm}
//               taskData={taskData}
//               selectedHelper={selectedHelper}
//               schedule={schedule}
//             />
//           )}

//           <div className="mt-8 flex justify-between">
//             <button
//               onClick={handleBack}
//               disabled={currentStep === 1}
//               className={`px-4 py-2 rounded-md ${
//                 currentStep === 1
//                   ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                   : 'bg-violet-600 text-white hover:bg-violet-700'
//               }`}
//             >
//               Back
//             </button>
//             {currentStep < 4 && (
//               <button
//                 onClick={() => setCurrentStep(currentStep + 1)}
//                 disabled={isNextDisabled()}
//                 className={`px-4 py-2 rounded-md ${
//                   isNextDisabled()
//                     ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                     : 'bg-violet-600 text-white hover:bg-violet-700'
//                 }`}
//               >
//                 Next
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TaskCreationPage;





import React, { useState, useCallback } from 'react';
import NavbarLanding from '../../components/layout/Navbar-Landing';
import { DescribeTask } from '../../components/user/task/DescribeTask';
import { BrowseNeighbors } from '../../components/user/task/BrowseHelpers';
import { ScheduleTask } from '../../components/user/task/ScheduleTask';
import { ConfirmTask } from '../../components/user/task/ConfirmTask';
import { NeighborInfo } from '../../types/neighbor';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { createTask } from '../../api/taskApiRequests';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Availability } from '../../pages/neighbor/Schedules/FetchAvailability';

interface TaskData {
  lat: number;
  lng: number;
  address: string;
  taskSize: string;
  taskDetails: string;
  category: string;
  subCategory: string;
  neighbors: NeighborInfo[];
}

const TaskCreationPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [neighborsList, setNeighborsList] = useState<NeighborInfo[]>([]);
  const [taskData, setTaskData] = useState<TaskData | null>(null);
  const [selectedHelper, setSelectedHelper] = useState<NeighborInfo | null>(null);
  const [selectedHelperAvailability, setSelectedHelperAvailability] = useState<Availability[]>([]);
  const [schedule, setSchedule] = useState<{ date: string } | null>(null);
  const [estimateCost,setEstimateCost] =useState('')

  const steps = ['Describe Your Task', 'Browse Helpers & Prices', 'Schedule', 'Confirm'];
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const handleDescribeTaskContinue = useCallback((data: TaskData) => {
    setTaskData(data);
    setNeighborsList(data.neighbors);
    setCurrentStep(2);
  }, []);

  const handleBrowseHelpersContinue = useCallback((neighbor: NeighborInfo, availability: Availability[]) => {
    setSelectedHelper(neighbor);
    setSelectedHelperAvailability(availability);
    setCurrentStep(3);
  }, []);

  const handleScheduleContinue = useCallback((scheduleData: { date: string }) => {
    setSchedule(scheduleData);
    setCurrentStep(4);
  }, []);

  const calculateEstAmount = (taskSize: string): string => {
    const match = taskSize.match(/^(\d+)-(\d+)hr$/);
    if (!match) return '0'; // Fallback
    const minDuration = parseInt(match[1], 10);
    const maxDuration = parseInt(match[2], 10);
    const estAmount =(`${minDuration * selectedHelper?.skills[0].hourlyRate!} - ${maxDuration * selectedHelper?.skills[0].hourlyRate!}`)
    return estAmount
  };

  const handleConfirm = useCallback(async () => {
    if (!taskData || !selectedHelper || !schedule || !user) {
      toast.error('Missing required data. Please complete all steps.');
      return;
    }
    const taskDetails = {
      createdBy: user.id,
      assignedNeighbor: selectedHelper._id,
      lat: taskData.lat,
      lng: taskData.lng,
      location: taskData.address,
      category: taskData.category,
      subCategory: taskData.subCategory,
      description: taskData.taskDetails,
      est_hours: taskData.taskSize,
      prefferedDate: schedule.date,
      ratePerHour: selectedHelper.skills[0].hourlyRate,
      est_amount:calculateEstAmount(taskData.taskSize)

    };
    try {
      await createTask(taskDetails);
      navigate('/home/taskList');
      toast.success('Task requested successfully!');
    } catch (error) {
      toast.error('Failed to create task. Please try again.');
    }
  }, [taskData, selectedHelper, schedule, user, navigate]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const isNextDisabled = useCallback(() => {
    return (
      (currentStep === 1 && !taskData) ||
      (currentStep === 2 && !selectedHelper) ||
      (currentStep === 3 && !schedule)
    );
  }, [currentStep, taskData, selectedHelper, schedule]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarLanding />
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4">
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
                    aria-label={`Step ${index + 1}: ${step}`}
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

          {currentStep === 1 && <DescribeTask onContinue={handleDescribeTaskContinue} />}
          {currentStep === 2 && taskData && (
            <BrowseNeighbors
              onContinue={handleBrowseHelpersContinue}
              neighbors={neighborsList}
              taskData={taskData}
            />
          )}
          {currentStep === 3 && taskData && selectedHelper && (
            <ScheduleTask
              onContinue={handleScheduleContinue}
              selectedHelper={selectedHelper}
              taskData={taskData}
              availability={selectedHelperAvailability}
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

          <div className="mt-8 flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-4 py-2 rounded-md ${
                currentStep === 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-violet-600 text-white hover:bg-violet-700'
              }`}
            >
              Back
            </button>
            {currentStep < 4 && (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={isNextDisabled()}
                className={`px-4 py-2 rounded-md ${
                  isNextDisabled()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-violet-600 text-white hover:bg-violet-700'
                }`}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCreationPage;