import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, isToday, isPast } from 'date-fns';
import TaskList from '@/components/organisms/TaskList';
import ProgressRing from '@/components/atoms/ProgressRing';
import ApperIcon from '@/components/ApperIcon';
import { taskService } from '@/services';

const Today = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTodayTasks();
  }, []);

  const loadTodayTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await taskService.getTodayTasks();
      setTasks(result);
    } catch (err) {
      setError(err.message || 'Failed to load today\'s tasks');
      toast.error('Failed to load today\'s tasks');
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
      
      if (updatedTask.completed) {
        toast.success('Great job! Task completed! 🎉');
      } else {
        toast.success('Task reopened');
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

  // Separate overdue and today tasks
  const todayTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    return isToday(new Date(task.dueDate));
  });

  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    return isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));
  });

  const completedToday = todayTasks.filter(task => task.completed).length;
  const progress = todayTasks.length > 0 ? Math.round((completedToday / todayTasks.length) * 100) : 0;

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="flex-shrink-0 px-6 py-6 border-b border-surface-200 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-surface-900 mb-2">
                Today
              </h1>
              <p className="text-surface-600">
                {format(new Date(), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>

            {/* Progress Ring */}
            {!loading && todayTasks.length > 0 && (
              <div className="flex items-center space-x-4">
                <ProgressRing progress={progress} size={60} strokeWidth={4} />
                <div>
                  <div className="text-lg font-semibold text-surface-900">
                    {completedToday}/{todayTasks.length}
                  </div>
                  <div className="text-sm text-surface-500">Tasks done</div>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          {!loading && (
            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center space-x-2 text-sm">
                <ApperIcon name="Calendar" size={16} className="text-primary" />
                <span className="font-medium text-surface-900">{todayTasks.length}</span>
                <span className="text-surface-500">due today</span>
              </div>
              
              {overdueTasks.length > 0 && (
                <div className="flex items-center space-x-2 text-sm">
                  <ApperIcon name="AlertCircle" size={16} className="text-error" />
                  <span className="font-medium text-error">{overdueTasks.length}</span>
                  <span className="text-surface-500">overdue</span>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Task Lists */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Overdue Tasks */}
        {overdueTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <ApperIcon name="AlertCircle" size={20} className="text-error" />
              <h2 className="text-lg font-display font-semibold text-error">
                Overdue ({overdueTasks.length})
              </h2>
            </div>
            <TaskList
              tasks={overdueTasks}
              loading={false}
              error={null}
              onTaskComplete={handleTaskComplete}
              onTaskDelete={handleTaskDelete}
              onTaskUpdate={handleTaskUpdate}
              showFilters={false}
            />
          </motion.div>
        )}

        {/* Today's Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: overdueTasks.length > 0 ? 0.2 : 0.1 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <ApperIcon name="Calendar" size={20} className="text-primary" />
            <h2 className="text-lg font-display font-semibold text-surface-900">
              Today ({todayTasks.length})
            </h2>
          </div>
          <TaskList
            tasks={todayTasks}
            loading={loading}
            error={error}
            onTaskComplete={handleTaskComplete}
            onTaskDelete={handleTaskDelete}
            onTaskUpdate={handleTaskUpdate}
            showFilters={false}
            emptyStateConfig={{
              title: "No tasks due today",
              description: "You're all caught up! Enjoy your productive day.",
              icon: "CheckCircle"
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Today;