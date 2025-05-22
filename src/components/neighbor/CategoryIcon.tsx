// Category icon component with a more colorful approach
export const CategoryIcon = ({ category }: { category: string }) => {
    let icon = '📋';
    let bgColor = 'bg-gray-100';
    
    switch (category.toLowerCase()) {
      case 'handyman':
        icon = '🔧';
        bgColor = 'bg-blue-100';
        break;
      case 'cleaning':
        icon = '🧹';
        bgColor = 'bg-green-100';
        break;
      case 'garden':
        icon = '🌱';
        bgColor = 'bg-lime-100';
        break;
      default:
        icon = '📋';
        bgColor = 'bg-violet-100';
    }
    
    return (
      <span className={`${bgColor} flex items-center justify-center rounded-full w-10 h-10 text-xl mr-3`}>
        {icon}
      </span>
    );
  };