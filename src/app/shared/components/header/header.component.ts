import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="container header-content">
        <!-- Logo -->
        <a routerLink="/" class="logo">
          <i class="bi bi-check-square-fill logo-icon"></i>
          <span class="logo-text">FixItUp</span>
        </a>

        <!-- Desktop Navigation -->
        <nav class="nav-links" *ngIf="isPublic">
          <a routerLink="/how-it-works" routerLinkActive="active">How It Works</a>
          <a routerLink="/tasks" routerLinkActive="active">Browse Tasks</a>
          <a routerLink="/for-workers" routerLinkActive="active">For Workers</a>
        </nav>

        <!-- Auth Actions / User Menu -->
        <div class="header-actions">
          <ng-container *ngIf="isPublic; else authenticatedView">
            <a routerLink="/login" class="btn btn-ghost">Sign In</a>
            <a routerLink="/register" class="btn btn-primary">Register</a>
          </ng-container>
          
          <ng-template #authenticatedView>
             <!-- Placeholder for authenticated user actions (Notifications, Profile) -->
             <button class="btn btn-ghost">
                <span class="material-icons">notifications</span>
             </button>
             <div class="user-avatar">
               <img src="assets/avatar-placeholder.png" alt="User" />
             </div>
          </ng-template>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background-color: white;
      border-bottom: 1px solid var(--secondary-200, #e5e7eb);
      height: 72px;
      display: flex;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 700;
      font-size: 1.5rem;
      color: var(--secondary-900);
      font-family: var(--font-display);
    }

    .logo-icon {
      font-size: 1.75rem;
      color: var(--primary-500);
      line-height: 1;
    }

    .nav-links {
      display: none;
      gap: 2rem;
    }
    
    @media (min-width: 768px) {
      .nav-links {
        display: flex;
      }
    }

    .nav-links a {
      color: var(--text-medium);
      font-weight: 500;
      font-size: 0.95rem;
    }

    .nav-links a:hover, .nav-links a.active {
      color: var(--primary-500);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .user-avatar img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--primary-100);
    }
  `]
})
export class HeaderComponent {
  @Input() isPublic = false;
}
