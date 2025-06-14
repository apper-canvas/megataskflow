import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const PrioritySelector = ({ value, onChange }) => {
  const priorities = [
    { 
      value: 'high', 
      label: 'High', 
      color: 'bg-error text-error', 
      bgColor: 'bg-error/10',
      icon: 'AlertCircle'
    },
    { 
      value: 'medium', 
      label: 'Medium', 
      color: 'bg-warning text-warning', 
      bgColor: 'bg-warning/10',
      icon: 'Circle'
    },
    { 
      value: 'low', 
      label: 'Low', 
      color: 'bg-surface-400 text-surface-400', 
      bgColor: 'bg-surface-100',
      icon: 'Minus'
    }
  ];

  return (
    <div className="flex space-x-2">
      {priorities.map(priority => (
        <motion.button
          key={priority.value}
          type="button"
          onClick={() => onChange(priority.value)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all ${
            value === priority.value
              ? `${priority.bgColor} border-current ${priority.color.split(' ')[1]}`
              : 'border-surface-200 hover:border-surface-300 text-surface-600'
          }`}
        >
          <ApperIcon name={priority.icon} size={14} />
          <span className="text-sm font-medium">{priority.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default PrioritySelector;