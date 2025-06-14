import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const QuickAddButton = ({ onClick, className = '' }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center space-x-2 px-4 py-2 bg-accent text-white rounded-button shadow-sm hover:brightness-110 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent/50 ${className}`}
    >
      <ApperIcon name="Plus" size={16} />
      <span className="font-medium text-sm hidden sm:inline">Add Task</span>
    </motion.button>
  );
};

export default QuickAddButton;