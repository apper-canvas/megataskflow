import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from '@/components/molecules/TaskCard';
import FilterBar from '@/components/molecules/FilterBar';
import EmptyState from '@/components/atoms/EmptyState';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';

const TaskList = ({ 
  tasks, 
  loading, 
  error, 
  onTaskUpdate, 
  onTaskDelete, 
  onTaskComplete,
  showFilters = true,
  emptyStateConfig = {}
}) => {
  const [filters, setFilters] = useState({
    project: '',
    priority: '',
    status: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tasks based on current filters and search
  const filteredTasks = tasks.filter(task => {
    // Search filter
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Project filter
    if (filters.project && task.projectId !== filters.project) {
      return false;
    }

    // Priority filter
    if (filters.priority && task.priority !== filters.priority) {
      return false;
    }

    // Status filter
    if (filters.status === 'completed' && !task.completed) {
      return false;
    }
    if (filters.status === 'pending' && task.completed) {
      return false;
    }

    return true;
  });

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setFilters({ project: '', priority: '', status: 'all' });
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <SkeletonLoader count={5} height="h-20" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-surface-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-surface-900 mb-2">Something went wrong</h3>
        <p className="text-surface-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      {showFilters && (
        <FilterBar
          filters={filters}
          searchQuery={searchQuery}
          onFilterChange={handleFilterChange}
          onSearchChange={setSearchQuery}
          onClearFilters={clearFilters}
          taskCount={filteredTasks.length}
        />
      )}

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          title={emptyStateConfig.title || "No tasks found"}
          description={emptyStateConfig.description || "Try adjusting your filters or create a new task"}
          actionLabel={emptyStateConfig.actionLabel || "Add Task"}
          onAction={emptyStateConfig.onAction}
          className="py-12"
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ 
                  delay: index * 0.05,
                  duration: 0.2 
                }}
                layout
              >
                <TaskCard
                  task={task}
                  onUpdate={onTaskUpdate}
                  onDelete={onTaskDelete}
                  onComplete={onTaskComplete}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default TaskList;