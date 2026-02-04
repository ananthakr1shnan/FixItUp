import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar-container" [ngClass]="{'dark-theme': authService.currentUser()?.role === 'Admin'}">
      <div class="sidebar-header">
        <i class="bi bi-check-square-fill logo-icon"></i>
        <span class="logo-text">FixItUp <span *ngIf="authService.currentUser()?.role === 'Admin'" class="admin-badge">Admin</span></span>
      </div>

      <div class="sidebar-content">
        <!-- Customer Links -->
        <div class="nav-section" *ngIf="authService.currentUser()?.role === 'Customer'">
           <a routerLink="/app/dashboard" routerLinkActive="active" class="nav-item">
              Dashboard
           </a>
           <a routerLink="/app/my-tasks" routerLinkActive="active" class="nav-item">
             My Tasks
           </a>
           <a routerLink="/app/messages" routerLinkActive="active" class="nav-item">
              Messages
              <span class="badge">2</span>
           </a>
           <a routerLink="/app/payments" routerLinkActive="active" class="nav-item">
              Payments
           </a>
        </div>

        <!-- Worker Links -->
        <div class="nav-section" *ngIf="authService.currentUser()?.role === 'Worker'">
          <h3 class="section-title">Work</h3>
          <a routerLink="/app/find-work" routerLinkActive="active" class="nav-item">
            Find Work
          </a>
          <a routerLink="/app/my-jobs" routerLinkActive="active" class="nav-item">
            My Jobs
          </a>
          <a routerLink="/app/earnings" routerLinkActive="active" class="nav-item">
            Earnings
          </a>
        </div>

        <!-- Admin Links -->
        <div class="nav-section" *ngIf="authService.currentUser()?.role === 'Admin'">
          <h3 class="section-title">Overview</h3>
          <a routerLink="/app/admin-dashboard" routerLinkActive="active" class="nav-item">
            Dashboard
          </a>
          <a routerLink="/app/analytics" routerLinkActive="active" class="nav-item">
            Analytics
          </a>

          <h3 class="section-title">Management</h3>
          <a routerLink="/app/users" routerLinkActive="active" class="nav-item">
            Users & Workers
          </a>
          <a routerLink="/app/task-monitoring" routerLinkActive="active" class="nav-item">
            Task Monitoring
          </a>
          <a routerLink="/app/disputes" routerLinkActive="active" class="nav-item">
            Disputes
            <span class="badge badge-red">3</span>
          </a>
          <a routerLink="/app/financials" routerLinkActive="active" class="nav-item">
            Financials
          </a>

          <h3 class="section-title">System</h3>
          <a routerLink="/app/settings" routerLinkActive="active" class="nav-item">
            Settings
          </a>
        </div>
      </div>

      <div class="sidebar-footer">
        <div class="user-profile" *ngIf="authService.currentUser() as user">
           <div class="avatar">{{ getInitials(user.fullName) }}</div>
           <div class="info">
             <div class="name">{{ user.fullName }}</div>
             <div class="role">{{ user.role }}</div>
           </div>
        </div>
        <button class="logout-btn" (click)="logout()">
          <i class="bi bi-box-arrow-right"></i>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      background-color: var(--secondary-100); /* Default Light Beige */
      color: var(--secondary-400); 
      border-right: none;
      padding: 1.5rem 1rem;
      transition: background-color 0.3s;
    }

    /* Admin Dark Theme */
    .sidebar-container.dark-theme {
       background-color: #1a1a1a; /* Dark background */
       color: #9CA3AF;
    }
    
    .sidebar-container.dark-theme .logo-text { color: white; }
    .sidebar-container.dark-theme .nav-item { color: #9CA3AF; }
    .sidebar-container.dark-theme .nav-item:hover { background-color: rgba(255,255,255,0.05); color: white; }
    .sidebar-container.dark-theme .nav-item.active { background-color: rgba(255, 255, 255, 0.08); color: #8D3B23; border-left: 3px solid #8D3B23; box-shadow: none; border-radius: 0 4px 4px 0; }
    /* Screenshot style override for admin active: Just text color or subtle bg? Screenshot shows "Dashboard" active with brown text/bg? 
       Actually screenshot shows "Dashboard" with brown background. stick to standard active but maybe tweak colors. */
    .sidebar-container.dark-theme .nav-item.active { background-color: #2C241D; color: #D97706; border-left: none; }

    .sidebar-container.dark-theme .section-title { display: block; color: #4B5563; margin-top: 1.5rem; margin-bottom: 0.75rem; font-size: 0.7rem; letter-spacing: 1px; }

    .sidebar-header {
      height: 72px;
      display: flex;
      align-items: center;
      padding: 0 0.5rem;
      margin-bottom: 1rem;
      border-bottom: none;
      gap: 0.75rem;
    }

    .logo-icon {
      font-size: 1.5rem;
      color: #8D3B23; /* Dark Brown/Terracotta */
    }

    .logo-text {
      color: var(--secondary-900); 
       font-weight: 700;
       font-size: 1.25rem;
       font-family: var(--font-display);
       display: flex; align-items: center; gap: 0.5rem;
    }
    
    .admin-badge {
       font-size: 0.75rem; color: #9CA3AF; font-weight: 400; 
    }

    .sidebar-content {
      flex: 1;
      padding: 0;
      overflow-y: auto;
    }

    .section-title {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--secondary-400); /* Grey */
      margin: 1.5rem 0 0.5rem 0.75rem;
      font-weight: 600;
      display: none; 
    }
    
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      color: var(--secondary-400); /* Inactive text grey */
      margin-bottom: 0.5rem;
      transition: all 0.2s;
      font-weight: 500;
      text-decoration: none;
    }

    .nav-item:hover {
      color: var(--primary-500);
      background-color: rgba(141, 59, 35, 0.05);
    }

    .nav-item.active {
      background-color: var(--primary-500); /* Terracotta */
      color: white;
      box-shadow: var(--shadow-sm);
    }
    
    .nav-item.active:hover {
        background-color: var(--primary-600);
    }

    .badge {
      margin-left: auto;
      background-color: var(--primary-500);
      color: white;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 999px;
    }
    
    .badge-red { background: #EF4444; }
    
    .nav-item.active .badge {
       background-color: white;
       color: var(--primary-500);
    }

    .sidebar-footer {
      padding: 1rem 0;
      border-top: 1px solid var(--secondary-200); /* Subtle separator */
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;
    }
    
    .sidebar-container.dark-theme .sidebar-footer { border-color: #374151; }
    .sidebar-container.dark-theme .user-profile .name { color: white; }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #D1D5DB; 
      color: var(--secondary-800);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.85rem;
      overflow: hidden; 
      }
    .avatar img { width: 100%; height: 100%; object-fit: cover; }

    .info .name {
      color: var(--secondary-900); /* Dark name */
      font-size: 0.9rem;
      font-weight: 600;
    }
    .info .role {
      font-size: 0.75rem;
      color: var(--secondary-400); /* Grey role */
    }
    
    .logout-btn {
      background: none;
      border: none;
      color: var(--secondary-400);
      padding: 0.5rem;
      cursor: pointer;
    }
    .logout-btn:hover {
      color: var(--primary-500);
    }
    
    .sidebar-container.dark-theme .logout-btn:hover { color: white; }

  `]
})
export class SidebarComponent {
  constructor(public authService: AuthService) { }

  logout() {
    this.authService.logout();
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}
