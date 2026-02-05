import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface WorkerTask {
    taskId: number;
    title: string;
    customerName: string;
    location: string;
    scheduledDate: string;
    status: 'Active' | 'Scheduled' | 'Completed';
    budget: number;
    category: string;
}

@Component({
    selector: 'app-my-jobs',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="my-jobs-container">
      <header class="page-header">
        <h1>My Jobs</h1>
        <p>Manage your active and upcoming tasks</p>
      </header>

      <!-- Filter Tabs -->
      <div class="filter-tabs">
        <button 
          *ngFor="let filter of filters" 
          class="filter-tab"
          [class.active]="currentFilter === filter"
          (click)="setFilter(filter)">
          {{ filter }}
        </button>
      </div>

      <!-- Jobs List -->
      <div class="jobs-list" *ngIf="filteredTasks.length > 0">
        <div class="job-card" *ngFor="let task of filteredTasks">
          <div class="job-header">
            <div class="job-title-section">
              <h3>{{ task.title }}</h3>
              <span class="job-category">{{ task.category }}</span>
            </div>
            <span class="status-badge" [class]="task.status.toLowerCase()">
              {{ task.status }}
            </span>
          </div>

          <div class="job-details">
            <div class="detail-item">
              <i class="bi bi-person"></i>
              <span>{{ task.customerName }}</span>
            </div>
            <div class="detail-item">
              <i class="bi bi-geo-alt"></i>
              <span>{{ task.location }}</span>
            </div>
            <div class="detail-item">
              <i class="bi bi-calendar"></i>
              <span>{{ task.scheduledDate | date:'medium' }}</span>
            </div>
            <div class="detail-item">
              <i class="bi bi-currency-rupee"></i>
              <span>₹{{ task.budget }}</span>
            </div>
          </div>

          <div class="job-actions">
            <button class="btn-action primary" *ngIf="task.status === 'Scheduled'" (click)="startWork(task.taskId)">
              <i class="bi bi-play-circle"></i> Start Work
            </button>
            <button class="btn-action success" *ngIf="task.status === 'Active'" (click)="completeWork(task.taskId)">
              <i class="bi bi-check-circle"></i> Mark Complete
            </button>
            <button class="btn-action" (click)="contactCustomer(task.taskId)">
              <i class="bi bi-chat-dots"></i> Contact Customer
            </button>
            <button class="btn-action danger" *ngIf="task.status !== 'Completed'" (click)="reportIssue(task.taskId)">
              <i class="bi bi-exclamation-triangle"></i> Report Issue
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="filteredTasks.length === 0 && !isLoading">
        <i class="bi bi-briefcase"></i>
        <h3>No {{ currentFilter.toLowerCase() }} jobs</h3>
        <p>When you get assigned to tasks, they'll appear here.</p>
      </div>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="isLoading">
        <p>Loading your jobs...</p>
      </div>
    </div>
  `,
    styles: [`
    .my-jobs-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header h1 {
      font-size: 2rem;
      color: #1F2937;
      margin-bottom: 0.5rem;
    }

    .page-header p {
      color: #6B7280;
      font-size: 1rem;
    }

    .filter-tabs {
      display: flex;
      gap: 1rem;
      margin: 2rem 0;
      border-bottom: 2px solid #E5E7EB;
    }

    .filter-tab {
      background: none;
      border: none;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      font-weight: 600;
      color: #6B7280;
      cursor: pointer;
      border-bottom: 3px solid transparent;
      transition: all 0.2s;
      margin-bottom: -2px;
    }

    .filter-tab:hover {
      color: #4F46E5;
    }

    .filter-tab.active {
      color: #4F46E5;
      border-bottom-color: #4F46E5;
    }

    .jobs-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .job-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #E5E7EB;
      transition: all 0.2s;
    }

    .job-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #F3F4F6;
    }

    .job-title-section h3 {
      font-size: 1.25rem;
      color: #111827;
      margin-bottom: 0.5rem;
    }

    .job-category {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: #F3F4F6;
      color: #6B7280;
      border-radius: 999px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .status-badge {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .status-badge.active {
      background: #DBEAFE;
      color: #1E40AF;
    }

    .status-badge.scheduled {
      background: #FEF3C7;
      color: #92400E;
    }

    .status-badge.completed {
      background: #D1FAE5;
      color: #065F46;
    }

    .job-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #4B5563;
      font-size: 0.95rem;
    }

    .detail-item i {
      color: #9CA3AF;
      font-size: 1.1rem;
    }

    .job-actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .btn-action {
      padding: 0.5rem 1rem;
      border: 1px solid #D1D5DB;
      background: white;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }

    .btn-action:hover {
      background: #F9FAFB;
      border-color: #9CA3AF;
    }

    .btn-action.primary {
      background: #4F46E5;
      color: white;
      border-color: #4F46E5;
    }

    .btn-action.primary:hover {
      background: #4338CA;
    }

    .btn-action.success {
      background: #10B981;
      color: white;
      border-color: #10B981;
    }

    .btn-action.success:hover {
      background: #059669;
    }

    .btn-action.danger {
      color: #DC2626;
      border-color: #FCA5A5;
    }

    .btn-action.danger:hover {
      background: #FEE2E2;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #9CA3AF;
    }

    .empty-state i {
      font-size: 4rem;
      margin-bottom: 1rem;
      display: block;
    }

    .empty-state h3 {
      color: #6B7280;
      margin-bottom: 0.5rem;
    }

    .loading-state {
      text-align: center;
      padding: 3rem;
      color: #6B7280;
    }
  `]
})
export class MyJobsComponent implements OnInit {
    tasks: WorkerTask[] = [];
    filteredTasks: WorkerTask[] = [];
    filters = ['All', 'Active', 'Scheduled', 'Completed'];
    currentFilter = 'All';
    isLoading = true;

    constructor(
        private http: HttpClient,
        private router: Router,
        public authService: AuthService
    ) { }

    ngOnInit() {
        this.loadMyJobs();
    }

    loadMyJobs() {
        const currentUser = this.authService.currentUser();
        if (!currentUser) return;

        this.isLoading = true;
        // Fetch tasks assigned to this worker
        this.http.get<WorkerTask[]>(`/api/tasks/worker/${currentUser.id}`).subscribe({
            next: (tasks) => {
                this.tasks = tasks;
                this.applyFilter();
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Failed to load jobs', err);
                this.isLoading = false;
            }
        });
    }

    setFilter(filter: string) {
        this.currentFilter = filter;
        this.applyFilter();
    }

    applyFilter() {
        if (this.currentFilter === 'All') {
            this.filteredTasks = this.tasks;
        } else {
            this.filteredTasks = this.tasks.filter(
                task => task.status === this.currentFilter
            );
        }
    }

    startWork(taskId: number) {
        this.http.patch(`/api/tasks/${taskId}/start`, {}).subscribe({
            next: () => {
                alert('Task started successfully!');
                this.loadMyJobs();
            },
            error: (err) => {
                console.error('Failed to start task', err);
                alert('Failed to start task. Please try again.');
            }
        });
    }

    completeWork(taskId: number) {
        this.http.patch(`/api/tasks/${taskId}/complete`, {}).subscribe({
            next: () => {
                alert('Task marked as complete!');
                this.loadMyJobs();
            },
            error: (err) => {
                console.error('Failed to complete task', err);
                alert('Failed to complete task. Please try again.');
            }
        });
    }

    contactCustomer(taskId: number) {
        this.router.navigate(['/app/messages'], { queryParams: { taskId } });
    }

    reportIssue(taskId: number) {
        this.router.navigate(['/app/report-issue', taskId]);
    }
}
