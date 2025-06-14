import { toast } from 'react-toastify';

class TaskService {
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

  mapTaskFromDatabase(task) {
    return {
      id: task.Id,
      title: task.title || task.Name,
      projectId: task.project_id,
      priority: task.priority || 'medium',
      dueDate: task.due_date,
      completed: task.completed || false,
      completedAt: task.completed_at,
      createdAt: task.created_at,
      order: task.order || 0
    };
  }

  async getAll() {
    try {
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'project_id', 'priority', 'due_date', 'completed', 'completed_at', 'created_at', 'order']
      };

      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return (response.data || []).map(task => this.mapTaskFromDatabase(task));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'project_id', 'priority', 'due_date', 'completed', 'completed_at', 'created_at', 'order']
      };

      const response = await this.apperClient.getRecordById('task', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (!response.data) {
        return null;
      }

      return this.mapTaskFromDatabase(response.data);
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      return null;
    }
  }

  async getByProject(projectId) {
    try {
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'project_id', 'priority', 'due_date', 'completed', 'completed_at', 'created_at', 'order'],
        where: [{
          FieldName: 'project_id',
          Operator: 'ExactMatch',
          Values: [projectId]
        }]
      };

      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return (response.data || []).map(task => this.mapTaskFromDatabase(task));
    } catch (error) {
      console.error('Error fetching tasks by project:', error);
      throw error;
    }
  }

  async getTodayTasks() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'project_id', 'priority', 'due_date', 'completed', 'completed_at', 'created_at', 'order'],
        where: [{
          FieldName: 'due_date',
          Operator: 'LessThanOrEqualTo',
          Values: [today]
        }]
      };

      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const tasks = (response.data || []).map(task => this.mapTaskFromDatabase(task));
      
      // Filter to include today's tasks and overdue incomplete tasks
      return tasks.filter(t => {
        if (!t.dueDate) return false;
        const dueDate = new Date(t.dueDate).toISOString().split('T')[0];
        return dueDate === today || (dueDate < today && !t.completed);
      });
    } catch (error) {
      console.error('Error fetching today tasks:', error);
      throw error;
    }
  }

  async getUpcomingTasks() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'project_id', 'priority', 'due_date', 'completed', 'completed_at', 'created_at', 'order'],
        where: [{
          FieldName: 'due_date',
          Operator: 'GreaterThan',
          Values: [today]
        }, {
          FieldName: 'completed',
          Operator: 'ExactMatch',
          Values: [false]
        }]
      };

      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return (response.data || []).map(task => this.mapTaskFromDatabase(task));
    } catch (error) {
      console.error('Error fetching upcoming tasks:', error);
      throw error;
    }
  }

  async getCompletedTasks() {
    try {
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'project_id', 'priority', 'due_date', 'completed', 'completed_at', 'created_at', 'order'],
        where: [{
          FieldName: 'completed',
          Operator: 'ExactMatch',
          Values: [true]
        }]
      };

      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return (response.data || []).map(task => this.mapTaskFromDatabase(task));
    } catch (error) {
      console.error('Error fetching completed tasks:', error);
      throw error;
    }
  }

  async create(taskData) {
    try {
      const params = {
        records: [{
          title: taskData.title,
          project_id: taskData.projectId ? parseInt(taskData.projectId) : null,
          priority: taskData.priority || 'medium',
          due_date: taskData.dueDate || null,
          completed: false,
          created_at: new Date().toISOString(),
          order: 0
        }]
      };

      const response = await this.apperClient.createRecord('task', params);
      
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
          return this.mapTaskFromDatabase(successfulRecords[0].data);
        }
      }
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      const updateData = { Id: parseInt(id) };
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.projectId !== undefined) updateData.project_id = updates.projectId ? parseInt(updates.projectId) : null;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
      if (updates.completed !== undefined) updateData.completed = updates.completed;
      if (updates.completedAt !== undefined) updateData.completed_at = updates.completedAt;
      if (updates.order !== undefined) updateData.order = updates.order;

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord('task', params);
      
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
          return this.mapTaskFromDatabase(successfulUpdates[0].data);
        }
      }
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async toggleComplete(id) {
    try {
      // First get the current task
      const currentTask = await this.getById(id);
      if (!currentTask) {
        throw new Error('Task not found');
      }

      const updates = {
        completed: !currentTask.completed
      };

      if (updates.completed) {
        updates.completedAt = new Date().toISOString();
      } else {
        updates.completedAt = null;
      }

      return await this.update(id, updates);
    } catch (error) {
      console.error('Error toggling task completion:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord('task', params);
      
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
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  async reorder(taskId, newOrder) {
    try {
      return await this.update(taskId, { order: newOrder });
    } catch (error) {
      console.error('Error reordering task:', error);
      throw error;
    }
  }

  async search(query) {
    try {
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'project_id', 'priority', 'due_date', 'completed', 'completed_at', 'created_at', 'order'],
        where: [{
          FieldName: 'title',
          Operator: 'Contains',
          Values: [query]
        }]
      };

      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return (response.data || []).map(task => this.mapTaskFromDatabase(task));
    } catch (error) {
      console.error('Error searching tasks:', error);
      throw error;
    }
  }

  async getTaskStats() {
    try {
      const allTasks = await this.getAll();
      const total = allTasks.length;
      const completed = allTasks.filter(t => t.completed).length;
      const today = new Date().toISOString().split('T')[0];
      const todayTasks = allTasks.filter(t => {
        if (!t.dueDate) return false;
        const dueDate = new Date(t.dueDate).toISOString().split('T')[0];
        return dueDate === today;
      });
      const todayCompleted = todayTasks.filter(t => t.completed).length;
      
      return {
        total,
        completed,
        pending: total - completed,
        todayTotal: todayTasks.length,
        todayCompleted,
        todayProgress: todayTasks.length > 0 ? Math.round((todayCompleted / todayTasks.length) * 100) : 0
      };
    } catch (error) {
      console.error('Error getting task stats:', error);
      return {
        total: 0,
        completed: 0,
        pending: 0,
        todayTotal: 0,
        todayCompleted: 0,
        todayProgress: 0
      };
    }
  }
}

export default new TaskService();