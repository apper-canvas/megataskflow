import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from './Button';

const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  icon = 'Package',
  className = ''
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`text-center py-12 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="mb-6"
      >
        <ApperIcon 
          name={icon} 
          size={48} 
          className="text-surface-300 mx-auto" 
        />
      </motion.div>
      
      <h3 className="text-lg font-display font-semibold text-surface-900 mb-2">
        {title}
      </h3>
      
      <p className="text-surface-500 mb-6 max-w-sm mx-auto">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          className="mt-4"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;