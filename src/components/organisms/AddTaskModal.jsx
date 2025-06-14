import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import DatePicker from '@/components/atoms/DatePicker';
import PrioritySelector from '@/components/molecules/PrioritySelector';
import { taskService, projectService } from '@/services';

const AddTaskModal = ({ isOpen, onClose, onTaskAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    projectId: '',
    priority: 'medium',
    dueDate: ''
  });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadProjects();
      setFormData({
        title: '',
        projectId: '',
        priority: 'medium',
        dueDate: ''
      });
    }
  }, [isOpen]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const result = await projectService.getAll();
      setProjects(result);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    setSubmitting(true);
    try {
      await taskService.create({
        ...formData,
        title: formData.title.trim(),
        dueDate: formData.dueDate || null,
        projectId: formData.projectId || null
      });
      
      toast.success('Task created successfully');
      onTaskAdded?.();
      onClose();
    } catch (error) {
      toast.error('Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const projectOptions = projects.map(project => ({
    value: project.id,
    label: project.name,
    color: project.color
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-semibold text-surface-900">
                  Add New Task
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Task Title *
                  </label>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter task title..."
                    className="w-full"
                    autoFocus
                  />
                </div>

                {/* Project */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Project
                  </label>
                  <Select
                    value={formData.projectId}
                    onChange={(value) => handleInputChange('projectId', value)}
                    options={[
                      { value: '', label: 'No project' },
                      ...projectOptions
                    ]}
                    placeholder="Select a project..."
                    disabled={loading}
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Priority
                  </label>
                  <PrioritySelector
                    value={formData.priority}
                    onChange={(priority) => handleInputChange('priority', priority)}
                  />
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Due Date
                  </label>
                  <DatePicker
                    value={formData.dueDate}
                    onChange={(date) => handleInputChange('dueDate', date)}
                    placeholder="Select due date..."
                  />
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    className="flex-1"
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    loading={submitting}
                  >
                    Add Task
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddTaskModal;