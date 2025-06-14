import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, isToday, isPast } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Checkbox from '@/components/atoms/Checkbox';
import PriorityBadge from '@/components/atoms/PriorityBadge';
import ProjectBadge from '@/components/atoms/ProjectBadge';
import Button from '@/components/atoms/Button';

const TaskCard = ({ task, onUpdate, onDelete, onComplete }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await onComplete(task.id);
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(task.id);
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const formatDueDate = (date) => {
    if (!date) return null;
    const taskDate = new Date(date);
    
    if (isToday(taskDate)) {
      return { text: 'Today', isOverdue: false, isToday: true };
    }
    
    if (isPast(taskDate) && !task.completed) {
      return { text: format(taskDate, 'MMM d'), isOverdue: true, isToday: false };
    }
    
    return { text: format(taskDate, 'MMM d'), isOverdue: false, isToday: false };
  };

  const dueDateInfo = formatDueDate(task.dueDate);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`bg-white border border-surface-200 rounded-task p-4 shadow-card hover:shadow-card-hover transition-all duration-150 ${
        task.completed ? 'opacity-60' : ''
      }`}
      onHoverStart={() => setShowActions(true)}
      onHoverEnd={() => setShowActions(false)}
    >
      <div className="flex items-start space-x-3">
        {/* Checkbox */}
        <div className="flex-shrink-0 mt-0.5">
          <Checkbox
            checked={task.completed}
            onChange={handleComplete}
            loading={isCompleting}
          />
        </div>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {/* Title */}
              <h3 className={`font-medium text-surface-900 break-words ${
                task.completed ? 'line-through text-surface-500' : ''
              }`}>
                {task.title}
              </h3>

              {/* Metadata */}
              <div className="flex items-center space-x-2 mt-2">
                {/* Project Badge */}
                {task.projectId && (
                  <ProjectBadge projectId={task.projectId} />
                )}

                {/* Priority Badge */}
                <PriorityBadge priority={task.priority} />

                {/* Due Date */}
                {dueDateInfo && (
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    dueDateInfo.isOverdue 
                      ? 'bg-error/10 text-error' 
                      : dueDateInfo.isToday 
                      ? 'bg-warning/10 text-warning'
                      : 'bg-surface-100 text-surface-600'
                  }`}>
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Calendar" size={12} />
                      <span>{dueDateInfo.text}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: showActions ? 1 : 0, x: showActions ? 0 : 10 }}
              className="flex items-center space-x-1"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUpdate?.(task)}
                className="p-1.5"
              >
                <ApperIcon name="Edit2" size={14} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="p-1.5 text-surface-400 hover:text-error"
              >
                <ApperIcon name="Trash2" size={14} />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;