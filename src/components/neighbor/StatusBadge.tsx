import { TaskStatus } from "../../types/newTaskDetails";

export const StatusBadge = ({ status }: { status: TaskStatus }) => {
    let bgColor = '';
    let textColor = '';
    let icon = '';
    
    switch (status) {
      case "completed":
        bgColor = 'bg-emerald-100';
        textColor = 'text-emerald-700';
        icon = '✓';
        break;
      case "assigned":
        bgColor = 'bg-sky-100';
        textColor = 'text-sky-700';
        icon = '👤';
        break;
      case "in_progress":
        bgColor = 'bg-violet-100';
        textColor = 'text-violet-700';
        icon = '⚙️';
        break;
      case "cancelled":
        bgColor = 'bg-rose-100';
        textColor = 'text-rose-700';
        icon = '✕';
        break;
      case "pending":
      default:
        bgColor = 'bg-amber-100';
        textColor = 'text-amber-700';
        icon = '⏳';
        break;
    }
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        <span className="mr-1">{icon}</span>
        {status?.charAt(0).toUpperCase() + status?.slice(1) || "Pending"}
      </span>
    );
  };