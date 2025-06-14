import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import SearchBar from '@/components/molecules/SearchBar';
import QuickAddButton from '@/components/atoms/QuickAddButton';
import ProgressRing from '@/components/atoms/ProgressRing';
import AddTaskModal from '@/components/organisms/AddTaskModal';
import { taskService } from '@/services';

const Header = ({ onMobileMenuToggle }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [stats, setStats] = useState({ todayProgress: 0, todayCompleted: 0, todayTotal: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const taskStats = await taskService.getTaskStats();
        setStats(taskStats);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const handleTaskAdded = async () => {
    // Refresh stats after adding a task
    try {
      const taskStats = await taskService.getTaskStats();
      setStats(taskStats);
    } catch (error) {
      console.error('Failed to refresh stats:', error);
    }
  };

  return (
    <>
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 px-4 lg:px-6 flex items-center justify-between z-40">
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 hover:bg-surface-100 rounded-lg transition-colors"
          >
            <ApperIcon name="Menu" size={20} />
          </button>

          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" size={16} className="text-white" />
            </div>
            <h1 className="text-xl font-display font-bold text-surface-900 hidden sm:block">
              TaskFlow
            </h1>
          </div>
        </div>

        {/* Center - Search Bar */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <SearchBar />
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Progress Ring */}
          {!loading && (
            <div className="hidden sm:flex items-center space-x-3">
              <ProgressRing 
                progress={stats.todayProgress} 
                size={32}
                strokeWidth={3}
              />
              <div className="text-sm">
                <div className="font-medium text-surface-900">
                  {stats.todayCompleted}/{stats.todayTotal}
                </div>
                <div className="text-surface-500 text-xs">Today</div>
              </div>
            </div>
          )}

          {/* Quick Add Button */}
          <QuickAddButton onClick={() => setShowAddModal(true)} />
        </div>
      </header>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 py-3 bg-white border-b border-surface-200">
        <SearchBar />
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onTaskAdded={handleTaskAdded}
      />
    </>
  );
};

export default Header;