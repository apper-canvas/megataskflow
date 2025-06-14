import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';
import { projectService } from '@/services';

const FilterBar = ({ 
  filters, 
  searchQuery, 
  onFilterChange, 
  onSearchChange, 
  onClearFilters,
  taskCount 
}) => {
  const [projects, setProjects] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const result = await projectService.getAll();
      setProjects(result);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const projectOptions = [
    { value: '', label: 'All Projects' },
    ...projects.map(project => ({
      value: project.id,
      label: project.name,
      color: project.color
    }))
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' }
  ];

  const hasActiveFilters = filters.project || filters.priority || filters.status !== 'all' || searchQuery;

  return (
    <div className="bg-white border border-surface-200 rounded-lg p-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 text-surface-700 hover:text-surface-900 transition-colors"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ApperIcon name="ChevronDown" size={16} />
            </motion.div>
            <span className="font-medium text-sm">Filters</span>
          </button>
          
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-2 h-2 bg-primary rounded-full"
            />
          )}
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-sm text-surface-500">
            {taskCount} task{taskCount !== 1 ? 's' : ''}
          </span>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-surface-500 hover:text-surface-700"
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Project Filter */}
          <div>
            <label className="block text-xs font-medium text-surface-600 mb-2">
              Project
            </label>
            <Select
              value={filters.project}
              onChange={(value) => onFilterChange('project', value)}
              options={projectOptions}
              placeholder="All Projects"
            />
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-xs font-medium text-surface-600 mb-2">
              Priority
            </label>
            <Select
              value={filters.priority}
              onChange={(value) => onFilterChange('priority', value)}
              options={priorityOptions}
              placeholder="All Priorities"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-medium text-surface-600 mb-2">
              Status
            </label>
            <Select
              value={filters.status}
              onChange={(value) => onFilterChange('status', value)}
              options={statusOptions}
              placeholder="All Tasks"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FilterBar;