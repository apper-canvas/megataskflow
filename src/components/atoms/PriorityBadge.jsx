import ApperIcon from '@/components/ApperIcon';

const PriorityBadge = ({ priority, size = 'sm' }) => {
  const priorityConfig = {
    high: {
      label: 'High',
      color: 'text-error',
      bgColor: 'bg-error/10',
      icon: 'AlertCircle'
    },
    medium: {
      label: 'Medium',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      icon: 'Circle'
    },
    low: {
      label: 'Low',
      color: 'text-surface-500',
      bgColor: 'bg-surface-100',
      icon: 'Minus'
    }
  };

  const config = priorityConfig[priority] || priorityConfig.medium;
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5';

  return (
    <div className={`inline-flex items-center space-x-1 rounded-full ${config.bgColor} ${config.color} ${sizeClasses}`}>
      <ApperIcon name={config.icon} size={size === 'sm' ? 10 : 12} />
      <span className="font-medium">{config.label}</span>
    </div>
  );
};

export default PriorityBadge;