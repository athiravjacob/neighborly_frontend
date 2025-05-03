import { useEffect, useState } from "react";
import { getAllTasks } from "../../../api/adminApiRequests";
import { newTaskDetails } from "../../../types/newTaskDetails";

const TaskList = () => {
  const [activeSection, setActiveSection] = useState('pending');
  const [tasks, setTask] = useState<newTaskDetails[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const data = await getAllTasks();
      setTask(data);
    };
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(task => {
    if (activeSection === 'all') return true;
    return task.task_status!.toLowerCase() === activeSection;
  });

  return (
    <div className="status-tabs-container bg-gray-900 min-h-screen p-6 text-amber-50">
      {/* Tab buttons */}
      <div className="tabs-header flex justify-center space-x-4 mb-8">
        {['pending', 'assigned', 'in-progress', 'completed'].map((tab) => (
          <button
            key={tab}
            className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
              activeSection === tab
                ? 'bg-amber-500 text-gray-900'
                : 'bg-gray-800 text-amber-50 hover:bg-gray-700'
            }`}
            onClick={() => setActiveSection(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="tab-content">
        {filteredTasks.length === 0 ? (
          <p className="text-center text-amber-200 text-lg">
            No {activeSection} tasks found
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className="bg-gray-800 rounded-lg p-6 border border-amber-500/30 hover:border-amber-500 transition-colors duration-200"
              >
                <h3 className="text-xl font-semibold text-amber-400 mb-2">
                  {task.category} - {task.subCategory}
                </h3>
                <div className="space-y-2 text-amber-50/90">
                  <p>
                    <span className="font-medium">Created By:</span>{' '}
                    {task.createdBy?.name || 'N/A'}
                  </p>
                  <p>
                    <span className="font-medium">Description:</span>{' '}
                    {task.description || 'No description'}
                  </p>
                  <p>
                    <span className="font-medium">Preferred Date:</span>{' '}
                    {typeof task.prefferedDate === 'string'
                      ? task.prefferedDate
                      : task.prefferedDate?.toLocaleDateString() || 'N/A'}
                  </p>
                  <p>
                    <span className="font-medium">Assigned To:</span>{' '}
                    {task.assignedNeighbor?.name || 'Not assigned'}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{' '}
                    {task.task_status}
                  </p>
                  <p>
                    <span className="font-medium">Rate:</span>{' '}
                    ${task.ratePerHour}/hr
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;