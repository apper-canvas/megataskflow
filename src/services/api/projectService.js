import projectData from '../mockData/projects.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ProjectService {
  constructor() {
    this.projects = [...projectData];
  }

  async getAll() {
    await delay(200);
    return [...this.projects];
  }

  async getById(id) {
    await delay(150);
    const project = this.projects.find(p => p.id === id);
    return project ? { ...project } : null;
  }

  async create(projectData) {
    await delay(300);
    const project = {
      id: Date.now().toString(),
      name: projectData.name,
      color: projectData.color || '#6366F1',
      icon: projectData.icon || 'Folder',
      taskCount: 0,
      order: this.projects.length
    };
    this.projects.push(project);
    return { ...project };
  }

  async update(id, updates) {
    await delay(250);
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Project not found');
    }
    
    this.projects[index] = { ...this.projects[index], ...updates };
    return { ...this.projects[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Project not found');
    }
    
    const deleted = this.projects.splice(index, 1)[0];
    return { ...deleted };
  }

  async updateTaskCount(id, count) {
    await delay(100);
    const index = this.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      this.projects[index].taskCount = count;
      return { ...this.projects[index] };
    }
    return null;
  }
}

export default new ProjectService();