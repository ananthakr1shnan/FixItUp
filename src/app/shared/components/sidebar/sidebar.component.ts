import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    template: `
    <aside class="sidebar-container">
      <div class="sidebar-header">
        <div class="logo-icon"></div>
        <span class="logo-text">FixItUp</span>
      </div>

      <div class="sidebar-content">
        <!-- Dashboard Section -->
        <div class="nav-section">
          <a routerLink="/app/dashboard" routerLinkActive="active" class="nav-item">
            <span class="icon">dashboard</span>
            Dashboard
          </a>
        </div>

        <!-- Customer Links -->
        <div class="nav-section">
          <h3 class="section-title">My Hiring</h3>
          <a routerLink="/app/my-tasks" routerLinkActive="active" class="nav-item">
            <span class="icon">list_alt</span>
            My Tasks
          </a>
          <a routerLink="/app/post-task" routerLinkActive="active" class="nav-item">
            <span class="icon">add_circle</span>
            Post a Task
          </a>
        </div>

        <!-- Worker Links -->
        <div class="nav-section">
          <h3 class="section-title">Work</h3>
          <a routerLink="/app/find-work" routerLinkActive="active" class="nav-item">
            <span class="icon">search</span>
            Find Work
          </a>
          <a routerLink="/app/my-jobs" routerLinkActive="active" class="nav-item">
            <span class="icon">work</span>
            My Jobs
          </a>
          <a routerLink="/app/earnings" routerLinkActive="active" class="nav-item">
            <span class="icon">payments</span>
            Earnings
          </a>
        </div>

        <!-- General -->
        <div class="nav-section">
           <a routerLink="/app/messages" routerLinkActive="active" class="nav-item">
              <span class="icon">chat</span>
              Messages
              <span class="badge">2</span>
           </a>
           <a routerLink="/app/settings" routerLinkActive="active" class="nav-item">
              <span class="icon">settings</span>
              Settings
           </a>
        </div>
      </div>

      <div class="sidebar-footer">
        <div class="user-profile">
           <div class="avatar">MP</div>
           <div class="info">
             <div class="name">Mike P.</div>
             <div class="role">Worker</div>
           </div>
        </div>
        <button class="logout-btn">
          <span class="icon">logout</span>
        </button>
      </div>
    </aside>
  `,
    styles: [`
    .sidebar-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      background-color: var(--secondary-900);
      color: var(--text-light);
      border-right: 1px solid rgba(255,255,255,0.05);
    }

    .sidebar-header {
      height: 72px;
      display: flex;
      align-items: center;
      padding: 0 1.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      gap: 0.75rem;
    }

    .logo-icon {
      width: 28px;
      height: 28px;
      background-color: var(--primary-500);
      border-radius: 6px;
    }

    .logo-text {
      color: white;
      font-weight: 700;
      font-size: 1.25rem;
      font-family: var(--font-display);
    }

    .sidebar-content {
      flex: 1;
      padding: 1.5rem 1rem;
      overflow-y: auto;
    }

    .section-title {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--secondary-400, #9ca3af);
      margin: 1.5rem 0 0.5rem 0.75rem;
      font-weight: 600;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 0.75rem;
      border-radius: var(--radius-md);
      color: var(--text-light);
      margin-bottom: 0.25rem;
      transition: all 0.2s;
    }

    .nav-item:hover {
      background-color: rgba(255,255,255,0.05);
      color: white;
    }

    .nav-item.active {
      background-color: var(--primary-500);
      color: white;
    }

    .icon {
      /* using material icons text for now, assuming material font or similar loaded, 
         or just text placeholders if not loaded yet. layout handles spacing */
      font-family: 'Material Icons', sans-serif; 
      font-size: 1.25rem;
    }

    .badge {
      margin-left: auto;
      background-color: var(--primary-500);
      color: white;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 999px;
    }
    
    .nav-item.active .badge {
       background-color: white;
       color: var(--primary-500);
    }

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid rgba(255,255,255,0.05);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: var(--primary-500);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.85rem;
    }

    .info .name {
      color: white;
      font-size: 0.9rem;
      font-weight: 500;
    }
    .info .role {
      font-size: 0.75rem;
      color: var(--text-light);
    }
    
    .logout-btn {
      background: none;
      border: none;
      color: var(--text-light);
      padding: 0.5rem;
    }
    .logout-btn:hover {
      color: white;
    }

  `]
})
export class SidebarComponent { }
