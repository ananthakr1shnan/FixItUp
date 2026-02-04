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
               <div class="timeline-segments">
                  <!-- Posted -->
                  <div class="segment-group">
                     <div class="segment-bar completed"></div>
                     <span class="step-label">Posted</span>
                  </div>
                  
                  <!-- Bidding -->
                  <div class="segment-group">
                     <div class="segment-bar" [class.completed]="selectedTask.progress >= 33" [class.active]="selectedTask.status === 'Bidding'"></div>
                     <span class="step-label" [class.active-text]="selectedTask.status === 'Bidding'">Bidding</span>
                  </div>

                  <!-- In Progress -->
                  <div class="segment-group">
                     <div class="segment-bar" [class.completed]="selectedTask.progress >= 66" [class.active]="selectedTask.status === 'InProgress'"></div>
                     <span class="step-label" [class.active-text]="selectedTask.status === 'InProgress'">In Progress</span>
                  </div>

                  <!-- Done -->
                  <div class="segment-group">
                     <div class="segment-bar" [class.completed]="selectedTask.progress >= 100"></div>
                     <span class="step-label">Done</span>
                  </div>
               </div>
            </div>

            <!-- Bids List -->
            <div class="bids-list">
              <!-- Bid 1 -->
              <div class="bid-card">
                <div class="bid-worker">
                  <div class="worker-avatar">
                     <img src="assets/avatar-placeholder.png" alt="Alex Miller">
                     <div class="badge-top-rated">TOP RATED</div>
                  </div>
                  <div class="worker-info">
                    <h3>Alex Miller</h3>
                    <div class="rating">
                       <i class="bi bi-star-fill"></i> 4.9 <span class="review-count">(124 reviews)</span>
                       <span class="jobs-count">142 Jobs</span>
                    </div>
                  </div>
                </div>
                <div class="bid-actions">
                   <div class="bid-price">
                      <span class="amount">₹650</span>
                      <span class="type">Fixed Price</span>
                   </div>
                   <button class="btn btn-outline" (click)="chatWithWorker(1)">Chat</button>
                   <button class="btn btn-primary" (click)="acceptBid(1)">Accept</button>
                </div>
              </div>

              <!-- Bid 2 -->
              <div class="bid-card">
                <div class="bid-worker">
                  <div class="worker-avatar">
                     <img src="assets/avatar-placeholder.png" alt="Sarah Jenning">
                  </div>
                  <div class="worker-info">
                    <h3>Sarah Jenning</h3>
                    <div class="rating">
                       <i class="bi bi-star-fill"></i> 4.7 <span class="review-count">(45 reviews)</span>
                       <span class="jobs-count">58 Jobs</span>
                    </div>
                  </div>
                </div>
                <div class="bid-actions">
                   <div class="bid-price">
                      <span class="amount">₹500</span>
                      <span class="type">Est. 2 hrs</span>
                   </div>
                   <button class="btn btn-outline" (click)="chatWithWorker(2)">Chat</button>
                   <button class="btn btn-primary" (click)="acceptBid(2)">Accept</button>
                </div>
              </div>

              <!-- Bid 3 -->
              <div class="bid-card">
                <div class="bid-worker">
                  <div class="worker-avatar">
                     <img src="assets/avatar-placeholder.png" alt="David Chen">
                  </div>
                  <div class="worker-info">
                    <h3>David Chen</h3>
                    <div class="rating">
                       <i class="bi bi-star-fill"></i> 4.5 <span class="review-count">(210 reviews)</span>
                       <span class="jobs-count">305 Jobs</span>
                    </div>
                  </div>
                </div>
                <div class="bid-actions">
                   <div class="bid-price">
                      <span class="amount">₹750</span>
                      <span class="type">Fixed Price</span>
                   </div>
                   <button class="btn btn-outline" (click)="chatWithWorker(3)">Chat</button>
                   <button class="btn btn-primary" (click)="acceptBid(3)">Accept</button>
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
  `,
  styles: [`
    .dashboard-container {
      padding-bottom: 2rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2.5rem;
    }
    
    .page-header h1 { 
        font-size: 2rem; 
        color: var(--secondary-900); 
        margin-bottom: 0.5rem; 
        font-weight: 700;
        letter-spacing: -0.5px;
    }
    .page-header p { color: var(--text-medium); margin-bottom: 0; font-size: 1.05rem; }
    
    .page-header .btn-primary { 
        background-color: var(--primary-500); 
        padding: 0.85rem 1.5rem;
        font-size: 1rem;
        box-shadow: var(--shadow-md);
    }
    .page-header .btn-primary:hover { background-color: var(--primary-600); }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    @media (min-width: 1024px) {
      .dashboard-grid {
        grid-template-columns: 420px 1fr; /* Wider list column per mockup */
      }
    }

    /* Task List Column */
    .task-list-column h3 {
      font-size: 1.1rem;
      margin-bottom: 1.25rem;
      color: var(--secondary-900);
      font-weight: 700;
    }

    .task-summary-card {
      background: white;
      border: 1px solid white; /* Default border matching bg */
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      margin-bottom: 1.25rem;
      cursor: pointer;
      box-shadow: var(--shadow-sm);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }
    
    .task-summary-card:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    .task-summary-card.active {
      border: 2px solid var(--primary-500); /* Distinct brown border */
      box-shadow: var(--shadow-md);
    }

    .status-badge {
      display: inline-block;
      font-size: 0.75rem;
      padding: 0.25rem 0.75rem;
      border-radius: 6px;
      font-weight: 600;
      margin-bottom: 1rem;
    }
    
    .status-bidding { background: #E0F2FE; color: #0369A1; }
    .status-progress { background: #DCFCE7; color: #15803D; }
    .status-completed { background: #F3F4F6; color: #374151; }

    .time-ago {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      font-size: 0.85rem;
      color: var(--text-light);
    }

    .task-summary-card h4 {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
      color: var(--secondary-900);
      font-weight: 700;
    }
    
    .location {
      font-size: 0.9rem;
      color: var(--text-medium);
      margin-bottom: 1rem;
    }
    
    .bids-count {
       font-size: 0.85rem;
       color: var(--primary-500);
       font-weight: 700;
    }

    /* Details Column */
    .detail-card {
      background: white;
      border-radius: var(--radius-lg);
      padding: 2.5rem;
      box-shadow: var(--shadow-lg); /* More depth for main card */
      height: 100%;
    }
    
    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
    }
    .detail-header h2 { font-size: 1.75rem; margin-bottom: 0.5rem; color: var(--secondary-900); }
    .detail-sub { font-size: 0.95rem; color: var(--text-light); display: flex; gap: 0.5rem; align-items: center; }
    .divider { font-size: 0.5rem; opacity: 0.5; }
    
    .description {
      color: var(--text-medium);
      line-height: 1.6;
      margin-bottom: 2.5rem;
      padding-bottom: 2.5rem;
      border-bottom: 1px solid var(--secondary-200);
      font-size: 1rem;
    }

    /* Timeline */
    .timeline-container {
      margin-bottom: 3.5rem;
      padding: 0;
    }

    .timeline-segments {
      display: flex;
      gap: 0.5rem; /* Space between bars */
      width: 100%;
    }

    .segment-group {
      flex: 1;
      display: flex;
      flex-direction: column;
       /* Align label to start or center? Image seems to align left or center relative to bar. 
          The bar is full width of the segment. 
          Let's try standard flex column. */
    }

    .segment-bar {
      height: 6px;
      background-color: var(--secondary-200);
      border-radius: 4px;
      margin-bottom: 0.75rem;
      width: 100%;
    }

    .segment-bar.completed {
      background-color: #8D3B23; /* Terracotta */
      opacity: 0.4; /* Past steps slightly faded or solid? Image shows solid for current, solid for past? 
                     Actually image shows:
                     Posted: Brown Line
                     Bidding: Brown Line (Active Text Red/Brown)
                     In Progress: Grey Line
                     Done: Grey Line
                                 */
      background-color: var(--primary-500);
    }
    
    .segment-bar.active {
       background-color: var(--primary-500);
    }

    .step-label {
      font-size: 0.8rem;
      color: var(--text-light);
      font-weight: 500;
      /* Align text to the start of the bar usually, or center? 
         Image shows text aligned to left of its segment mostly. */
    }

    .active-text {
      color: var(--primary-500);
      font-weight: 700;
    }

    /* Bids */
    .bids-header { 
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .bids-header h3 { font-size: 1.25rem; color: var(--secondary-900); }
    .sort-by { font-size: 0.85rem; color: var(--primary-500); font-weight: 600; cursor: pointer; }

    .bid-card {
      border: 1px solid var(--secondary-200);
      border-radius: var(--radius-md);
      padding: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
      transition: all 0.2s;
    }
    
    .bid-card:hover {
        border-color: var(--primary-500);
        background: #FFFAF8; /* Very pleasant faint terracotta tint */
    }
    
    .bidder-info { display: flex; gap: 1rem; align-items: center; }
    
    .avatar-circle {
      width: 56px; 
      height: 56px;
      border-radius: 50%;
      overflow: hidden;
      background: #ccc;
    }
    .avatar-circle img { width: 100%; height: 100%; object-fit: cover; }
    
    .name-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.25rem; }
    .name { font-weight: 700; color: var(--secondary-900); font-size: 1.05rem; }
    .badge-top-rated { 
      font-size: 0.6rem; 
      background: #D97706; 
      color: white; 
      padding: 0.15rem 0.4rem; 
      border-radius: 4px; 
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    
    .stats-row { font-size: 0.85rem; color: var(--text-medium); }
    .rating { color: var(--secondary-900); font-weight: 600; }
    .count { font-weight: 400; color: var(--text-light); margin-left: 0.25rem; }
    .jobs { 
        margin-left: 0.75rem; 
        padding-left: 0.75rem; 
        border-left: 1px solid var(--secondary-200); 
        background: #F3F4F6;
        padding: 0.1rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--secondary-800);
        border: none;
    }

    .bid-offer {
      text-align: right;
      display: flex;
      gap: 2rem;
      align-items: center;
    }
    
    .price-box { margin-right: 0.5rem; text-align: right; }
    .amount { display: block; font-size: 1.25rem; font-weight: 800; color: var(--secondary-900); }
    .type { font-size: 0.75rem; color: var(--text-light); }
    
    .actions { display: flex; gap: 0.75rem; }
    
    .btn-outline { border: 1px solid var(--secondary-200); color: var(--secondary-900); font-weight: 600; padding: 0.5rem 1rem;}
    .btn-outline:hover { background: var(--secondary-100); }
    
    .actions .btn-primary { 
        background-color: #8D3B23; /* Dark button */
        padding: 0.5rem 1.25rem;
        font-weight: 600;
        border-radius: var(--radius-md);
    } 
    
    .view-more-bids {
      text-align: center;
      font-size: 0.9rem;
      padding-top: 1.5rem;
    }
    .view-more-bids a { color: var(--primary-500); font-weight: 700; text-decoration: none; }
    .view-more-bids a:hover { text-decoration: underline; }

  `]
})
export class CustomerDashboardComponent {

  tasks: any[] = [
    {
      id: 1,
      title: 'Master Bathroom Plumbing Fix',
      location: 'Downtown, Apt 4B',
      timeAgo: '2h ago',
      status: 'Bidding',
      statusLabel: 'Receiving Bids',
      statusClass: 'status-bidding',
      bidsCount: 5,
      description: 'Looking for a certified plumber to fix a leaking pipe under the sink. Need it done urgently before the weekend. Please bring tools.',
      postedDate: 'Oct 24',
      progress: 33, // Bidding
      category: 'Plumbing',
      isUrgent: true,
      bids: [
        {
          bidId: 101,
          workerName: 'Alex Miller',
          isTopRated: true,
          rating: 4.9, // Extra frontend prop
          reviewCount: 124, // Extra frontend prop
          jobsCompleted: 142, // Extra frontend prop
          amount: 85,
          estimatedHours: 2,
          priceType: 'Fixed Price', // Mapped from logic usually
          trustScore: 98,
          competitivenessScore: 'High',
          avatarUrl: 'assets/mock-user-1.jpg'
        },
        {
          bidId: 102,
          workerName: 'Sarah Jenning',
          isTopRated: false,
          rating: 4.7,
          reviewCount: 45,
          jobsCompleted: 58,
          amount: 70,
          estimatedHours: 2,
          priceType: 'Est. 2 hrs',
          trustScore: 92,
          competitivenessScore: 'Medium',
          avatarUrl: 'assets/mock-user-2.jpg'
        }
      ]
    },
    {
      id: 2,
      title: 'Living Room Wall Painting',
      location: 'Scheduled: Tomorrow, 10am',
      timeAgo: '1d ago',
      status: 'InProgress',
      statusLabel: 'In Progress',
      statusClass: 'status-progress',
      bidsCount: 0,
      description: 'Need walls painted in eggshell white. Paint provided.',
      postedDate: 'Oct 23',
      progress: 66,
      category: 'Painting',
      isUrgent: false,
      bids: []
    },
    {
      id: 3,
      title: 'Garage Door Maintenance',
      location: 'Completed',
      timeAgo: '5d ago',
      status: 'Completed',
      statusLabel: 'Completed',
      statusClass: 'status-completed',
      bidsCount: 0,
      description: 'Regular maintenance check for garage door.',
      postedDate: 'Oct 18',
      progress: 100,
      category: 'Maintenance',
      isUrgent: false,
      bids: []
    }
  ];

  selectedTask: any = this.tasks[0];

  selectTask(task: any) {
    this.selectedTask = task;
  }

  chatWithWorker(id: number) {
    console.log('Chat with worker', id);
  }

  acceptBid(id: number) {
    console.log('Accept bid', id);
  }
}
