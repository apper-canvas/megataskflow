import { useState, useEffect } from 'react';
import ApperIcon from '@/components/ApperIcon';
import { projectService } from '@/services';

const ProjectBadge = ({ projectId, size = 'sm' }) => {
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      const result = await projectService.getById(projectId);
      setProject(result);
    } catch (error) {
      console.error('Failed to load project:', error);
    }
  };

  if (!project) {
    return null;
  }

  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5';

  return (
    <div 
      className={`inline-flex items-center space-x-1 rounded-full text-white font-medium ${sizeClasses}`}
      style={{ backgroundColor: project.color }}
    >
      <ApperIcon name={project.icon} size={size === 'sm' ? 10 : 12} />
      <span>{project.name}</span>
    </div>
  );
};

export default ProjectBadge;