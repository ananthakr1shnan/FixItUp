import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, Worker, Customer, AdminTask } from '../../../core/services/admin.service';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="admin-dashboard">
       <div class="dashboard-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p class="subtitle">Manage users, workers, and tasks</p>
          </div>
          <div class="header-actions">
             <div class="search-bar">
                <input type="text" placeholder="Search users, tasks, or IDs...">
             </div>
             <div class="admin-avatar"></div>
          </div>
       </div>

       <!-- Navigation Tabs -->
       <div class="tabs-nav">
          <button class="tab-btn" [class.active]="activeTab === 'overview'" (click)="setActiveTab('overview')">
            Overview
          </button>
          <button class="tab-btn" [class.active]="activeTab === 'workers'" (click)="setActiveTab('workers')">
            Workers
          </button>
          <button class="tab-btn" [class.active]="activeTab === 'users'" (click)="setActiveTab('users')">
            Users
          </button>
          <button class="tab-btn" [class.active]="activeTab === 'tasks'" (click)="setActiveTab('tasks')">
            Task Monitoring
          </button>
       </div>

       <!-- Overview Tab -->
       <div *ngIf="activeTab === 'overview'" class="tab-content">
         <!-- Stats Row -->
         <div class="stats-row">
            <div class="stat-card">
               <div class="stat-top">
                  <div class="icon-box"></div>
                  <span class="trend positive">+12.5%</span>
               </div>
               <div class="stat-value">{{ overviewStats.activeTasks }}</div>
               <div class="stat-label">Active Tasks</div>
            </div>

            <div class="stat-card">
               <div class="stat-top">
                  <div class="icon-box"></div>
                  <span class="trend positive">+8.2%</span>
               </div>
               <div class="stat-value">{{ overviewStats.totalUsers }}</div>
               <div class="stat-label">Total Users</div>
            </div>

            <div class="stat-card">
               <div class="stat-top">
                  <div class="icon-box"></div>
                  <span class="trend positive">+4.1%</span>
               </div>
               <div class="stat-value">₹{{ (overviewStats.monthlyRevenue / 1000).toFixed(1) }}k</div>
               <div class="stat-label">Monthly Revenue</div>
            </div>

            <div class="stat-card alert-card">
               <div class="stat-top">
                  <div class="icon-box alert"></div>
                  <span class="trend negative">+2 New</span>
               </div>
               <div class="stat-value red">{{ overviewStats.openDisputes }}</div>
               <div class="stat-label">Open Disputes</div>
            </div>
         </div>

         <div class="dashboard-content-grid">
            <!-- Recent Activity -->
            <div class="activity-section">
               <div class="section-header">
                  <h3>Recent User Activity</h3>
               </div>
               
               <table class="activity-table">
                  <thead>
                     <tr>
                        <th>User</th>
                        <th>Role</th>
                        <th>Last Action</th>
                        <th>Status</th>
                        <th>Date</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr *ngFor="let activity of activities">
                        <td>
                           <div class="user-cell">
                              <img [src]="activity.avatar" class="avatar-xs">
                              <span>{{ activity.name }}</span>
                           </div>
                        </td>
                        <td>{{ activity.role }}</td>
                        <td>{{ activity.action }}</td>
                        <td>
                           <span class="status-badge" [ngClass]="activity.statusClass">{{ activity.status }}</span>
                        </td>
                        <td class="date-cell">{{ activity.date }}</td>
                     </tr>
                  </tbody>
               </table>
            </div>

            <!-- Sidebar Panels -->
            <div class="right-panels">
               <!-- Disputes -->
               <div class="panel">
                  <h3 class="panel-title red">Dispute Resolution</h3>
                  <div class="dispute-list">
                     <div class="dispute-item" *ngFor="let dispute of disputes">
                        <div class="dispute-icon"></div>
                        <div class="dispute-content">
                           <h4>{{ dispute.title }}</h4>
                           <p>{{ dispute.desc }}</p>
                           <button class="btn btn-dark btn-xs" *ngIf="dispute.actionLabel">{{ dispute.actionLabel }}</button>
                        </div>
                     </div>
                  </div>
               </div>

               <!-- Top Performers -->
               <div class="panel">
                  <h3 class="panel-title">Top Performers</h3>
                  <div class="performer-list">
                     <div class="performer-item" *ngFor="let p of performers; let i = index">
                        <span class="rank">{{ i + 1 }}</span>
                        <img [src]="p.avatar" class="avatar-sm">
                        <div class="p-info">
                           <div class="p-name">{{ p.name }}</div>
                           <div class="p-sub">{{ p.jobs }} Jobs this month</div>
                        </div>
                        <div class="p-income">{{ p.income }}</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
       </div>

       <!-- Workers Tab -->
       <div *ngIf="activeTab === 'workers'" class="tab-content">
         <div class="section-header">
            <h3>All Workers</h3>
            <div class="filters">
              <select class="filter-select">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
         </div>
         
         <div class="data-table-container">
            <table class="data-table">
               <thead>
                  <tr>
                     <th>Worker Name</th>
                     <th>Email</th>
                     <th>Location</th>
                     <th>Skills</th>
                     <th>Trust Score</th>
                     <th>Jobs Completed</th>
                     <th>Status</th>
                     <th>Actions</th>
                  </tr>
               </thead>
               <tbody>
                  <tr *ngFor="let worker of workers" (click)="viewWorkerDetails(worker)">
                     <td>
                        <div class="user-cell">
                           <div class="avatar-xs">{{ worker.initials }}</div>
                           <span>{{ worker.name }}</span>
                        </div>
                     </td>
                     <td>{{ worker.email }}</td>
                     <td>{{ worker.location }}</td>
                     <td>{{ worker.skills }}</td>
                     <td><span class="score-badge">{{ worker.trustScore }}</span></td>
                     <td>{{ worker.jobsCompleted }}</td>
                     <td>
                        <span class="status-badge" [ngClass]="worker.statusClass">{{ worker.status }}</span>
                     </td>
                     <td>
                        <button class="btn-icon" (click)="viewWorkerDetails(worker); $event.stopPropagation()">👁️</button>
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>
       </div>

       <!-- Users Tab -->
       <div *ngIf="activeTab === 'users'" class="tab-content">
         <div class="section-header">
            <h3>All Customers</h3>
            <div class="filters">
              <select class="filter-select">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
         </div>
         
         <div class="data-table-container">
            <table class="data-table">
               <thead>
                  <tr>
                     <th>Customer Name</th>
                     <th>Email</th>
                     <th>Location</th>
                     <th>Tasks Posted</th>
                     <th>Total Spent</th>
                     <th>Join Date</th>
                     <th>Status</th>
                     <th>Actions</th>
                  </tr>
               </thead>
               <tbody>
                  <tr *ngFor="let user of users" (click)="viewUserDetails(user)">
                     <td>
                        <div class="user-cell">
                           <div class="avatar-xs">{{ user.initials }}</div>
                           <span>{{ user.name }}</span>
                        </div>
                     </td>
                     <td>{{ user.email }}</td>
                     <td>{{ user.location }}</td>
                     <td>{{ user.tasksPosted }}</td>
                     <td>{{ user.totalSpent }}</td>
                     <td>{{ user.joinDate }}</td>
                     <td>
                        <span class="status-badge" [ngClass]="user.statusClass">{{ user.status }}</span>
                     </td>
                     <td>
                        <button class="btn-icon" (click)="viewUserDetails(user); $event.stopPropagation()">👁️</button>
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>
       </div>

       <!-- Task Monitoring Tab -->
       <div *ngIf="activeTab === 'tasks'" class="tab-content">
         <div class="section-header">
            <h3>Task Monitoring</h3>
            <div class="filters">
              <select class="filter-select" [(ngModel)]="taskFilter" (change)="filterTasks()">
                <option value="all">All Tasks</option>
                <option value="Posted">Posted</option>
                <option value="InProgress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
         </div>

         <!-- Task Stats -->
         <div class="task-stats-row">
            <div class="task-stat-card">
               <div class="task-stat-value">{{ taskStats.posted }}</div>
               <div class="task-stat-label">Posted</div>
            </div>
            <div class="task-stat-card">
               <div class="task-stat-value">{{ taskStats.inProgress }}</div>
               <div class="task-stat-label">In Progress</div>
            </div>
            <div class="task-stat-card">
               <div class="task-stat-value">{{ taskStats.completed }}</div>
               <div class="task-stat-label">Completed</div>
            </div>
            <div class="task-stat-card">
               <div class="task-stat-value">{{ taskStats.cancelled }}</div>
               <div class="task-stat-label">Cancelled</div>
            </div>
            <div class="task-stat-card">
               <div class="task-stat-value">{{ taskStats.pending }}</div>
               <div class="task-stat-label">Pending</div>
            </div>
         </div>
         
         <div class="data-table-container">
            <table class="data-table">
               <thead>
                  <tr>
                     <th>Task ID</th>
                     <th>Title</th>
                     <th>Customer</th>
                     <th>Worker</th>
                     <th>Category</th>
                     <th>Budget</th>
                     <th>Status</th>
                     <th>Created</th>
                     <th>Actions</th>
                  </tr>
               </thead>
               <tbody>
                  <tr *ngFor="let task of filteredTasks">
                     <td>#{{ task.id }}</td>
                     <td>{{ task.title }}</td>
                     <td>{{ task.customer }}</td>
                     <td>{{ task.worker || 'Not assigned' }}</td>
                     <td>{{ task.category }}</td>
                     <td>{{ task.budget }}</td>
                     <td>
                        <span class="status-badge" [ngClass]="getTaskStatusClass(task.status)">{{ task.status }}</span>
                     </td>
                     <td>{{ task.created }}</td>
                     <td>
                        <button class="btn-icon" (click)="viewTaskDetails(task)">👁️</button>
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>
       </div>

       <!-- Details Modal -->
       <div *ngIf="showDetailsModal" class="modal-overlay" (click)="closeDetailsModal()">
         <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
               <h2>{{ modalTitle }}</h2>
               <button class="close-btn" (click)="closeDetailsModal()">×</button>
            </div>
            <div class="modal-body">
               <div *ngIf="selectedWorker">
                  <div class="detail-row">
                     <span class="detail-label">Full Name:</span>
                     <span class="detail-value">{{ selectedWorker.name }}</span>
                  </div>
                  <div class="detail-row">
                     <span class="detail-label">Email:</span>
                     <span class="detail-value">{{ selectedWorker.email }}</span>
                  </div>
                  <div class="detail-row">
                     <span class="detail-label">Phone:</span>
                     <span class="detail-value">{{ selectedWorker.phone }}</span>
                  </div>
                  <div class="detail-row">
                     <span class="detail-label">Location:</span>
                     <span class="detail-value">{{ selectedWorker.location }}</span>
                  </div>
                  <div class="detail-row">
                     <span class="detail-label">Skills:</span>
                     <span class="detail-value">{{ selectedWorker.skills }}</span>
                  </div>
                  <div class="detail-row">
                     <span class="detail-label">Trust Score:</span>
                     <span class="detail-value">{{ selectedWorker.trustScore }}/100</span>
                  </div>
                  <div class="detail-row">
                     <span class="detail-label">Jobs Completed:</span>
                     <span class="detail-value">{{ selectedWorker.jobsCompleted }}</span>
                  </div>
                  <div class="detail-row">
                     <span class="detail-label">On-Time Rate:</span>
                     <span class="detail-value">{{ selectedWorker.onTimeRate }}%</span>
                  </div>
                  <div class="detail-row">
                     <span class="detail-label">Average Rating:</span>
                     <span class="detail-value">{{ selectedWorker.rating }}/5.0</span>
                  </div>
                  <div class="detail-row">
                     <span class="detail-label">Total Earnings:</span>
                     <span class="detail-value">{{ selectedWorker.earnings }}</span>
                  </div>
                  <div class="detail-row">
                     <span class="detail-label">Status:</span>
                     <span class="status-badge" [ngClass]="selectedWorker.statusClass">{{ selectedWorker.status }}</span>
                  </div>
               </div>

               <div *ngIf="selectedUser">
                  <div class="detail-row">
                     <span class="detail-label">Full Name:</span>
                     <span class="detail-value">{{ selectedUser.name }}</span>
                  </div>
                  <div class="detail-row">
                     <span class="detail-label">Email:</span>
                     <span class="detail-value">{{ selectedUser.email }}</span>
                  </div>
                  <div class="detail-row">
                     <span class="detail-label">Phone:</span>
                     <span class="detail-value">{{ selectedUser.phone }}</span>
                  </div>
                  <div class="detail-row">
                     <span class="detail-label">Location:</span>
                     <span class="detail-value">{{ selectedUser.location }}</span>
                  </div>
                  <div class="detail-row">
                     <span class="detail-label">Tasks Posted:</span>
                     <span class="detail-value">{{ selectedUser.tasksPosted }}</span>
                  </div>
                  <div class="detail-row">
                     <span class="detail-label">Completed Tasks:</span>
                     <span class="detail-value">{{ selectedUser.completedTasks }}</span>
                  </div>
                  <div class="detail-row">
                     <span class="detail-label">Total Spent:</span>
                     <span class="detail-value">{{ selectedUser.totalSpent }}</span>
                  </div>
                  <div class="detail-row">
                     <span class="detail-label">Join Date:</span>
                     <span class="detail-value">{{ selectedUser.joinDate }}</span>
                  </div>
                  <div class="detail-row">
                     <span class="detail-label">Status:</span>
                     <span class="status-badge" [ngClass]="selectedUser.statusClass">{{ selectedUser.status }}</span>
                  </div>
               </div>

               <div *ngIf="selectedTask">
                  <div class="detail-row">
                     <span class="detail-label">Task ID:</span>
                     <span class="detail-value">#{{ selectedTask.id }}</span>
                  </div>
                  <div class="detail-row">
                     <span class="detail-label">Title:</span>
                     <span class="detail-value">{{ selectedTask.title }}</span>
                  </div>
                  <div class="detail-row">
                     <span class="detail-label">Description:</span>
                     <span class="detail-value">{{ selectedTask.description }}</span>
                  </div>
                  <div class="detail-row">
                     <span class="detail-label">Customer:</span>
                     <span class="detail-value">{{ selectedTask.customer }}</span>
                  </div>
                  <div class="detail-row">
                     <span class="detail-label">Worker:</span>
                     <span class="detail-value">{{ selectedTask.worker || 'Not assigned' }}</span>
                  </div>
                  <div class="detail-row">
                     <span class="detail-label">Category:</span>
                     <span class="detail-value">{{ selectedTask.category }}</span>
                  </div>
                  <div class="detail-row">
                     <span class="detail-label">Budget:</span>
                     <span class="detail-value">{{ selectedTask.budget }}</span>
                  </div>
                  <div class="detail-row">
                     <span class="detail-label">Location:</span>
                     <span class="detail-value">{{ selectedTask.location }}</span>
                  </div>
                  <div class="detail-row">
                     <span class="detail-label">Total Bids:</span>
                     <span class="detail-value">{{ selectedTask.bids }}</span>
                  </div>
                  <div class="detail-row">
                     <span class="detail-label">Status:</span>
                     <span class="status-badge" [ngClass]="getTaskStatusClass(selectedTask.status)">{{ selectedTask.status }}</span>
                  </div>
                  <div class="detail-row">
                     <span class="detail-label">Created:</span>
                     <span class="detail-value">{{ selectedTask.created }}</span>
                  </div>
                  <div class="detail-row" *ngIf="selectedTask.completedDate">
                     <span class="detail-label">Completed:</span>
                     <span class="detail-value">{{ selectedTask.completedDate }}</span>
                  </div>
               </div>
            </div>
         </div>
       </div>
    </div>
  `,
    styles: [`
    .admin-dashboard {
       padding-bottom: 2rem;
    }

    .dashboard-header {
       display: flex;
       justify-content: space-between;
       align-items: center;
       margin-bottom: 1.5rem;
    }

    h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.25rem; }
    .subtitle { color: var(--text-medium); font-size: 0.9rem; margin: 0; }

    .header-actions { display: flex; align-items: center; gap: 1rem; }
    .search-bar { position: relative; }
    .search-bar input { padding: 0.6rem 1rem; border: 1px solid var(--secondary-200); border-radius: 8px; width: 300px; font-size: 0.9rem; }
    .admin-avatar { width: 36px; height: 36px; background: var(--primary-100); border-radius: 50%; }

    /* Tabs */
    .tabs-nav {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
      border-bottom: 2px solid var(--secondary-200);
    }

    .tab-btn {
      padding: 0.75rem 1.5rem;
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      cursor: pointer;
      font-weight: 600;
      color: var(--text-medium);
      transition: all 0.2s;
    }

    .tab-btn.active {
      color: var(--primary-500);
      border-bottom-color: var(--primary-500);
    }

    .tab-content {
      animation: fadeIn 0.3s;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Stats */
    .stats-row {
       display: grid;
       grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
       gap: 1.5rem;
       margin-bottom: 2rem;
    }

    .stat-card {
       background: white;
       padding: 1.5rem;
       border-radius: var(--radius-lg);
       box-shadow: var(--shadow-sm);
    }

    .stat-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .icon-box { width: 40px; height: 40px; background: var(--primary-100); border-radius: 8px; }
    .icon-box.alert { background: #FEE2E2; }
    .trend { font-size: 0.75rem; font-weight: 600; padding: 0.2rem 0.5rem; border-radius: 4px; }
    .trend.positive { background: #DCFCE7; color: #15803D; }
    .trend.negative { background: #FEE2E2; color: #B91C1C; }

    .stat-value { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.25rem; }
    .stat-value.red { color: var(--danger); }
    .stat-label { color: var(--text-medium); font-size: 0.85rem; }

    /* Task Stats Row */
    .task-stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .task-stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      text-align: center;
    }

    .task-stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: var(--primary-500);
      margin-bottom: 0.5rem;
    }

    .task-stat-label {
      font-size: 0.875rem;
      color: var(--text-medium);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Dashboard Grid */
    .dashboard-content-grid {
       display: grid;
       grid-template-columns: 1fr 350px;
       gap: 2rem;
    }

    @media (max-width: 1200px) {
       .dashboard-content-grid { grid-template-columns: 1fr; }
    }

    /* Activity Section */
    .activity-section {
       background: white;
       border-radius: var(--radius-lg);
       padding: 1.5rem;
       box-shadow: var(--shadow-sm);
    }

    .section-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      margin-bottom: 1.5rem; 
    }
    
    .section-header h3 { 
      font-size: 1.1rem; 
      margin: 0; 
    }

    .filters {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .filter-select {
      padding: 0.5rem 1rem;
      border: 1px solid var(--secondary-200);
      border-radius: 6px;
      font-size: 0.9rem;
      cursor: pointer;
    }

    /* Data Table */
    .data-table-container {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table thead {
      background: var(--secondary-50);
    }

    .data-table th {
      text-align: left;
      font-size: 0.75rem;
      color: var(--text-medium);
      text-transform: uppercase;
      padding: 1rem;
      font-weight: 600;
      border-bottom: 2px solid var(--secondary-200);
    }

    .data-table td {
      padding: 1rem;
      font-size: 0.9rem;
      border-bottom: 1px solid var(--secondary-100);
    }

    .data-table tbody tr {
      cursor: pointer;
      transition: background 0.2s;
    }

    .data-table tbody tr:hover {
      background: var(--secondary-50);
    }

    .activity-table { width: 100%; border-collapse: collapse; }
    .activity-table th { text-align: left; font-size: 0.75rem; color: var(--text-light); text-transform: uppercase; padding-bottom: 1rem; border-bottom: 1px solid var(--secondary-100); }
    .activity-table td { padding: 1rem 0; font-size: 0.9rem; border-bottom: 1px solid var(--secondary-100); }
    .activity-table tr:last-child td { border-bottom: none; }

    .user-cell { 
      display: flex; 
      align-items: center; 
      gap: 0.75rem; 
      font-weight: 600; 
    }
    
    .avatar-xs { 
      width: 32px; 
      height: 32px; 
      border-radius: 50%; 
      background: var(--primary-100); 
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--primary-600);
    }

    .score-badge {
      background: var(--primary-100);
      color: var(--primary-600);
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.85rem;
    }

    .status-badge { 
      font-size: 0.7rem; 
      padding: 0.3rem 0.7rem; 
      border-radius: 12px; 
      font-weight: 600;
      display: inline-block;
    }
    
    .status-active { background: #DCFCE7; color: #15803D; }
    .status-pending { background: #FFEDD5; color: #C2410C; }
    .status-flagged { background: #FEE2E2; color: #B91C1C; }
    .status-Posted { background: #E0E7FF; color: #3730A3; }
    .status-InProgress { background: #FEF3C7; color: #92400E; }
    .status-Completed { background: #D1FAE5; color: #065F46; }
    .status-Cancelled { background: #FEE2E2; color: #991B1B; }

    .date-cell { color: var(--text-light); font-size: 0.85rem; }

    .btn-icon {
      background: none;
      border: 1px solid var(--secondary-200);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.2s;
    }

    .btn-icon:hover {
      background: var(--secondary-100);
    }

    /* Panels */
    .right-panels { display: flex; flex-direction: column; gap: 1.5rem; }
    
    .panel {
       background: white;
       border-radius: var(--radius-lg);
       padding: 1.5rem;
       box-shadow: var(--shadow-sm);
    }
    
    .panel-title { font-size: 1rem; margin-bottom: 1.25rem; }
    .panel-title.red { color: var(--danger); }

    .dispute-item { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
    .dispute-icon { width: 32px; height: 32px; background: #FEE2E2; border-radius: 50%; flex-shrink: 0; }
    .dispute-content h4 { font-size: 0.9rem; margin-bottom: 0.25rem; }
    .dispute-content p { font-size: 0.8rem; color: var(--text-medium); line-height: 1.4; margin-bottom: 0.75rem; }
    
    .btn-dark { background: #1F2937; color: white; padding: 0.3rem 0.75rem; border-radius: 4px; font-size: 0.75rem; border: none; cursor: pointer; }

    /* Top Performers */
    .performer-item { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
    .rank { font-weight: 700; color: #B45309; width: 10px; font-size: 0.9rem; }
    .avatar-sm { width: 36px; height: 36px; border-radius: 50%; background: #ddd; object-fit: cover;}
    .p-info { flex: 1; }
    .p-name { font-size: 0.9rem; font-weight: 600; }
    .p-sub { font-size: 0.75rem; color: var(--text-light); }
    .p-income { font-weight: 700; font-size: 0.9rem; }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid var(--secondary-200);
    }

    .modal-header h2 {
      font-size: 1.5rem;
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 2rem;
      cursor: pointer;
      color: var(--text-medium);
      line-height: 1;
    }

    .close-btn:hover {
      color: var(--text-dark);
    }

    .modal-body {
      padding: 1.5rem;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--secondary-100);
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .detail-label {
      font-weight: 600;
      color: var(--text-medium);
    }

    .detail-value {
      color: var(--text-dark);
      text-align: right;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
    activeTab: 'overview' | 'workers' | 'users' | 'tasks' = 'overview';
    taskFilter = 'all';
    showDetailsModal = false;
    modalTitle = '';
    selectedWorker: any = null;
    selectedUser: any = null;
    selectedTask: any = null;
    isLoading = true;

    taskStats = {
      posted: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
      pending: 0
    };

    overviewStats = {
      activeTasks: 0,
      totalUsers: 0,
      monthlyRevenue: 0,
      openDisputes: 0
    };

    constructor(private adminService: AdminService) {}

    async ngOnInit() {
        await this.loadData();
    }

    async loadData() {
        this.isLoading = true;
        try {
            const [workers, users, tasks] = await Promise.all([
                this.adminService.getAllWorkers(),
                this.adminService.getAllCustomers(),
                this.adminService.getAllTasks()
            ]);

            this.workers = workers.map(w => ({
                id: w.id,
                name: w.fullName,
                initials: this.getInitials(w.fullName),
                email: w.email,
                location: w.location,
                skills: w.skills || 'N/A',
                trustScore: w.trustScore,
                jobsCompleted: w.jobsCompleted,
                status: w.isActive ? 'Active' : 'Inactive',
                statusClass: w.isActive ? 'status-active' : 'status-inactive',
                phone: w.phone,
                onTimeRate: w.onTimeRate || 0,
                rating: w.rating || 0,
                earnings: `₹${(w.earnings || 0).toLocaleString()}`
            }));

            this.users = users.map(u => ({
                id: u.id,
                name: u.fullName,
                initials: this.getInitials(u.fullName),
                email: u.email,
                location: u.location,
                tasksPosted: u.tasksPosted || 0,
                totalSpent: `₹${(u.totalSpent || 0).toLocaleString()}`,
                joinDate: new Date(u.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
                status: u.isActive ? 'Active' : 'Inactive',
                statusClass: u.isActive ? 'status-active' : 'status-inactive',
                phone: u.phone,
                completedTasks: u.completedTasks || 0
            }));

            this.allTasks = tasks.map(t => ({
                id: t.id,
                title: t.title,
                description: t.description,
                customer: t.customerName || 'Unknown',
                worker: t.workerName || null,
                category: t.category,
                budget: `₹${t.minBudget}-₹${t.maxBudget}`,
                status: t.status,
                created: new Date(t.createdAt).toISOString().split('T')[0],
                location: t.location,
                bids: t.bidsCount || 0,
                completedDate: t.status === 'Completed' ? new Date(t.createdAt).toISOString().split('T')[0] : undefined
            }));

            this.calculateTaskStats();
            this.calculateOverviewStats();
            this.filterTasks();
        } catch (error) {
            console.error('Error loading admin data:', error);
        } finally {
            this.isLoading = false;
        }
    }

    getInitials(name: string): string {
        if (!name) return 'NA';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    calculateTaskStats() {
        this.taskStats = {
            posted: this.allTasks.filter(t => t.status === 'Posted').length,
            inProgress: this.allTasks.filter(t => t.status === 'InProgress').length,
            completed: this.allTasks.filter(t => t.status === 'Completed').length,
            cancelled: this.allTasks.filter(t => t.status === 'Cancelled').length,
            pending: this.allTasks.filter(t => t.status === 'Pending').length
        };
    }

    calculateOverviewStats() {
        // Active tasks = Posted + InProgress
        this.overviewStats.activeTasks = this.allTasks.filter(t => 
            t.status === 'Posted' || t.status === 'InProgress'
        ).length;
        
        // Total users = workers + customers
        this.overviewStats.totalUsers = this.workers.length + this.users.length;
        
        // Monthly revenue = sum of completed task budgets this month
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const completedTasksThisMonth = this.allTasks.filter(t => {
            if (t.status !== 'Completed') return false;
            const taskDate = new Date(t.created);
            return taskDate.getMonth() === currentMonth && taskDate.getFullYear() === currentYear;
        });
        
        // Calculate revenue from completed tasks (take average of budget range)
        this.overviewStats.monthlyRevenue = completedTasksThisMonth.reduce((sum, task) => {
            const budgetStr = task.budget.replace(/₹/g, '').replace(/-/g, ',');
            const budgets = budgetStr.split(',').map((b: string) => parseInt(b.trim()) || 0);
            const avgBudget = budgets.length > 1 ? (budgets[0] + budgets[1]) / 2 : budgets[0];
            return sum + avgBudget;
        }, 0);
        
        // Open disputes - for now set to 0 (can be populated from disputes API)
        this.overviewStats.openDisputes = this.disputes.length;
    }

    activities: any[] = [];

    disputes: any[] = [];

    performers: any[] = [];

    workers: any[] = [];

    users: any[] = [];

    allTasks: any[] = [];

    filteredTasks: any[] = [];

    setActiveTab(tab: 'overview' | 'workers' | 'users' | 'tasks') {
      this.activeTab = tab;
      if (tab === 'tasks') {
        this.filterTasks();
      }
    }

    filterTasks() {
      if (this.taskFilter === 'all') {
        this.filteredTasks = [...this.allTasks];
      } else {
        this.filteredTasks = this.allTasks.filter(task => task.status === this.taskFilter);
      }
    }

    getTaskStatusClass(status: string): string {
      return `status-${status}`;
    }

    viewWorkerDetails(worker: any) {
      this.selectedWorker = worker;
      this.selectedUser = null;
      this.selectedTask = null;
      this.modalTitle = 'Worker Details';
      this.showDetailsModal = true;
    }

    viewUserDetails(user: any) {
      this.selectedUser = user;
      this.selectedWorker = null;
      this.selectedTask = null;
      this.modalTitle = 'Customer Details';
      this.showDetailsModal = true;
    }

    viewTaskDetails(task: any) {
      this.selectedTask = task;
      this.selectedWorker = null;
      this.selectedUser = null;
      this.modalTitle = 'Task Details';
      this.showDetailsModal = true;
    }

    closeDetailsModal() {
      this.showDetailsModal = false;
      this.selectedWorker = null;
      this.selectedUser = null;
      this.selectedTask = null;
    }
}
