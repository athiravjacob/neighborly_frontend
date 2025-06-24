import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from '../redux/store';
import { newTaskDetails } from '../types/newTaskDetails';
import { useTasks } from '../hooks/useTasks';
import { acceptTask, fetchArrivalTime, VerifyCode } from '../api/taskApiRequests';
import { TaskAcceptForm } from '../types/taskAcceptForm';

interface TaskAcceptanceForm {
  estimatedHours: number;
  paymentAmount: number;
  arrivalTime: number | null; 
}

interface UseTaskDetailsReturn {
  task: newTaskDetails | undefined;
  taskAcceptanceForm: TaskAcceptanceForm;
  isCodeInputOpen: boolean;
  codeInput: string;
  setCodeInput: (code:string) => void;
  verifying: boolean;
  chatOpen: boolean;
  chatTaskId: string;
  chatHelperId: string;
  helperName: string;
  setChatOpen: (open: boolean) => void;
  handleFormChange: (field: string, value: string) => void;
  handleAcceptTask: (taskId: string | undefined) => void;
  handleChat: (taskId: string | undefined, helperId: string | undefined, name: string) => void;
  handleStartTask: () => void;
  verifyCodeAndStartTask: () => void;
  cancelCodeVerification: () => void;
}

export const useTaskDetails = (taskId: string): UseTaskDetailsReturn => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { tasks } = useTasks(user?.id, user?.type!);
  const task = tasks.find((t) => t._id === taskId);

  const [taskAcceptanceForm, setTaskAcceptanceForm] = useState<TaskAcceptForm>({
    estimatedHours: 0,
    paymentAmount: 0,
    date:task?.prefferedDate!,
    arrivalTime: null, 
  });
  const [isCodeInputOpen, setIsCodeInputOpen] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatTaskId, setChatTaskId] = useState('');
  const [chatHelperId, setChatHelperId] = useState('');
  const [helperName, setHelperName] = useState('');

  async function calculate_arrival(taskId: string, neighborId: string, date: Date, hours: number) {
    return await fetchArrivalTime(taskId, neighborId, date, hours);
  }

  const handleFormChange = useCallback(
    (field: string, value: string) => {
      if (field !== 'estimatedHours') return;

      const hours = parseFloat(value);
      const maxHours = task?.est_hours ? parseFloat(task.est_hours.split('-')[1]) : Infinity;

      if (isNaN(hours) || hours > maxHours) {
        toast.error(`Estimated hours cannot exceed ${maxHours} hours.`);
        return;
      }

      const hourlyRate = task?.assignedNeighbor?.skills?.[0]?.hourlyRate;
      const paymentAmount = hourlyRate && !isNaN(hours) ? hours * hourlyRate : 0;
      if (!hourlyRate) {
        toast.error('Hourly rate is not available.');
        return;
      }

      calculate_arrival(
        task?._id!,
        task?.assignedNeighbor?._id!,
        task?.prefferedDate!,
        hours
      ).then((arrivalTime) => {
        if (arrivalTime === null) {
          toast.error('No available time slot for the requested hours.');
          return;
        }

        // Format arrivalTime for display (e.g., "14:00" for 840 minutes)
        const formatTime = (minutes: number) => {
          const hours = Math.floor(minutes / 60);
          const mins = minutes % 60;
          return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
        };
        const formattedArrivalTime = formatTime(arrivalTime);

        setTaskAcceptanceForm({
          estimatedHours: hours,
          paymentAmount,
          date:task.prefferedDate,
          arrivalTime,
        });
      }).catch((error) => {
        toast.error('Error calculating arrival time.');
        console.error(error);
      });
    },
    [task]
  );

  const handleAcceptTask = useCallback(
    async (taskId: string | undefined) => {
      if (!taskId || !user?.id) {
        toast.error('Task ID or User ID is missing');
        return;
      }

      if (!taskAcceptanceForm.estimatedHours || !taskAcceptanceForm.paymentAmount || taskAcceptanceForm.arrivalTime === null) {
        toast.error('Please fill in all required fields, including a valid arrival time');
        return;
      }

      try {
        await acceptTask(taskId, user.id, taskAcceptanceForm);
        toast.success('Task accepted successfully!');
      } catch (error) {
        toast.error('Failed to accept task. Please try again.');
      }
    },
    [taskAcceptanceForm, user?.id]
  );

  
  const handleChat = useCallback(
    (taskId: string | undefined, helperId: string | undefined, name: string) => {
      if (!taskId || !helperId || !user?.id) {
        toast.error('Invalid task, helper, or user ID');
        return;
      }
      console.log(taskId,"->taskID", helperId ,"-> hlpr id")
      setChatTaskId(taskId);
      setChatHelperId(helperId);
      setHelperName(name);
      setChatOpen(true);
    },
    [user?.id],
  );

  const handleStartTask = useCallback(() => {
    if (!task?._id) {
      toast.error('Task ID is required');
      return;
    }
    setIsCodeInputOpen(true);
  }, [task]);

  const verifyCodeAndStartTask = useCallback(async () => {
    if (!task?._id || !task.createdBy?._id) {
      toast.error('Task ID or Helper ID is missing');
      return;
    }

    try {
      setVerifying(true);
      const isVerified = await VerifyCode(task._id, task.createdBy._id!, codeInput);
      if (isVerified) {
        toast.success('Code verified successfully. Task started!');
        setIsCodeInputOpen(false);
        setCodeInput('');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error('Invalid code. Please try again.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify code.');
    } finally {
      setVerifying(false);
    }
  }, [task, codeInput]);

  const cancelCodeVerification = useCallback(() => {
    setIsCodeInputOpen(false);
    setCodeInput('');
  }, []);

  return {
    task,
    taskAcceptanceForm,
    isCodeInputOpen,
    codeInput,
    setCodeInput,
    verifying,
    chatOpen,
    chatTaskId,
    chatHelperId,
    helperName,
    setChatOpen,
    handleFormChange,
    handleAcceptTask,
    handleChat,
    handleStartTask,
    verifyCodeAndStartTask,
    cancelCodeVerification,
  };
};