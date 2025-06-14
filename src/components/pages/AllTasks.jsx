import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import TaskList from '@/components/organisms/TaskList';
import { taskService } from '@/services';

const AllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await taskService.getAll();
      setTasks(result);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks');
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
        toast.success('Task completed! 🎉');
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
    // TODO: Implement edit task modal
    toast.info('Edit task functionality coming soon!');
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="flex-shrink-0 px-6 py-6 border-b border-surface-200 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-display font-bold text-surface-900 mb-2">
            All Tasks
          </h1>
          <p className="text-surface-600">
            Manage all your tasks in one place
          </p>
          
          {!loading && (
            <div className="flex items-center space-x-6 mt-4">
              <div className="text-sm">
                <span className="font-medium text-surface-900">{totalCount}</span>
                <span className="text-surface-500 ml-1">total tasks</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-success">{completedCount}</span>
                <span className="text-surface-500 ml-1">completed</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-primary">{totalCount - completedCount}</span>
                <span className="text-surface-500 ml-1">pending</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-6">
        <TaskList
          tasks={tasks}
          loading={loading}
          error={error}
          onTaskComplete={handleTaskComplete}
          onTaskDelete={handleTaskDelete}
          onTaskUpdate={handleTaskUpdate}
          emptyStateConfig={{
            title: "No tasks yet",
            description: "Get started by creating your first task to stay organized",
            actionLabel: "Add Task",
            onAction: () => toast.info('Use the Add Task button in the header!')
          }}
        />
      </div>
    </div>
  );
};

export default AllTasks;