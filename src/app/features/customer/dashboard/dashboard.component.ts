import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-customer-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="dashboard-container">
      <header class="page-header">
        <h1>Good morning, Priya</h1>
        <p>You have 2 active tasks and 1 completed task pending review.</p>
        <button class="btn btn-primary">Post a New Task</button>
      </header>

      <div class="dashboard-grid">
        <!-- Task List (Master) -->
        <div class="task-list-column">
          <h3>Your Tasks</h3>
          
          <div class="task-cards">
            <div 
              class="task-summary-card" 
              *ngFor="let task of tasks" 
              [class.active]="selectedTask?.id === task.id"
              (click)="selectTask(task)"
            >
              <div class="status-badge" [ngClass]="task.statusClass">{{ task.statusLabel }}</div>
              <span class="time-ago">{{ task.timeAgo }}</span>
              
              <h4>{{ task.title }}</h4>
              <p class="location">{{ task.location }}</p>
              
              <div class="meta" *ngIf="task.bidsCount > 0">
                 <span class="bids-count">{{ task.bidsCount }} New Bids</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Task Details (Detail) -->
        <div class="task-detail-column" *ngIf="selectedTask">
          <div class="detail-card">
            <div class="detail-header">
              <div>
                <h2>{{ selectedTask.title }}</h2>
                <div class="detail-sub">
                  <span>{{ selectedTask.location }}</span>
                  <span class="divider">•</span>
                  <span>Posted {{ selectedTask.postedDate }}</span>
                </div>
              </div>
              <button class="btn btn-ghost btn-icon"><span class="material-icons">more_vert</span></button>
            </div>

            <p class="description">{{ selectedTask.description }}</p>

            <!-- Status Timeline -->
            <div class="timeline-container">
              <div class="timeline-track">
                <div class="track-fill" [style.width]="selectedTask.progress + '%'"></div>
              </div>
              <div class="timeline-steps">
                <div class="step" [class.completed]="selectedTask.progress >= 0">
                  <span class="step-label">Posted</span>
                </div>
                <div class="step" [class.active-step]="selectedTask.status === 'bidding'" [class.completed]="selectedTask.progress >= 33">
                  <span class="step-label">Bidding</span>
                </div>
                <div class="step" [class.active-step]="selectedTask.status === 'in_progress'" [class.completed]="selectedTask.progress >= 66">
                  <span class="step-label">In Progress</span>
                </div>
                <div class="step" [class.completed]="selectedTask.progress >= 100">
                  <span class="step-label">Done</span>
                </div>
              </div>
            </div>

            <!-- Bids Section -->
            <div class="bids-section" *ngIf="selectedTask.status === 'bidding'">
              <div class="bids-header">
                <h3>Bids Received ({{ selectedTask.bids.length }})</h3>
                <span class="sort-by">Sort by: Best Value</span>
              </div>

              <div class="bid-card" *ngFor="let bid of selectedTask.bids">
                <div class="bidder-info">
                   <div class="avatar-circle">
                      <img [src]="bid.avatarUrl" alt="">
                   </div>
                   <div class="bidder-details">
                     <div class="name-row">
                       <span class="name">{{ bid.workerName }}</span>
                       <span class="badge-top-rated" *ngIf="bid.isTopRated">TOP RATED</span>
                     </div>
                     <div class="stats-row">
                       <span class="rating">★ {{ bid.rating }} <span class="count">({{ bid.reviewCount }} reviews)</span></span>
                       <span class="jobs">{{ bid.jobsCompleted }} Jobs</span>
                     </div>
                   </div>
                </div>

                <div class="bid-offer">
                  <div class="price-box">
                    <span class="amount">\${{ bid.amount }}</span>
                    <span class="type">{{ bid.priceType }}</span>
                  </div>
                  <div class="actions">
                     <button class="btn btn-outline btn-sm">Chat</button>
                     <button class="btn btn-primary btn-sm">Accept</button>
                  </div>
                </div>
              </div>
              
              <div class="view-more-bids">
                <a href="javascript:void(0)">View 2 more bids</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .dashboard-container {
      padding-bottom: 2rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    
    .page-header h1 { font-size: 1.75rem; color: var(--secondary-900); margin-bottom: 0.5rem; }
    .page-header p { color: var(--text-medium); margin-bottom: 0; }
    .page-header .btn { margin-left: auto; }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    @media (min-width: 1024px) {
      .dashboard-grid {
        grid-template-columns: 350px 1fr;
      }
    }

    /* Task List Column */
    .task-list-column h3 {
      font-size: 1.1rem;
      margin-bottom: 1rem;
      color: var(--secondary-900);
    }

    .task-summary-card {
      background: white;
      border: 1px solid transparent;
      border-radius: var(--radius-md);
      padding: 1.25rem;
      margin-bottom: 1rem;
      cursor: pointer;
      border: 1px solid rgba(0,0,0,0.05);
      transition: all 0.2s;
      position: relative;
    }
    
    .task-summary-card:hover {
      box-shadow: var(--shadow-sm);
      transform: translateY(-2px);
    }

    .task-summary-card.active {
      border-color: var(--primary-500);
      box-shadow: 0 0 0 1px var(--primary-500);
    }

    .status-badge {
      display: inline-block;
      font-size: 0.7rem;
      padding: 0.2rem 0.5rem;
      border-radius: 999px;
      font-weight: 600;
      margin-bottom: 0.75rem;
    }
    
    .status-bidding { background: #E0F2FE; color: #0284C7; }
    .status-progress { background: #DCFCE7; color: #16A34A; }
    .status-completed { background: #F3F4F6; color: #4B5563; }

    .time-ago {
      position: absolute;
      top: 1.25rem;
      right: 1.25rem;
      font-size: 0.8rem;
      color: var(--text-light);
    }

    .task-summary-card h4 {
      font-size: 1rem;
      margin-bottom: 0.25rem;
      color: var(--secondary-900);
    }
    
    .location {
      font-size: 0.85rem;
      color: var(--text-medium);
      margin-bottom: 1rem;
    }
    
    .bids-count {
       font-size: 0.8rem;
       color: var(--primary-600);
       font-weight: 600;
    }

    /* Details Column */
    .detail-card {
      background: white;
      border-radius: var(--radius-lg);
      padding: 2rem;
      box-shadow: var(--shadow-sm);
    }
    
    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }
    .detail-header h2 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    .detail-sub { font-size: 0.9rem; color: var(--text-medium); display: flex; gap: 0.5rem; }
    
    .description {
      color: var(--text-medium);
      line-height: 1.6;
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--secondary-100);
    }

    /* Timeline */
    .timeline-container {
      margin-bottom: 3rem;
      position: relative;
    }
    
    .timeline-track {
      height: 4px;
      background: var(--secondary-100);
      width: 100%;
      position: absolute;
      top: 50%;
      z-index: 1;
      transform: translateY(-50%);
    }
    
    .track-fill {
      height: 100%;
      background: var(--primary-500);
      transition: width 0.3s;
    }

    .timeline-steps {
      display: flex;
      justify-content: space-between;
      position: relative;
      z-index: 2;
    }
    
    .step {
      text-align: center;
      background: white;
      padding: 0 0.5rem;
    }
    
    .step-label {
      display: block;
      font-size: 0.8rem;
      color: var(--text-light);
      margin-top: 1rem;
      font-weight: 500;
      position: relative;
    }
    
    /* Using pseudo elements for dots? using simple text for now to match structure */
    
    .active-step .step-label { color: var(--primary-500); font-weight: 700; }
    .completed .step-label { color: var(--secondary-900); }


    /* Bids */
    .bids-header { 
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .sort-by { font-size: 0.85rem; color: var(--text-medium); font-weight: 500; }

    .bid-card {
      border: 1px solid var(--secondary-200);
      border-radius: var(--radius-md);
      padding: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
    
    .bidder-info { display: flex; gap: 1rem; align-items: center; }
    
    .avatar-circle {
      width: 48px; 
      height: 48px;
      border-radius: 50%;
      overflow: hidden;
      background: #ccc;
    }
    .avatar-circle img { width: 100%; height: 100%; object-fit: cover; }
    
    .name-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem; }
    .name { font-weight: 600; color: var(--secondary-900); }
    .badge-top-rated { 
      font-size: 0.6rem; 
      background: #D97706; 
      color: white; 
      padding: 0.1rem 0.3rem; 
      border-radius: 3px; 
      font-weight: 700; 
    }
    
    .stats-row { font-size: 0.8rem; color: var(--text-medium); }
    .rating { color: var(--secondary-800); font-weight: 600; }
    .count { font-weight: 400; color: var(--text-light); margin-left: 0.25rem; }
    .jobs { margin-left: 0.75rem; padding-left: 0.75rem; border-left: 1px solid var(--secondary-200); }

    .bid-offer {
      text-align: right;
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }
    
    .price-box { margin-right: 0.5rem; }
    .amount { display: block; font-size: 1.1rem; font-weight: 700; color: var(--secondary-900); }
    .type { font-size: 0.75rem; color: var(--text-light); }
    
    .actions { display: flex; gap: 0.5rem; }
    
    .view-more-bids {
      text-align: center;
      font-size: 0.85rem;
      padding-top: 1rem;
    }
    .view-more-bids a { color: var(--primary-600); font-weight: 600; }

  `]
})
export class CustomerDashboardComponent {

    tasks = [
        {
            id: 1,
            title: 'Master Bathroom Plumbing Fix',
            location: 'Downtown, Apt 4B',
            timeAgo: '2h ago',
            status: 'bidding',
            statusLabel: 'Receiving Bids',
            statusClass: 'status-bidding',
            bidsCount: 5,
            description: 'Looking for a certified plumber to fix a leaking pipe under the sink. Need it done urgently before the weekend. Please bring tools.',
            postedDate: 'Oct 24',
            progress: 33, // Bidding
            bids: [
                {
                    workerName: 'Alex Miller',
                    isTopRated: true,
                    rating: 4.9,
                    reviewCount: 124,
                    jobsCompleted: 142,
                    amount: 85,
                    priceType: 'Fixed Price',
                    avatarUrl: 'assets/mock-user-1.jpg'
                },
                {
                    workerName: 'Sarah Jenning',
                    isTopRated: false,
                    rating: 4.7,
                    reviewCount: 45,
                    jobsCompleted: 58,
                    amount: 70,
                    priceType: 'Est. 2 hrs',
                    avatarUrl: 'assets/mock-user-2.jpg'
                },
                {
                    workerName: 'David Chen',
                    isTopRated: false,
                    rating: 4.5,
                    reviewCount: 210,
                    jobsCompleted: 305,
                    amount: 95,
                    priceType: 'Fixed Price',
                    avatarUrl: 'assets/mock-user-3.jpg'
                }
            ]
        },
        {
            id: 2,
            title: 'Living Room Wall Painting',
            location: 'Scheduled: Tomorrow, 10am',
            timeAgo: '1d ago',
            status: 'in_progress',
            statusLabel: 'In Progress',
            statusClass: 'status-progress',
            bidsCount: 0,
            description: 'Need walls painted in eggshell white. Paint provided.',
            postedDate: 'Oct 23',
            progress: 66,
            bids: []
        },
        {
            id: 3,
            title: 'Garage Door Maintenance',
            location: 'Completed',
            timeAgo: '5d ago',
            status: 'completed',
            statusLabel: 'Completed',
            statusClass: 'status-completed',
            bidsCount: 0,
            description: 'Regular maintenance check for garage door.',
            postedDate: 'Oct 18',
            progress: 100,
            bids: []
        }
    ];

    selectedTask: any = this.tasks[0];

    selectTask(task: any) {
        this.selectedTask = task;
    }
}
