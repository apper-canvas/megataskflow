import taskData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.tasks = [...taskData];
  }

  async getAll() {
    await delay(200);
    return [...this.tasks];
  }

  async getById(id) {
    await delay(150);
    const task = this.tasks.find(t => t.id === id);
    return task ? { ...task } : null;
  }

  async getByProject(projectId) {
    await delay(200);
    return this.tasks.filter(t => t.projectId === projectId).map(t => ({ ...t }));
  }

  async getTodayTasks() {
    await delay(200);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    return this.tasks.filter(t => {
      if (!t.dueDate) return false;
      const dueDate = new Date(t.dueDate).toISOString().split('T')[0];
      return dueDate === today || (dueDate < today && !t.completed);
    }).map(t => ({ ...t }));
  }

  async getUpcomingTasks() {
    await delay(200);
    const today = new Date().toISOString().split('T')[0];
    
    return this.tasks.filter(t => {
      if (!t.dueDate || t.completed) return false;
      const dueDate = new Date(t.dueDate).toISOString().split('T')[0];
      return dueDate > today;
    }).map(t => ({ ...t }));
  }

  async getCompletedTasks() {
    await delay(250);
    return this.tasks.filter(t => t.completed).map(t => ({ ...t }));
  }

  async create(taskData) {
    await delay(300);
    const task = {
      id: Date.now().toString(),
      title: taskData.title,
      projectId: taskData.projectId || null,
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      completed: false,
      createdAt: new Date().toISOString(),
      order: this.tasks.length
    };
    this.tasks.push(task);
    return { ...task };
  }

  async update(id, updates) {
    await delay(250);
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    this.tasks[index] = { ...this.tasks[index], ...updates };
    return { ...this.tasks[index] };
  }

  async toggleComplete(id) {
    await delay(200);
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    this.tasks[index].completed = !this.tasks[index].completed;
    if (this.tasks[index].completed) {
      this.tasks[index].completedAt = new Date().toISOString();
    } else {
      delete this.tasks[index].completedAt;
    }
    
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const deleted = this.tasks.splice(index, 1)[0];
    return { ...deleted };
  }

  async reorder(taskId, newOrder) {
    await delay(150);
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    
    task.order = newOrder;
    return { ...task };
  }

  async search(query) {
    await delay(200);
    const lowercaseQuery = query.toLowerCase();
    return this.tasks.filter(t => 
      t.title.toLowerCase().includes(lowercaseQuery)
    ).map(t => ({ ...t }));
  }

  async getTaskStats() {
    await delay(150);
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = this.tasks.filter(t => {
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
  }
}

export default new TaskService();