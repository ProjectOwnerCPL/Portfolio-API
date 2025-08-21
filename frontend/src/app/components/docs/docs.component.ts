import { Component, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MockApiService } from '../../services/mock-api.service';

@Component({
  selector: 'app-docs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css']
})
export class DocsComponent implements OnInit {
  protected readonly apiEndpoints = signal<any[]>([]);
  protected readonly stats = signal<any>({});
  protected readonly loading = signal(false);
  protected readonly testResults = signal<any>(null);
  protected readonly showResults = signal(false);
  protected readonly currentMode = signal<'GET' | 'POST'>('GET');
  protected readonly selectedPostEndpoint = signal<any>(null);
  protected readonly postJsonData = signal<string>('');
  private readonly apiUrl = '/api'; // Garde pour compatibilité

  constructor(private http: HttpClient, private mockApi: MockApiService) {}

  ngOnInit() {
    this.loadStats();
    this.initializeEndpoints();
  }

  initializeEndpoints() {
    this.apiEndpoints.set([
      // ========== COMPANIES ==========
      {
        name: 'Companies',
        method: 'GET',
        url: '/api/company-mongo/',
        description: 'Récupère les informations de la compagnie depuis MongoDB',
        example: {
          "success": true,
          "data": {
            "name": "Fixer Solutions",
            "industry": "Technology",
            "foundedYear": 2020,
            "totalEmployees": 25,
            "revenue": 1200000
          }
        }
      },
      // ========== DEPARTMENTS ==========
      {
        name: 'Departments',
        method: 'GET',
        url: '/api/company-mongo/departments',
        description: 'Récupère tous les départements depuis MongoDB',
        example: {
          "success": true,
          "data": [
            {
              "_id": "...",
              "name": "IT Department",
              "manager": "John Smith",
              "budget": 200000,
              "employeeCount": 15
            }
          ]
        }
      },
      {
        name: 'Departments',
        method: 'POST',
        url: '/api/company-mongo/departments',
        description: 'Ajoute un nouveau département à MongoDB',
        example: {
          "success": true,
          "data": {
            "_id": "...",
            "name": "Marketing",
            "manager": "Jane Doe",
            "budget": 150000,
            "employeeCount": 8
          }
        },
        postData: {
          "name": "Innovation Lab",
          "description": "Research and Development department",
          "budget": 300000,
          "goals": ["AI Research", "Product Innovation"]
        }
      },
      // ========== EMPLOYEES ==========
      {
        name: 'Employees',
        method: 'GET',
        url: '/api/company-mongo/employees',
        description: 'Récupère tous les employés depuis MongoDB',
        example: {
          "success": true,
          "data": [
            {
              "_id": "...",
              "firstName": "John",
              "lastName": "Doe",
              "position": "Developer",
              "department": "IT",
              "email": "john.doe@fixersolutions.com",
              "salary": 60000
            }
          ]
        }
      },
      {
        name: 'Employees',
        method: 'POST',
        url: '/api/company-mongo/employees',
        description: 'Ajoute un nouvel employé à MongoDB',
        example: {
          "success": true,
          "data": {
            "_id": "...",
            "firstName": "Marie",
            "lastName": "Martin",
            "position": "Designer",
            "department": "Design",
            "email": "marie.martin@fixersolutions.com",
            "salary": 55000
          }
        },
        postData: {
          "firstName": "Alex",
          "lastName": "Thompson",
          "position": "Senior Developer",
          "department": "IT",
          "email": "alex.thompson@fixersolutions.com",
          "phone": "+1 (555) 987-6543",
          "salary": 75000,
          "hireDate": "2025-08-20",
          "isActive": true
        }
      },
      // ========== FINANCIALS ==========
      {
        name: 'Financials',
        method: 'GET',
        url: '/api/company-mongo/financial',
        description: 'Récupère toutes les données financières depuis MongoDB',
        example: {
          "success": true,
          "data": {
            "year": 2024,
            "revenue": 1200000,
            "expenses": 800000,
            "profit": 400000,
            "quarter": "Q4"
          }
        }
      },
      // ========== PROJECTS ==========
      {
        name: 'Projects',
        method: 'GET',
        url: '/api/company-mongo/projects',
        description: 'Récupère tous les projets depuis MongoDB',
        example: {
          "success": true,
          "data": [
            {
              "_id": "...",
              "name": "E-Commerce Platform",
              "description": "Online sales platform",
              "status": "Active",
              "budget": 150000,
              "startDate": "2024-01-15"
            }
          ]
        }
      },
      {
        name: 'Projects',
        method: 'POST',
        url: '/api/company-mongo/projects',
        description: 'Ajoute un nouveau projet à MongoDB',
        example: {
          "success": true,
          "data": {
            "_id": "...",
            "name": "Mobile App",
            "description": "Cross-platform mobile application",
            "status": "En cours",
            "budget": 120000,
            "startDate": "2025-09-01"
          }
        },
        postData: {
          "name": "AI Analytics Dashboard",
          "description": "Advanced analytics platform with AI insights",
          "status": "En planification",
          "budget": 200000,
          "clientName": "DataTech Solutions",
          "technologies": ["React", "Python", "TensorFlow", "MongoDB"],
          "startDate": "2025-10-01",
          "endDate": "2026-03-31",
          "teamSize": 6
        }
      },
      // ========== MESSAGES ==========
      {
        name: 'Messages',
        method: 'GET',
        url: '/api/company-mongo/messages',
        description: 'Récupère tous les messages depuis MongoDB',
        example: {
          "success": true,
          "data": [
            {
              "_id": "...",
              "name": "John Dupont",
              "email": "john.dupont@email.com",
              "subject": "Demande d'information",
              "message": "Bonjour, j'aimerais plus d'informations",
              "status": "nouveau",
              "createdAt": "2025-08-20T10:30:00Z"
            }
          ],
          "count": 1
        }
      },
      {
        name: 'Messages',
        method: 'POST',
        url: '/api/company-mongo/messages',
        description: 'Ajoute un nouveau message à MongoDB',
        example: {
          "success": true,
          "data": {
            "_id": "...",
            "name": "Marie Martin",
            "email": "marie.martin@email.com",
            "subject": "Question technique",
            "message": "J'aimerais avoir des détails sur vos services",
            "status": "nouveau",
            "createdAt": "2025-08-20T10:30:00Z"
          }
        },
        postData: {
          "name": "Marie Martin",
          "email": "marie.martin@email.com",
          "subject": "Question sur vos services",
          "message": "Bonjour, j'aimerais avoir plus de détails sur vos solutions techniques et vos tarifs.",
          "status": "nouveau"
        }
      }
    ]);
  }

  async loadStats() {
    this.loading.set(true);
    
    try {
      // Utilise le service mock au lieu de l'API réelle
      const [stats, company] = await Promise.all([
        this.mockApi.getStats(),
        this.mockApi.getCompany()
      ]);
      
      this.stats.set({ 
        ...stats,
        company: company
      });
      
      this.loading.set(false);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
      this.loading.set(false);
    }
  }

  async testEndpoint(endpoint: any) {
    this.showResults.set(true);
    this.testResults.set({ loading: true, endpoint: endpoint.name });
    
    this.scrollToJsonSection();
    
    try {
      // Utilise le service mock au lieu de faire des appels HTTP réels
      const response = await this.mockApi.testEndpoint(endpoint.url, endpoint.method);
      this.testResults.set({
        loading: false,
        endpoint: endpoint.name,
        success: true,
        data: response,
        url: endpoint.url,
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (error: any) {
      this.testResults.set({
        loading: false,
        endpoint: endpoint.name,
        success: false,
        error: error.message || 'Erreur inconnue',
        url: endpoint.url,
        timestamp: new Date().toLocaleTimeString()
      });
    }
  }

  switchMode(mode: 'GET' | 'POST') {
    this.currentMode.set(mode);
    if (mode === 'POST') {
      const postEndpoints = this.getPostEndpoints();
      if (postEndpoints.length > 0) {
        this.selectPostEndpoint(postEndpoints[0]);
      }
    }
    this.clearResults();
  }

  getPostEndpoints() {
    return this.apiEndpoints().filter(ep => ep.method === 'POST');
  }

  selectPostEndpoint(endpoint: any) {
    this.selectedPostEndpoint.set(endpoint);
    if (endpoint.postData) {
      this.postJsonData.set(JSON.stringify(endpoint.postData, null, 2));
    }
    // Suppression du scroll automatique - ne défiler que lors des tests
  }

  async submitPostRequest() {
    const endpoint = this.selectedPostEndpoint();
    if (!endpoint) return;

    this.showResults.set(true);
    this.testResults.set({ loading: true, endpoint: endpoint.name });
    
    this.scrollToJsonSection();

    try {
      const postData = JSON.parse(this.postJsonData());
      let postUrl = endpoint.url;
      
      const response = await this.http.post(postUrl, postData).toPromise();
      
      this.testResults.set({
        loading: false,
        endpoint: endpoint.name,
        success: true,
        data: response,
        url: postUrl,
        method: 'POST',
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (error: any) {
      this.testResults.set({
        loading: false,
        endpoint: endpoint.name,
        success: false,
        error: error.error?.error || error.message || 'Erreur inconnue',
        url: endpoint.url,
        method: 'POST',
        timestamp: new Date().toLocaleTimeString()
      });
    }
  }

  updateJsonData(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.postJsonData.set(textarea.value);
  }

  scrollToJsonSection() {
    const element = document.getElementById('json-output');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }

  clearResults() {
    this.testResults.set(null);
  }
}
