import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NeighborInfo } from '../../../types/neighbor';
import { RootState } from '../../../redux/store';
import NavbarLanding from '../common/Navbar-Landing';
import { useNavigate } from 'react-router-dom';

interface Task {
  _id: string;
  createdBy: string;
  assignedNeighbor: NeighborInfo | null;
  location: string;
  category: string;
  subCategory: string;
  description: string;
  est_hours: number;
  prefferedDate: string;
  timeSlot: { startTime: number };
  ratePerHour: number;
  status?: string;
  createdAt: string;
}

const dummyTasks: Task[] = [
  {
    _id: '1',
    createdBy: 'user123',
    assignedNeighbor: { _id: 'n1', name: 'John Doe', skills: [{ hourlyRate: 20 }] } as NeighborInfo,
    location: '123 Main St, Springfield',
    category: 'Home',
    subCategory: 'Cleaning',
    description: 'Clean the living room and kitchen.',
    est_hours: 2,
    prefferedDate: '2025-04-15',
    timeSlot: { startTime: 1744266600 },
    ratePerHour: 20,
    status: 'Pending',
    createdAt: '2025-04-01T10:00:00Z',
  },
  {
    _id: '2',
    createdBy: 'user123',
    assignedNeighbor: { _id: 'n2', name: 'Jane Smith', skills: [{ hourlyRate: 25 }] } as NeighborInfo,
    location: '456 Oak Ave, Springfield',
    category: 'Garden',
    subCategory: 'Lawn Mowing',
    description: 'Mow the front and back lawn.',
    est_hours: 4,
    prefferedDate: '2025-04-16',
    timeSlot: { startTime: 1744353000 },
    ratePerHour: 25,
    status: 'Scheduled',
    createdAt: '2025-04-02T14:00:00Z',
  },
  {
    _id: '3',
    createdBy: 'user123',
    assignedNeighbor: null,
    location: '789 Pine Rd, Springfield',
    category: 'Repair',
    subCategory: 'Plumbing',
    description: 'Fix a leaky faucet in the bathroom.',
    est_hours: 6,
    prefferedDate: '2025-04-17',
    timeSlot: { startTime: 1744439400 },
    ratePerHour: 30,
    status: 'Pending',
    createdAt: '2025-04-03T09:00:00Z',
  },
];

// Status badge component for better visual distinction
const StatusBadge = ({ status }: { status: string }) => {
  let bgColor = '';
  let textColor = '';
  
  switch(status) {
    case 'Completed':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'Scheduled':
      bgColor = 'bg-violet-100';
      textColor = 'text-violet-800';
      break;
    case 'Pending':
    default:
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      break;
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {status || 'Pending'}
    </span>
  );
};

// Category icon component to add visual cues
const CategoryIcon = ({ category }: { category: string }) => {
  let icon = '🏠'; // Default home icon
  
  switch(category.toLowerCase()) {
    case 'home':
      icon = '🏠';
      break;
    case 'garden':
      icon = '🌱';
      break;
    case 'repair':
      icon = '🔧';
      break;
    default:
      icon = '📋';
  }
  
  return <span className="text-xl mr-2">{icon}</span>;
};

const TaskListPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate()
  useEffect(() => {
    const loadDummyTasks = () => {
      if (!user?.id) return;
      setLoading(true);
      setTimeout(() => {
        setTasks(dummyTasks.filter((task) => task.createdBy === "user123"));
        setLoading(false);
      }, 1000);
    };
    loadDummyTasks();
  }, [user?.id]);

  const formatDateTime = (timestamp: number, date: string) => {
    const dateObj = new Date(date);
    const time = new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${dateObj.toLocaleDateString()} at ${time}`;
  };

  const formatCreatedAt = (isoString: string) => {
    return new Date(isoString).toLocaleString();
  };

  const handleChangeHelper = (taskId: string) => {
    // Implement logic to change helper here
    console.log(`Changing helper for task ${taskId}`);
    setSelectedTask(null);
  };

  const handleChat = (taskId: string) => {
    // Implement chat initiation logic here
    console.log(`Opening chat for task ${taskId}`);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status?.toLowerCase() === filter.toLowerCase();
  });

  // Calculate some statistics for the dashboard
  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
  const scheduledTasks = tasks.filter(task => task.status === 'Scheduled').length;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarLanding />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-violet-900">Your Tasks </h1>
            <p className="mt-2 text-sm text-gray-600">Manage and track all your neighborhood tasks in one place</p>
          </div>
          
          {/* Stats overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-violet-700">
              <p className="text-sm text-gray-600 uppercase">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900">{tasks.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <p className="text-sm text-gray-600 uppercase">Completed</p>
              <p className="text-3xl font-bold text-gray-900">{completedTasks}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
              <p className="text-sm text-gray-600 uppercase">Pending</p>
              <p className="text-3xl font-bold text-gray-900">{pendingTasks}</p>
            </div>
          </div>
          
          {/* Filters and actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
            <div className="flex space-x-2">
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'all' ? 'bg-violet-700 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setFilter('all')}
              >
                All Tasks
              </button>
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setFilter('pending')}
              >
                Pending
              </button>
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'scheduled' ? 'bg-violet-700 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setFilter('scheduled')}
              >
                Scheduled
              </button>
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'completed' ? 'bg-green-600 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
            </div>
            
            <button 
              onClick={()=>navigate("/create-task")}
              className="bg-violet-700 hover:bg-violet-800 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Create New Task
            </button>
          </div>
          
          {/* Tasks list */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-700"></div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks found</h3>
              <p className="mt-2 text-gray-600">
                {filter === 'all' 
                  ? "You haven't created any tasks yet. Click 'Create New Task' to get started." 
                  : `You don't have any ${filter} tasks.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <CategoryIcon category={task.category} />
                        <h2 className="text-lg font-semibold text-gray-800">{task.category} - {task.subCategory}</h2>
                      </div>
                      <StatusBadge status={task.status || 'Pending'} />
                    </div>
                    
                    <p className="mt-3 text-gray-600 line-clamp-2">{task.description}</p>
                    
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {formatDateTime(task.timeSlot.startTime, task.prefferedDate)}
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      ${task.ratePerHour} / hour
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <div className="flex items-center">
                        {task.assignedNeighbor ? (
                          <>
                            <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-medium">
                              {task.assignedNeighbor.name.charAt(0)}
                            </div>
                            <span className="ml-2 text-sm text-gray-600">{task.assignedNeighbor.name}</span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500 italic">No helper assigned</span>
                        )}
                      </div>
                      
                      {task.assignedNeighbor && (
                        <button 
                          className="text-violet-700 hover:text-violet-700 text-sm font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChat(task._id);
                          }}
                        >
                          Chat
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gray-50 rounded-t-lg py-4 px-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <CategoryIcon category={selectedTask.category} />
                {selectedTask.category} - {selectedTask.subCategory}
              </h2>
              <StatusBadge status={selectedTask.status || 'Pending'} />
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Task Details</h3>
                  <div className="space-y-3">
                    <p className="flex items-start">
                      <span className="w-24 text-gray-600 font-medium">Description:</span>
                      <span className="text-gray-900">{selectedTask.description}</span>
                    </p>
                    <p className="flex items-start">
                      <span className="w-24 text-gray-600 font-medium">Location:</span>
                      <span className="text-gray-900">{selectedTask.location}</span>
                    </p>
                    <p className="flex items-start">
                      <span className="w-24 text-gray-600 font-medium">Est. Hours:</span>
                      <span className="text-gray-900">{selectedTask.est_hours}</span>
                    </p>
                    <p className="flex items-start">
                      <span className="w-24 text-gray-600 font-medium">Rate:</span>
                      <span className="text-gray-900">${selectedTask.ratePerHour}/hour</span>
                    </p>
                    <p className="flex items-start">
                      <span className="w-24 text-gray-600 font-medium">Total:</span>
                      <span className="text-gray-900 font-semibold">${selectedTask.ratePerHour * selectedTask.est_hours}</span>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Schedule & Helper</h3>
                  <div className="space-y-3">
                    <p className="flex items-start">
                      <span className="w-24 text-gray-600 font-medium">Scheduled:</span>
                      <span className="text-gray-900">{formatDateTime(selectedTask.timeSlot.startTime, selectedTask.prefferedDate)}</span>
                    </p>
                    <p className="flex items-start">
                      <span className="w-24 text-gray-600 font-medium">Helper:</span>
                      <span className="text-gray-900">{selectedTask.assignedNeighbor?.name || 'Not assigned yet'}</span>
                    </p>
                    <p className="flex items-start">
                      <span className="w-24 text-gray-600 font-medium">Created:</span>
                      <span className="text-gray-900">{formatCreatedAt(selectedTask.createdAt)}</span>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Timeline */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Task Timeline</h3>
                <div className="relative">
                  <div className="absolute top-0 left-4 h-full w-0.5 bg-gray-200"></div>
                  <div className="space-y-6">
                    <div className="relative flex items-start">
                      <div className="absolute mt-1 ml-1 h-6 w-6 rounded-full border-2 border-violet-700 bg-white"></div>
                      <div className="ml-12">
                        <p className="text-sm font-medium text-gray-900">Task Created</p>
                        <p className="text-xs text-gray-500">{formatCreatedAt(selectedTask.createdAt)}</p>
                      </div>
                    </div>
                    
                    {selectedTask.assignedNeighbor && (
                      <div className="relative flex items-start">
                        <div className="absolute mt-1 ml-1 h-6 w-6 rounded-full border-2 border-violet-700 bg-white"></div>
                        <div className="ml-12">
                          <p className="text-sm font-medium text-gray-900">Helper Assigned</p>
                          <p className="text-xs text-gray-500">{selectedTask.assignedNeighbor.name}</p>
                        </div>
                      </div>
                    )}
                    
                    {selectedTask.status === 'Scheduled' && (
                      <div className="relative flex items-start">
                        <div className="absolute mt-1 ml-1 h-6 w-6 rounded-full border-2 border-violet-700 bg-white"></div>
                        <div className="ml-12">
                          <p className="text-sm font-medium text-gray-900">Task Scheduled</p>
                          <p className="text-xs text-gray-500">{formatDateTime(selectedTask.timeSlot.startTime, selectedTask.prefferedDate)}</p>
                        </div>
                      </div>
                    )}
                    
                    {selectedTask.status === 'Completed' && (
                      <div className="relative flex items-start">
                        <div className="absolute mt-1 ml-1 h-6 w-6 rounded-full border-2 border-green-500 bg-white"></div>
                        <div className="ml-12">
                          <p className="text-sm font-medium text-gray-900">Task Completed</p>
                          <p className="text-xs text-gray-500">Great job!</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end space-x-3 border-t border-gray-200">
              {!selectedTask.assignedNeighbor && selectedTask.status === 'Pending' && (
                <button
                  className="bg-violet-700 hover:bg-violet-800 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                  onClick={() => handleChangeHelper(selectedTask._id)}
                >
                  Find Helper
                </button>
              )}
              {selectedTask.assignedNeighbor && (
                <button
                  className="bg-violet-700 hover:bg-violet-800 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                  onClick={() => handleChat(selectedTask._id)}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                  Chat with Helper
                </button>
              )}
              <button
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium"
                onClick={() => setSelectedTask(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskListPage;