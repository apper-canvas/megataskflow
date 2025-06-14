import { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ProjectItem = ({ project, onDelete }) => {
  const [showActions, setShowActions] = useState(false);

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(project.id);
  };

  return (
    <motion.div
      whileHover={{ x: 2 }}
      onHoverStart={() => setShowActions(true)}
      onHoverEnd={() => setShowActions(false)}
      className="relative"
    >
      <NavLink
        to={`/project/${project.id}`}
        className={({ isActive }) =>
          `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-150 ${
            isActive
              ? 'bg-surface-100 text-surface-900'
              : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
          }`
        }
      >
        {/* Project Color Dot */}
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: project.color }}
        />
        
        {/* Project Icon */}
        <ApperIcon name={project.icon} size={16} className="flex-shrink-0" />
        
        {/* Project Name */}
        <span className="text-sm font-medium flex-1 min-w-0 truncate">
          {project.name}
        </span>
        
        {/* Task Count */}
        {project.taskCount > 0 && (
          <span className="text-xs text-surface-400 bg-surface-100 rounded-full px-2 py-0.5 flex-shrink-0">
            {project.taskCount}
          </span>
        )}
      </NavLink>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: showActions ? 1 : 0, x: showActions ? 0 : 10 }}
        className="absolute right-2 top-1/2 -translate-y-1/2"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="p-1 text-surface-400 hover:text-error"
        >
          <ApperIcon name="Trash2" size={12} />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ProjectItem;