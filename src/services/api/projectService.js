import { toast } from 'react-toastify';

class ProjectService {
  constructor() {
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'color', 'icon', 'task_count', 'order']
      };

      const response = await this.apperClient.fetchRecords('project', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Map database fields to expected UI format
      return (response.data || []).map(project => ({
        id: project.Id,
        name: project.Name,
        color: project.color || '#6366F1',
        icon: project.icon || 'Folder',
        taskCount: project.task_count || 0,
        order: project.order || 0
      }));
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'color', 'icon', 'task_count', 'order']
      };

      const response = await this.apperClient.getRecordById('project', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (!response.data) {
        return null;
      }

      // Map database fields to expected UI format
      const project = response.data;
      return {
        id: project.Id,
        name: project.Name,
        color: project.color || '#6366F1',
        icon: project.icon || 'Folder',
        taskCount: project.task_count || 0,
        order: project.order || 0
      };
    } catch (error) {
      console.error(`Error fetching project with ID ${id}:`, error);
      return null;
    }
  }

  async create(projectData) {
    try {
      const params = {
        records: [{
          Name: projectData.name,
          color: projectData.color || '#6366F1',
          icon: projectData.icon || 'Folder',
          task_count: 0,
          order: 0
        }]
      };

      const response = await this.apperClient.createRecord('project', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const project = successfulRecords[0].data;
          return {
            id: project.Id,
            name: project.Name,
            color: project.color || '#6366F1',
            icon: project.icon || 'Folder',
            taskCount: project.task_count || 0,
            order: project.order || 0
          };
        }
      }
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      const updateData = {};
      if (updates.name !== undefined) updateData.Name = updates.name;
      if (updates.color !== undefined) updateData.color = updates.color;
      if (updates.icon !== undefined) updateData.icon = updates.icon;
      if (updates.taskCount !== undefined) updateData.task_count = updates.taskCount;
      if (updates.order !== undefined) updateData.order = updates.order;

      const params = {
        records: [{
          Id: parseInt(id),
          ...updateData
        }]
      };

      const response = await this.apperClient.updateRecord('project', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const project = successfulUpdates[0].data;
          return {
            id: project.Id,
            name: project.Name,
            color: project.color || '#6366F1',
            icon: project.icon || 'Folder',
            taskCount: project.task_count || 0,
            order: project.order || 0
          };
        }
      }
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord('project', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  async updateTaskCount(id, count) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          task_count: count
        }]
      };

      const response = await this.apperClient.updateRecord('project', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results && response.results.length > 0 && response.results[0].success) {
        const project = response.results[0].data;
        return {
          id: project.Id,
          name: project.Name,
          color: project.color || '#6366F1',
          icon: project.icon || 'Folder',
          taskCount: project.task_count || 0,
          order: project.order || 0
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error updating task count:', error);
      return null;
    }
  }
}

export default new ProjectService();