import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';

const AddProjectForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '#6366F1',
    icon: 'Folder'
  });
  const [loading, setLoading] = useState(false);

  const colorOptions = [
    '#6366F1', '#8B5CF6', '#EC4899', '#10B981', 
    '#F59E0B', '#EF4444', '#3B82F6', '#06B6D4'
  ];

  const iconOptions = [
    'Folder', 'Briefcase', 'User', 'BookOpen', 
    'Heart', 'Home', 'Car', 'ShoppingCart'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        name: formData.name.trim()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-surface-50 border border-surface-200 rounded-lg p-4 space-y-4"
    >
      {/* Project Name */}
      <div>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Project name..."
          className="w-full"
          autoFocus
        />
      </div>

      {/* Color Selection */}
      <div>
        <label className="block text-xs font-medium text-surface-600 mb-2">
          Color
        </label>
        <div className="flex space-x-2">
          {colorOptions.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, color }))}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                formData.color === color ? 'border-surface-400 scale-110' : 'border-surface-200'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Icon Selection */}
      <div>
        <label className="block text-xs font-medium text-surface-600 mb-2">
          Icon
        </label>
        <div className="grid grid-cols-4 gap-2">
          {iconOptions.map(icon => (
            <button
              key={icon}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, icon }))}
              className={`p-2 rounded-lg border transition-all ${
                formData.icon === icon 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-surface-200 hover:border-surface-300'
              }`}
            >
              <ApperIcon name={icon} size={16} />
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          loading={loading}
          disabled={!formData.name.trim()}
          className="flex-1"
        >
          Add Project
        </Button>
      </div>
    </motion.form>
  );
};

export default AddProjectForm;