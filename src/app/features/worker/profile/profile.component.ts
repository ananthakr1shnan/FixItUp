import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-worker-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="logo-container">
            <div class="logo-icon"></div>
            <span class="logo-text">FixItUp</span>
          </div>
        </div>
        
        <nav class="sidebar-nav">
          <button class="nav-item" (click)="navigateTo('dashboard')">
            Dashboard
          </button>
          <button class="nav-item" (click)="navigateTo('my-jobs')">
            My Jobs
          </button>
          <button class="nav-item" (click)="navigateTo('find-work')">
            Find Work
          </button>
          <button class="nav-item" (click)="navigateTo('messages')">
            Messages
          </button>
          <button class="nav-item" (click)="navigateTo('earnings')">
            Earnings
          </button>
          <button class="nav-item active">
            Profile
          </button>
        </nav>
      </aside>

      <!-- Main Content -->
      <div class="main-content">
        <header class="page-header">
          <h1>My Profile</h1>
          <div class="header-actions">
            <button class="btn-outline">Share Profile</button>
            <button class="btn-primary">Edit Details</button>
          </div>
        </header>

        <div class="profile-container">
          <!-- Profile Card -->
          <div class="profile-card">
            <div class="profile-main">
              <div class="avatar-large">
                {{ userInitials }}
              </div>
              <div class="profile-info">
                <div class="profile-header">
                  <h2>{{ userName }}</h2>
                  <span class="verified-badge">Verified Pro</span>
                </div>
                <div class="profile-stats">
                  <div class="rating-box">
                    <span class="rating-value">{{ rating }}</span>
                  </div>
                  <span class="reviews-count">{{ reviewCount }} Reviews</span>
                  <span class="member-since">Member since {{ memberSince }}</span>
                </div>
                <p class="profile-bio">
                  Experienced general contractor specializing in custom carpentry, 
                  furniture assembly, and home repairs. I take pride in clean work sites 
                  and attention to detail. Licensed and insured in the greater metro area.
                </p>
                <div class="skills-tags">
                  <span class="skill-tag">Carpentry</span>
                  <span class="skill-tag">Furniture Assembly</span>
                  <span class="skill-tag">Plumbing</span>
                  <span class="skill-tag">Home Repairs</span>
                  <span class="skill-tag">Drywall</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Side Panel -->
          <div class="side-panel">
            <!-- Accepting Jobs Card -->
            <div class="card">
              <div class="card-header">
                <h3>Accepting New Jobs</h3>
                <label class="toggle-switch">
                  <input type="checkbox" [checked]="acceptingJobs()" (change)="toggleAcceptingJobs()">
                  <span class="slider"></span>
                </label>
              </div>
              <p class="card-subtitle">Visible in search results</p>
            </div>

            <!-- Performance Card -->
            <div class="card">
              <h3>Performance</h3>
              <div class="stat-row">
                <span class="stat-label">Job Completion</span>
                <span class="stat-value">98%</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">On-Time Arrival</span>
                <span class="stat-value">100%</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Repeat Hires</span>
                <span class="stat-value">42%</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Avg. Response</span>
                <span class="stat-value">~25 mins</span>
              </div>
            </div>

            <!-- Verifications Card -->
            <div class="card">
              <h3>Verifications</h3>
              <div class="verification-item">
                <i class="check-icon">✓</i>
                <span>Identity Verified</span>
              </div>
            </div>
          </div>

          <!-- Featured Work Section -->
          <div class="featured-work">
            <div class="section-header">
              <h3>Featured Work</h3>
              <button class="btn-link">+ Add Photos</button>
            </div>
            <div class="work-gallery">
              <div class="work-placeholder">
                <p>No featured work yet. Add photos of your best projects!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Layout */
    .dashboard-layout {
      display: flex;
      min-height: 100vh;
      background: #F5F5F5;
    }

    /* Sidebar */
    .sidebar {
      width: 280px;
      background: #2C2C2C;
      color: white;
      position: fixed;
      left: 0;
      top: 0;
      height: 100vh;
      display: flex;
      flex-direction: column;
      z-index: 100;
    }

    .sidebar-header {
      padding: 2rem 1.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-icon {
      width: 36px;
      height: 36px;
      background: #8B4513;
      border-radius: 8px;
    }

    .logo-text {
      font-size: 1.5rem;
      font-weight: bold;
      color: white;
    }

    .sidebar-nav {
      flex: 1;
      padding: 2rem 0;
    }

    .nav-item {
      width: 100%;
      padding: 1rem 2rem;
      background: transparent;
      border: none;
      color: rgba(255,255,255,0.6);
      text-align: left;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      border-left: 4px solid transparent;
    }

    .nav-item:hover {
      background: rgba(255,255,255,0.05);
      color: white;
    }

    .nav-item.active {
      background: rgba(139,69,19,0.2);
      color: white;
      border-left-color: #8B4513;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      margin-left: 280px;
      background: #F5F5F5;
    }

    .page-header {
      background: white;
      padding: 2rem;
      border-bottom: 1px solid #E0E0E0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    h1 {
      font-size: 2rem;
      margin: 0;
      font-weight: 600;
      color: #1A1A1A;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    .btn-outline {
      padding: 0.75rem 1.5rem;
      border: 1px solid #E0E0E0;
      background: white;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-outline:hover {
      background: #F5F5F5;
    }

    .btn-primary {
      padding: 0.75rem 1.5rem;
      background: #8B4513;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary:hover {
      background: #6F3710;
    }

    /* Profile Container */
    .profile-container {
      padding: 2rem;
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 2rem;
      max-width: 1400px;
    }

    .profile-card {
      background: white;
      border-radius: 12px;
      padding: 2.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      grid-column: 1;
    }

    .profile-main {
      display: flex;
      gap: 2rem;
    }

    .avatar-large {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, #8B4513, #A0522D);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      font-weight: bold;
      flex-shrink: 0;
    }

    .profile-info {
      flex: 1;
    }

    .profile-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    h2 {
      font-size: 2rem;
      margin: 0;
      font-weight: 600;
      color: #1A1A1A;
    }

    .verified-badge {
      background: #E8F5E9;
      color: #2E7D32;
      padding: 0.375rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .profile-stats {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
      color: #666;
      font-size: 0.95rem;
    }

    .rating-box {
      background: #1A1A1A;
      color: white;
      padding: 0.375rem 0.875rem;
      border-radius: 6px;
      font-weight: 600;
    }

    .rating-value {
      font-size: 1rem;
    }

    .profile-bio {
      color: #666;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .skills-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .skill-tag {
      background: #F5F5F5;
      color: #333;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
    }

    /* Side Panel */
    .side-panel {
      grid-column: 2;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .card h3 {
      font-size: 1.125rem;
      margin: 0 0 1rem 0;
      font-weight: 600;
      color: #1A1A1A;
    }

    .card-subtitle {
      color: #666;
      font-size: 0.875rem;
      margin: 0;
    }

    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 48px;
      height: 24px;
    }

    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: 0.4s;
      border-radius: 24px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.4s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: #4CAF50;
    }

    input:checked + .slider:before {
      transform: translateX(24px);
    }

    .stat-row {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid #F0F0F0;
    }

    .stat-row:last-child {
      border-bottom: none;
    }

    .stat-label {
      color: #666;
      font-size: 0.95rem;
    }

    .stat-value {
      font-weight: 600;
      color: #1A1A1A;
    }

    .verification-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 0;
    }

    .check-icon {
      width: 24px;
      height: 24px;
      background: #4CAF50;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
    }

    /* Featured Work */
    .featured-work {
      grid-column: 1 / -1;
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .section-header h3 {
      font-size: 1.25rem;
      margin: 0;
      font-weight: 600;
      color: #1A1A1A;
    }

    .btn-link {
      background: none;
      border: none;
      color: #8B4513;
      font-weight: 500;
      cursor: pointer;
      font-size: 0.95rem;
    }

    .btn-link:hover {
      text-decoration: underline;
    }

    .work-gallery {
      min-height: 200px;
    }

    .work-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 200px;
      background: #F9F9F9;
      border: 2px dashed #E0E0E0;
      border-radius: 8px;
      color: #999;
    }

    @keyframes fadeIn {
       from { opacity: 0; transform: translateY(10px); }
       to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class WorkerProfileComponent implements OnInit {
  acceptingJobs = signal(true);
  
  userName = 'Marcus Thorne';
  userInitials = 'MT';
  rating = '4.9';
  reviewCount = 142;
  memberSince = '2021';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.userName = user.fullName;
      this.userInitials = user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    }
  }

  navigateTo(section: string) {
    switch(section) {
      case 'dashboard':
      case 'find-work':
        this.router.navigate(['/worker/dashboard']);
        break;
      case 'my-jobs':
        this.router.navigate(['/worker/dashboard'], { queryParams: { tab: 'myJobs' } });
        break;
      case 'messages':
        this.router.navigate(['/worker/dashboard'], { queryParams: { tab: 'messages' } });
        break;
      case 'earnings':
        this.router.navigate(['/worker/dashboard'], { queryParams: { tab: 'earnings' } });
        break;
    }
  }

  toggleAcceptingJobs() {
    this.acceptingJobs.set(!this.acceptingJobs());
  }
}
