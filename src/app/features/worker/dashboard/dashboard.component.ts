import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
   selector: 'app-worker-dashboard',
   standalone: true,
   imports: [CommonModule, FormsModule],
   template: `
    <div class="dashboard-container">
      <header class="page-header">
         <div>
            <h1>Welcome back, Mike</h1>
            <div class="availability-toggle">
               <span class="status-indicator"></span>
               <span>Available for Work</span>
            </div>
         </div>
         <div class="header-actions">
           <div class="avatar-sm">MR</div>
         </div>
      </header>

      <div class="dashboard-grid">
        <!-- Main Content: Opportunities -->
        <div class="main-column">
          <div class="section-header">
             <h2>Nearby Opportunities</h2>
             <div class="filters">
               <button class="filter-btn" [class.active]="currentFilter === 'Nearest'" (click)="setFilter('Nearest')">Nearest</button>
               <button class="filter-btn" [class.active]="currentFilter === 'Highest Pay'" (click)="setFilter('Highest Pay')">Highest Pay</button>
               <button class="filter-btn" [class.active]="currentFilter === 'Urgent'" (click)="setFilter('Urgent')">Urgent</button>
             </div>
          </div>

          <div class="job-list">
             <div class="job-card" *ngFor="let job of jobs">
               <div class="job-header">
                  <div class="tags">
                     <span class="distance">{{ job.distance }} away</span>
                     <span class="tag-urgent" *ngIf="job.isUrgent">URGENT</span>
                  </div>
                  <div class="budget">
                     <span class="label">Client Budget</span>
                     <span class="value">{{ job.budget }}</span>
                  </div>
               </div>
               
               <h3>{{ job.title }}</h3>
               <p class="description">{{ job.description }}</p>
               <p class="tools-req" *ngIf="job.toolsRequired">Tools not provided.</p>

               <!-- Bidding Interface -->
               <div class="bid-interface">
                  <div class="slider-container">
                     <label>Your Bid</label>
                     <input type="range" min="0" [max]="job.budgetMax" [(ngModel)]="job.suggestedBid" class="bid-slider">
                  </div>
                  <div class="bid-input-group">
                     <span class="currency">₹</span>
                     <input type="number" [(ngModel)]="job.suggestedBid" class="bid-input">
                  </div>
                  <button class="btn btn-primary">Submit Bid</button>
               </div>
             </div>
          </div>
        </div>

        <!-- Sidebar: Stats -->
        <div class="stats-column">
           <!-- Reputation Card -->
           <div class="card reputation-card">
              <h3>Reputation</h3>
              <div class="trust-score-circle">
                 <div class="score">98</div>
                 <div class="label">TRUST SCORE</div>
              </div>
              <div class="badges-row">
                 <span class="badge-item">Verified</span>
                 <span class="badge-item">Fast Bidder</span>
                 <span class="badge-item">Top Rated</span>
              </div>
           </div>

           <!-- Earnings Card -->
           <div class="card earnings-card">
              <div class="card-header-row">
                 <h3>Earnings</h3>
                 <a href="#" class="link">View All</a>
              </div>
              <div class="earnings-summary">
                 <span class="period">This Week</span>
                 <div class="amount">₹12,450</div>
                 <div class="trend positive">+12% from last week</div>
              </div>
              <div class="stats-list">
                 <div class="stat-row">
                    <span>Completed Jobs</span>
                    <span>14</span>
                 </div>
                 <div class="stat-row">
                    <span>Pending Payment</span>
                    <span>₹2,400</span>
                 </div>
              </div>
           </div>

           <!-- Boost Card -->
           <div class="card boost-card">
              <h4>Boost Your Win Rate</h4>
              <p>Adding a personal message to your bid increases selection chance by 40%.</p>
           </div>
        </div>
      </div>
    </div>
  `,
   styles: [`
    .dashboard-container { padding-bottom: 2rem; }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    
    h1 { font-size: 1.75rem; margin-bottom: 0.5rem; }

    .availability-toggle {
       display: inline-flex;
       align-items: center;
       gap: 0.5rem;
       background: white;
       padding: 0.5rem 1rem;
       border-radius: 999px;
       font-size: 0.85rem;
       font-weight: 500;
       border: 1px solid rgba(0,0,0,0.05);
    }
    
    .status-indicator {
       width: 8px;
       height: 8px;
       background-color: var(--success);
       border-radius: 50%;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    
    @media (min-width: 1024px) {
       .dashboard-grid { grid-template-columns: 1fr 340px; }
    }

    /* Filters */
    .section-header {
       display: flex;
       justify-content: space-between;
       align-items: center;
       margin-bottom: 1.5rem;
    }
    
    .filters { display: flex; gap: 0.5rem; }
    
    .filter-btn {
       background: white;
       border: 1px solid var(--secondary-200);
       padding: 0.4rem 1rem;
       border-radius: 6px;
       font-size: 0.85rem;
       color: var(--text-medium);
    }
    
    .filter-btn.active {
       background: var(--text-dark);
       color: white;
       border-color: var(--text-dark);
    }

    /* Job Card */
    .job-card {
       background: white;
       border-radius: var(--radius-lg);
       padding: 1.5rem;
       border: 1px solid rgba(0,0,0,0.05);
       margin-bottom: 1.5rem;
       box-shadow: var(--shadow-sm);
    }
    
    .job-header {
       display: flex;
       justify-content: space-between;
       margin-bottom: 0.75rem;
    }
    
    .tags { display: flex; align-items: center; gap: 0.75rem; }
    .distance { background: #fee2e2; color: #991b1b; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; } /* Using raw colors for quick match */
    .tag-urgent { color: #DC2626; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; }

    .budget { text-align: right; }
    .budget .label { display: block; font-size: 0.7rem; color: var(--text-light); text-transform: uppercase; }
    .budget .value { font-weight: 700; font-size: 1.1rem; }

    .job-card h3 { font-size: 1.1rem; margin-bottom: 0.5rem; }
    .description { color: var(--text-medium); margin-bottom: 1rem; font-size: 0.9rem; line-height: 1.5; }
    .tools-req { font-size: 0.85rem; color: var(--text-light); font-style: italic; margin-bottom: 1.5rem; }

    /* Bid Interface */
    .bid-interface {
       background: #fafafa;
       padding: 1rem;
       border-radius: var(--radius-md);
       display: flex;
       align-items: center;
       gap: 1rem;
    }
    
    .slider-container { flex: 1; display: flex; align-items: center; gap: 1rem; }
    .slider-container label { font-size: 0.85rem; font-weight: 500; white-space: nowrap; }
    .bid-slider { flex: 1; accent-color: var(--primary-500); }
    
    .bid-input-group { 
       display: flex; 
       align-items: center; 
       background: white; 
       border: 1px solid var(--secondary-200); 
       border-radius: 4px; 
       padding: 0.5rem 0.75rem;
       width: 110px;
    }
    .currency { color: var(--text-light); margin-right: 0.25rem; font-size: 0.9rem; }
    .bid-input { 
       border: none; 
       width: 100%; 
       font-weight: 600; 
       font-size: 1rem; 
       outline: none; 
    }
    
    /* Stats Column */
    .stats-column { display: flex; flex-direction: column; gap: 1.5rem; }
    
    .reputation-card {
       text-align: center;
    }
    
    .trust-score-circle {
       width: 120px;
       height: 120px;
       border-radius: 50%;
       border: 8px solid #D1FAE5; /* Light green ring */
       border-top-color: #10B981; /* Success Green */
       margin: 1.5rem auto;
       display: flex;
       flex-direction: column;
       align-items: center;
       justify-content: center;
    }
    
    .score { font-size: 2.5rem; font-weight: 700; color: var(--secondary-900); line-height: 1; }
    .trust-score-circle .label { font-size: 0.6rem; font-weight: 700; color: var(--text-light); margin-top: 0.25rem; }

    .badges-row {
       display: flex;
       justify-content: space-around;
       font-size: 0.75rem;
       color: var(--text-light);
       border-top: 1px solid var(--secondary-100);
       padding-top: 1rem;
    }

    .earnings-card .card-header-row {
       display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;
    }
    .link { font-size: 0.8rem; color: var(--primary-600); font-weight: 500; }
    
    .earnings-summary { margin-bottom: 2rem; }
    .period { font-size: 0.9rem; color: var(--text-medium); display: block; margin-bottom: 0.5rem; }
    .earnings-summary .amount { font-size: 2.5rem; font-weight: 700; color: var(--secondary-900); line-height: 1; margin-bottom: 0.5rem; }
    .trend { font-size: 0.8rem; font-weight: 500; }
    .trend.positive { color: var(--success); }
    
    .stat-row { display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 0.75rem; }
    .stat-row span:last-child { font-weight: 600; }

    .boost-card {
       background: #E0F2F1; /* Teal-ish tint */
       border: none;
    }
    .boost-card h4 { color: #00695C; margin-bottom: 0.5rem; }
    .boost-card p { font-size: 0.85rem; color: #004D40; line-height: 1.5; }

  `]
})
export class WorkerDashboardComponent {
   currentFilter = 'Nearest';

   jobs: any[] = [];
   allJobs: any[] = []; // Store fetched jobs

   constructor(private taskService: TaskService, public authService: AuthService) { }

   async ngOnInit() {
      const user = this.authService.currentUser();
      if (user) {
         this.allJobs = await this.taskService.getNearbyTasks(user.id);
         this.applyFilter();
      }
   }

   setFilter(filter: string) {
      this.currentFilter = filter;
      this.applyFilter();
   }

   applyFilter() {
      let tempJobs = [...this.allJobs];

      switch (this.currentFilter) {
         case 'Nearest':
            // Distance sorting requires distance value in number. 
            // My mock task service added proper string 'distance', but we might need real int.
            // For now, let's skip sort or assume distance parsing
            tempJobs.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
            break;
         case 'Highest Pay':
            tempJobs.sort((a, b) => b.minBudget - a.minBudget);
            break;
         case 'Urgent':
            tempJobs = this.allJobs.filter(job => job.isUrgent);
            break;
      }
      this.jobs = tempJobs;
   }
}
import { TaskService } from '../../../core/services/task.service';
import { AuthService } from '../../../core/services/auth.service';
