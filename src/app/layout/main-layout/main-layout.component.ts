import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <div class="layout-wrapper">
      <app-sidebar class="sidebar"></app-sidebar>
      <main class="main-content">
        <!-- Header in internal layout is mostly for mobile toggle or specific actions -->
        <!-- For now leaving it blank or using sidebar for nav -->
        <div class="content-area">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .layout-wrapper {
      display: flex;
      min-height: 100vh;
      background-color: var(--secondary-100);
    }

    .sidebar {
      width: 260px;
      flex-shrink: 0;
      position: fixed;
      height: 100vh;
      background-color: var(--secondary-900); /* Dark sidebar as per creative */
      display: none;
    }

    @media (min-width: 1024px) {
      .sidebar {
        display: block;
      }
    }

    .main-content {
      flex: 1;
      margin-left: 0;
      display: flex;
      flex-direction: column;
    }

    @media (min-width: 1024px) {
      .main-content {
        margin-left: 260px;
      }
    }

    .content-area {
      padding: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
    }
  `]
})
export class MainLayoutComponent { }
