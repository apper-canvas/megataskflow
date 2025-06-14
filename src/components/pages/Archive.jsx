import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, startOfDay, isSameDay } from 'date-fns';
import TaskCard from '@/components/molecules/TaskCard';
import EmptyState from '@/components/atoms/EmptyState';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ApperIcon from '@/components/ApperIcon';
import { taskService } from '@/services';

const Archive = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCompletedTasks();
  }, []);

  const loadCompletedTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await taskService.getCompletedTasks();
      setTasks(result);
    } catch (err) {
      setError(err.message || 'Failed to load completed tasks');
      toast.error('Failed to load completed tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskComplete = async (taskId) => {
    try {
      const updatedTask = await taskService.toggleComplete(taskId);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      
      if (!updatedTask.completed) {
        toast.success('Task reopened');
        // Remove from archive view
        setTasks(prev => prev.filter(task => task.id !== taskId));
      }
    } catch (error) {
      throw error;
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (error) {
      throw error;
    }
  };

  const handleTaskUpdate = (task) => {
    toast.info('Edit task functionality coming soon!');
  };

  // Group tasks by completion date
  const groupTasksByCompletionDate = (tasks) => {
    const groups = {};
    
    tasks.forEach(task => {
      if (!task.completedAt) return;
      
      const completionDate = startOfDay(new Date(task.completedAt));
      const dateKey = completionDate.getTime();
      
      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: completionDate,
          tasks: []
        };
      }
      
      groups[dateKey].tasks.push(task);
    });

    // Sort groups by date (most recent first)
    return Object.values(groups).sort((a, b) => b.date - a.date);
  };

  const taskGroups = groupTasksByCompletionDate(tasks);

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-shrink-0 px-6 py-6 border-b border-surface-200 bg-white">
          <SkeletonLoader count={1} height="h-8" className="w-48" />
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <SkeletonLoader count={5} height="h-20" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-shrink-0 px-6 py-6 border-b border-surface-200 bg-white">
          <h1 className="text-2xl font-display font-bold text-surface-900">
            Archive
          </h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 mb-2">Something went wrong</h3>
            <p className="text-surface-500 mb-4">{error}</p>
            <button
              onClick={loadCompletedTasks}
              className="text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="flex-shrink-0 px-6 py-6 border-b border-surface-200 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-display font-bold text-surface-900 mb-2">
            Archive
          </h1>
          <p className="text-surface-600">
            Your completed tasks and achievements
          </p>
          
          {tasks.length > 0 && (
            <div className="flex items-center space-x-2 mt-4 text-sm">
              <ApperIcon name="CheckCircle" size={16} className="text-success" />
              <span className="font-medium text-surface-900">{tasks.length}</span>
              <span className="text-surface-500">completed tasks</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Task Groups */}
      <div className="flex-1 overflow-y-auto p-6">
        {taskGroups.length === 0 ? (
          <EmptyState
            title="No completed tasks yet"
            description="Your finished tasks will appear here. Keep up the great work!"
            icon="Archive"
            actionLabel="View All Tasks"
            onAction={() => window.location.href = '/all-tasks'}
          />
        ) : (
          <div className="space-y-8">
            {taskGroups.map((group, groupIndex) => (
              <motion.div
                key={group.date.getTime()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.1 }}
              >
                {/* Date Header */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="CheckCircle" size={20} className="text-success" />
                    <h2 className="text-lg font-display font-semibold text-surface-900">
                      {format(group.date, 'EEEE, MMMM d')}
                    </h2>
                  </div>
                  <div className="h-px bg-surface-200 flex-1" />
                  <span className="text-sm text-surface-500 bg-success/10 text-success px-2 py-1 rounded-full">
                    {group.tasks.length} completed
                  </span>
                </div>

                {/* Tasks for this date */}
                <div className="space-y-3">
                  {group.tasks.map((task, taskIndex) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (groupIndex * 0.1) + (taskIndex * 0.05) }}
                    >
                      <TaskCard
                        task={task}
                        onComplete={handleTaskComplete}
                        onDelete={handleTaskDelete}
                        onUpdate={handleTaskUpdate}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Archive;