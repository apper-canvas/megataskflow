import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import ProjectItem from '@/components/molecules/ProjectItem';
import AddProjectForm from '@/components/molecules/AddProjectForm';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import EmptyState from '@/components/atoms/EmptyState';
import { projectService } from '@/services';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await projectService.getAll();
      setProjects(result);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async (projectData) => {
    try {
      const newProject = await projectService.create(projectData);
      setProjects(prev => [...prev, newProject]);
      setShowAddForm(false);
      toast.success('Project created successfully');
    } catch (err) {
      toast.error('Failed to create project');
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await projectService.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      toast.success('Project deleted');
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <SkeletonLoader count={3} height="h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-surface-500 text-sm mb-2">{error}</p>
        <button
          onClick={loadProjects}
          className="text-primary text-sm hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Projects Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-surface-700 hover:text-surface-900 transition-colors"
        >
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ApperIcon name="ChevronRight" size={16} />
          </motion.div>
          <span className="font-medium text-sm">Projects</span>
        </button>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="p-1 hover:bg-surface-100 rounded-md transition-colors"
        >
          <ApperIcon name="Plus" size={14} className="text-surface-500" />
        </button>
      </div>

      {/* Projects List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {projects.length === 0 ? (
              <EmptyState
                title="No projects yet"
                description="Create your first project to organize tasks"
                actionLabel="Add Project"
                onAction={() => setShowAddForm(true)}
                className="py-8"
              />
            ) : (
              <div className="space-y-1">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProjectItem
                      project={project}
                      onDelete={handleDeleteProject}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Project Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <AddProjectForm
              onSubmit={handleAddProject}
              onCancel={() => setShowAddForm(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectList;