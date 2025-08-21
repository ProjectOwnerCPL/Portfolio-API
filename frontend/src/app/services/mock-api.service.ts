import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';

export interface Company {
  id: number;
  name: string;
  founded: string;
  industry: string;
  location: string;
  employees: number;
  website: string;
  description: string;
  mission: string;
  values: string[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  status: string;
  startDate: string;
  endDate: string | null;
  budget: number;
  client: string;
}

export interface Portfolio {
  id: number;
  name: string;
  description: string;
  type: string;
  url: string;
  technologies: string[];
  imageUrl: string;
  featured: boolean;
}

export interface Stats {
  totalProjects: number;
  completedProjects: number;
  activeClients: number;
  satisfactionRate: number;
}

export interface ApiData {
  company: Company;
  projects: Project[];
  portfolio: Portfolio[];
  stats: Stats;
}

@Injectable({
  providedIn: 'root'
})
export class MockApiService {
  private data: ApiData | null = null;

  constructor(private http: HttpClient) {}

  private async loadData(): Promise<ApiData> {
    if (!this.data) {
      this.data = await this.http.get<ApiData>('/assets/data/portfolio-data.json').toPromise() as ApiData;
    }
    return this.data;
  }

  // Simule GET /api/portfolio
  async getPortfolio(): Promise<Portfolio[]> {
    const data = await this.loadData();
    // Simule un délai réseau
    return new Promise(resolve => {
      setTimeout(() => resolve(data.portfolio), 300);
    });
  }

  // Simule GET /api/company
  async getCompany(): Promise<Company> {
    const data = await this.loadData();
    return new Promise(resolve => {
      setTimeout(() => resolve(data.company), 200);
    });
  }

  // Simule GET /api/projects
  async getProjects(): Promise<Project[]> {
    const data = await this.loadData();
    return new Promise(resolve => {
      setTimeout(() => resolve(data.projects), 250);
    });
  }

  // Simule GET /api/stats
  async getStats(): Promise<Stats> {
    const data = await this.loadData();
    return new Promise(resolve => {
      setTimeout(() => resolve(data.stats), 100);
    });
  }

  // Simule POST /api/portfolio
  async createPortfolio(portfolio: Omit<Portfolio, 'id'>): Promise<Portfolio> {
    const data = await this.loadData();
    const newPortfolio = {
      ...portfolio,
      id: Math.max(...data.portfolio.map(p => p.id)) + 1
    };
    
    // Simule la sauvegarde (en réalité, on ne peut pas sauvegarder dans un fichier JSON statique)
    console.log('Simulated POST /api/portfolio:', newPortfolio);
    
    return new Promise(resolve => {
      setTimeout(() => resolve(newPortfolio), 400);
    });
  }

  // Simule POST /api/projects
  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    const data = await this.loadData();
    const newProject = {
      ...project,
      id: Math.max(...data.projects.map(p => p.id)) + 1
    };
    
    console.log('Simulated POST /api/projects:', newProject);
    
    return new Promise(resolve => {
      setTimeout(() => resolve(newProject), 500);
    });
  }

  // Simule POST /api/company
  async updateCompany(company: Company): Promise<Company> {
    console.log('Simulated POST /api/company:', company);
    
    return new Promise(resolve => {
      setTimeout(() => resolve(company), 300);
    });
  }

  // Pour votre interface de test
  async testEndpoint(endpoint: string, method: string = 'GET', data?: any): Promise<any> {
    switch (`${method} ${endpoint}`) {
      case 'GET /api/portfolio':
        return this.getPortfolio();
      case 'GET /api/company':
        return this.getCompany();
      case 'GET /api/projects':
        return this.getProjects();
      case 'GET /api/stats':
        return this.getStats();
      case 'POST /api/portfolio':
        return this.createPortfolio(data);
      case 'POST /api/projects':
        return this.createProject(data);
      case 'POST /api/company':
        return this.updateCompany(data);
      default:
        throw new Error(`Endpoint ${method} ${endpoint} not implemented`);
    }
  }
}
