import { Component, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  protected readonly title = signal('Fixer Solutions - Portfolio');
  protected readonly employees = signal<any[]>([]);
  protected readonly projects = signal<any[]>([]);
  protected readonly departments = signal<any[]>([]);
  protected readonly financialData = signal<any[]>([]);
  protected readonly stats = signal<any>({});
  protected readonly loading = signal(false);
  private readonly apiUrl = '/api';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadEmployees();
    this.loadProjects();
    this.loadDepartments();
    this.loadFinancialData();
    this.loadStats();
  }

  loadEmployees() {
    this.loading.set(true);
    this.http.get(`${this.apiUrl}/company-mongo/employees`).subscribe({
      next: (data: any) => {
        this.employees.set(data.data || data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des employés:', error);
        this.loading.set(false);
      }
    });
  }

  loadProjects() {
    this.http.get(`${this.apiUrl}/company-mongo/projects`).subscribe({
      next: (data: any) => {
        this.projects.set(data.data || data);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des projets:', error);
      }
    });
  }

  loadDepartments() {
    this.http.get(`${this.apiUrl}/company-mongo/departments`).subscribe({
      next: (data: any) => {
        this.departments.set(data.data || data);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des départements:', error);
      }
    });
  }

  loadFinancialData() {
    this.http.get(`${this.apiUrl}/company-mongo/financial`).subscribe({
      next: (data: any) => {
        this.financialData.set(data.data || data);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données financières:', error);
      }
    });
  }

  loadStats() {
    this.http.get(`${this.apiUrl}/company-mongo/stats`).subscribe({
      next: (data: any) => {
        this.stats.set(data);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    });
  }

  getActiveProjects(): number {
    const statsData = this.stats();
    if (!statsData?.data?.projects?.byStatus) return 0;
    
    const activeProject = statsData.data.projects.byStatus.find((p: any) => p._id === 'Active');
    return activeProject ? activeProject.count : 0;
  }
}
