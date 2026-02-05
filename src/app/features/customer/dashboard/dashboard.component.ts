import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService, CustomerTask } from '../../../core/services/task.service';
import { BidService } from '../../../core/services/bid.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ChatComponent } from '../../../shared/components/chat.component';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, ChatComponent],
  template: `
    <div class="dashboard-container">
      <header class="page-header">
        <h1>Good morning, {{ userName }}</h1>
        <p>You have {{ activeTasks }} active tasks and {{ completedTasksPendingReview }} completed task{{ completedTasksPendingReview !== 1 ? 's' : '' }} pending review.</p>
        <button class="btn btn-primary" (click)="postNewTask()">Post a New Task</button>
      </header>

      <div class="dashboard-grid">
        <!-- Task List (Master) -->
        <div class="task-list-column">
          <h3>Your Tasks</h3>
          
          <div *ngIf="!tasks || tasks.length === 0" style="text-align: center; padding: 2rem; color: var(--text-medium);">
            <p>No tasks yet. Post your first task to get started!</p>
            <button class="btn btn-primary" style="margin-top: 1rem;" (click)="postNewTask()">Post a Task</button>
          </div>
          
          <div class="task-cards" *ngIf="tasks && tasks.length > 0">
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
                  
                  <!-- Accepted/Bidding -->
                  <div class="segment-group">
                     <div class="segment-bar" [class.completed]="selectedTask.status === 'Accepted' || selectedTask.status === 'InProgress' || selectedTask.status === 'WorkerCompleted' || selectedTask.status === 'Completed'" [class.active]="selectedTask.status === 'Accepted'"></div>
                     <span class="step-label" [class.active-text]="selectedTask.status === 'Accepted'">Accepted</span>
                  </div>

                  <!-- In Progress -->
                  <div class="segment-group">
                     <div class="segment-bar" [class.completed]="selectedTask.status === 'InProgress' || selectedTask.status === 'WorkerCompleted' || selectedTask.status === 'Completed'" [class.active]="selectedTask.status === 'InProgress'"></div>
                     <span class="step-label" [class.active-text]="selectedTask.status === 'InProgress'">In Progress</span>
                  </div>

                  <!-- Worker Completed -->
                  <div class="segment-group">
                     <div class="segment-bar" [class.completed]="selectedTask.status === 'WorkerCompleted' || selectedTask.status === 'Completed'" [class.active]="selectedTask.status === 'WorkerCompleted'"></div>
                     <span class="step-label" [class.active-text]="selectedTask.status === 'WorkerCompleted'">Work Done</span>
                  </div>

                  <!-- Completed -->
                  <div class="segment-group">
                     <div class="segment-bar" [class.completed]="selectedTask.status === 'Completed'"></div>
                     <span class="step-label">Closed</span>
                  </div>
               </div>
            </div>

            <!-- Bids List - Only show if task is not assigned yet -->
            <div class="bids-list" *ngIf="selectedTask.status === 'Posted' && selectedTask.bids && selectedTask.bids.length > 0">
              <h3>Bids Received</h3>
              <div class="bid-card" *ngFor="let bid of selectedTask.bids.slice(0, 3)">
                <div class="bid-worker">
                  <div class="worker-avatar">
                     <img src="assets/avatar-placeholder.png" [alt]="bid.workerName">
                     <div class="badge-top-rated" *ngIf="bid.isTopRated">TOP RATED</div>
                  </div>
                  <div class="worker-info">
                    <h3>{{ bid.workerName }}</h3>
                    <div class="rating">
                       <i class="bi bi-star-fill"></i> {{ bid.rating }} <span class="review-count">({{ bid.reviewCount }} reviews)</span>
                       <span class="jobs-count">{{ bid.jobsCompleted }} Jobs</span>
                    </div>
                  </div>
                </div>
                <div class="bid-actions">
                   <div class="bid-price">
                      <span class="amount">₹{{ bid.amount }}</span>
                      <span class="type">{{ bid.priceType }}</span>
                   </div>
                   <button class="btn btn-outline" (click)="chatWithWorker(bid.workerId)">Chat</button>
                   <button class="btn btn-primary" (click)="acceptBid(bid.bidId)">Accept</button>
                </div>
              </div>
            </div>
            
            <!-- Assigned Worker Info -->
            <div class="assigned-worker-card" *ngIf="selectedTask.status !== 'Posted' && selectedTask.assignedWorker">
              <h3>Assigned Worker</h3>
              <div class="worker-details">
                <div class="worker-avatar-large">
                  <img src="assets/avatar-placeholder.png" [alt]="selectedTask.assignedWorker.name">
                </div>
                <div class="worker-info">
                  <h4>{{ selectedTask.assignedWorker.name }}</h4>
                  <div class="rating">
                    <i class="bi bi-star-fill"></i> {{ selectedTask.assignedWorker.rating || 5.0 }}
                  </div>
                  <p>Accepted Bid: ₹{{ selectedTask.assignedWorker.bidAmount }}</p>
                </div>
                <button class="btn btn-primary" (click)="chatWithWorker(selectedTask.assignedWorker.workerId)">
                  <i class="bi bi-chat-dots"></i> Message Worker
                </button>
              </div>
              
              <!-- Status Update Actions -->
              <div class="status-actions" style="margin-top: 1.5rem;">
                <!-- Waiting for worker to start -->
                <div *ngIf="selectedTask.status === 'Accepted'" style="padding: 1rem; background: #eff6ff; border-radius: 8px; color: #1e40af;">
                  <p style="margin: 0;"><strong>ℹ️ Waiting for worker to start</strong></p>
                  <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem;">The worker will start working on this task soon.</p>
                </div>
                
                <!-- Work in progress -->
                <div *ngIf="selectedTask.status === 'InProgress'" style="padding: 1rem; background: #fef3c7; border-radius: 8px; color: #92400e;">
                  <p style="margin: 0;"><strong>🚀 Work in progress</strong></p>
                  <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem;">The worker is currently working on this task.</p>
                </div>
                
                <!-- Worker completed - needs verification -->
                <div *ngIf="selectedTask.status === 'WorkerCompleted'" style="padding: 1rem; background: #d1fae5; border-radius: 8px;">
                  <p style="margin: 0; color: #065f46;"><strong>✓ Worker has completed the work</strong></p>
                  <p style="margin: 0.5rem 0 1rem 0; font-size: 0.9rem; color: #047857;">Please verify the work and close the task to proceed with payment.</p>
                  <button 
                    class="btn btn-success" 
                    (click)="updateTaskStatus(selectedTask.id, 'Completed')"
                    style="background: #10b981; color: white; width: 100%;">
                    ✓ Verify & Close Work
                  </button>
                </div>
              </div>
            </div>
            
            <div class="no-bids" *ngIf="selectedTask.status === 'Posted' && (!selectedTask.bids || selectedTask.bids.length === 0)" style="text-align: center; padding: 2rem; color: var(--text-light);">
              <p>No bids received yet. Workers will start bidding soon!</p>
            </div>
              
            <div class="view-more-bids" *ngIf="selectedTask.status === 'Posted' && selectedTask.bids && selectedTask.bids.length > 3">
              <a href="javascript:void(0)">View {{ selectedTask.bids.length - 3 }} more bid{{ selectedTask.bids.length - 3 !== 1 ? 's' : '' }}</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Modal -->
      <div class="chat-modal" *ngIf="chatOpen" (click)="closeChatModal($event)">
        <div class="chat-modal-content" (click)="$event.stopPropagation()">
          <app-chat 
            *ngIf="selectedChat"
            [taskId]="selectedChat.taskId"
            [otherUserId]="selectedChat.workerId"
            [chatTitle]="selectedChat.workerName">
          </app-chat>
          <button class="close-modal-btn" (click)="closeChatModal($event)">×</button>
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

    /* Assigned Worker Card */
    .assigned-worker-card {
      margin-top: 2rem;
      padding: 1.5rem;
      background: #F0FDF4;
      border: 2px solid #86EFAC;
      border-radius: var(--radius-lg);
    }
    
    .assigned-worker-card h3 {
      color: #166534;
      font-size: 1.1rem;
      margin-bottom: 1rem;
    }
    
    .worker-details {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    
    .worker-avatar-large {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
      background: #D1D5DB;
    }
    
    .worker-avatar-large img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .worker-details .worker-info {
      flex: 1;
    }
    
    .worker-details .worker-info h4 {
      font-size: 1.2rem;
      color: var(--secondary-900);
      margin-bottom: 0.25rem;
    }
    
    .worker-details .worker-info .rating {
      color: #F59E0B;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }
    
    .worker-details .worker-info p {
      color: var(--text-medium);
      font-size: 0.95rem;
    }

    /* Chat Modal */
    .chat-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .chat-modal-content {
      background: white;
      border-radius: var(--radius-lg);
      width: 90%;
      max-width: 700px;
      height: 80vh;
      position: relative;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .close-modal-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: white;
      border: none;
      font-size: 1.5rem;
      color: var(--text-medium);
      cursor: pointer;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      transition: all 0.2s ease;
    }

    .close-modal-btn:hover {
      background: var(--background);
      color: var(--secondary-900);
    }

  `]
})
export class CustomerDashboardComponent implements OnInit {
  tasks: any[] = [];
  selectedTask: any = null;
  userName = 'User';
  activeTasks = 0;
  completedTasksPendingReview = 0;
  chatOpen: boolean = false;
  selectedChat: { taskId: number, workerId: number, workerName: string } | null = null;

  constructor(
    private taskService: TaskService,
    private bidService: BidService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.userName = currentUser.fullName.split(' ')[0];
    await this.loadTasks();
  }

  async loadTasks() {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      console.log('No current user found');
      return;
    }

    console.log('Loading tasks for customer:', currentUser.id);
    
    try {
      const customerTasks = await this.taskService.getCustomerTasks(currentUser.id);
      console.log('Received tasks from API:', customerTasks);
      
      if (!customerTasks || customerTasks.length === 0) {
        console.log('No tasks returned from API');
        this.tasks = [];
        return;
      }
      
      this.tasks = customerTasks.map(task => this.mapTaskForUI(task));
      console.log('Mapped tasks for UI:', this.tasks);
      
      // Calculate summary stats
      this.activeTasks = this.tasks.filter(t => 
        t.status === 'Posted' || t.status === 'Bidding' || t.status === 'Accepted' || t.status === 'InProgress'
      ).length;
      
      this.completedTasksPendingReview = this.tasks.filter(t => 
        t.status === 'Completed'
      ).length;
      
      // Auto-select first task if available
      if (this.tasks.length > 0) {
        this.selectedTask = this.tasks[0];
        console.log('Selected first task:', this.selectedTask);
      }
      
      // Force change detection
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Failed to load tasks:', error);
      this.tasks = [];
      this.cdr.detectChanges();
    }
  }

  mapTaskForUI(task: CustomerTask) {
    const statusMap: any = {
      'Posted': { label: 'Posted', class: 'status-bidding' },
      'Bidding': { label: 'Receiving Bids', class: 'status-bidding' },
      'Accepted': { label: 'Accepted', class: 'status-progress' },
      'InProgress': { label: 'In Progress', class: 'status-progress' },
      'Completed': { label: 'Completed', class: 'status-completed' },
      'UnderDispute': { label: 'Under Dispute', class: 'status-completed' }
    };

    const progressMap: any = {
      'Posted': 0,
      'Bidding': 33,
      'Accepted': 33,
      'InProgress': 66,
      'Completed': 100,
      'UnderDispute': 66
    };
    
    // Find assigned worker if task is accepted
    let assignedWorker = null;
    if (task.assignedWorkerId && task.bids) {
      const acceptedBid = task.bids.find(bid => bid.worker.id === task.assignedWorkerId);
      if (acceptedBid) {
        assignedWorker = {
          workerId: acceptedBid.worker.id,
          name: acceptedBid.worker.fullName,
          rating: this.calculateRating(acceptedBid.worker.trustScore),
          bidAmount: acceptedBid.amount
        };
      }
    }

    return {
      id: task.id,
      title: task.title,
      location: task.location,
      timeAgo: this.getTimeAgo(task.createdAt),
      status: task.status,
      statusLabel: statusMap[task.status]?.label || task.status,
      statusClass: statusMap[task.status]?.class || 'status-bidding',
      bidsCount: task.bidsCount,
      description: task.description,
      postedDate: this.formatDate(task.createdAt),
      progress: progressMap[task.status] || 0,
      category: task.category,
      isUrgent: task.isUrgent,
      assignedWorker: assignedWorker,
      bids: task.bids.map(bid => ({
        bidId: bid.id,
        workerName: bid.worker.fullName,
        isTopRated: bid.worker.isTopRated,
        rating: this.calculateRating(bid.worker.trustScore),
        reviewCount: bid.worker.jobsCompleted, // Using jobs completed as proxy
        jobsCompleted: bid.worker.jobsCompleted,
        amount: bid.amount,
        estimatedHours: bid.estimatedHours,
        priceType: bid.estimatedHours > 0 ? `Est. ${bid.estimatedHours} hrs` : 'Fixed Price',
        trustScore: bid.worker.trustScore,
        workerId: bid.worker.id
      }))
    };
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  calculateRating(trustScore: number): number {
    // Convert trust score (0-100) to rating (0-5)
    return Math.round((trustScore / 100) * 5 * 10) / 10;
  }

  selectTask(task: any) {
    this.selectedTask = task;
  }

  chatWithWorker(workerId: number) {
    if (!this.selectedTask) return;
    
    // Get worker name from assigned worker or find in bids
    let workerName = 'Worker';
    if (this.selectedTask.assignedWorker && this.selectedTask.assignedWorker.workerId === workerId) {
      workerName = this.selectedTask.assignedWorker.name;
    } else if (this.selectedTask.bids) {
      const bid = this.selectedTask.bids.find((b: any) => b.workerId === workerId);
      if (bid) workerName = bid.workerName;
    }

    this.selectedChat = {
      taskId: this.selectedTask.id,
      workerId: workerId,
      workerName: workerName
    };
    this.chatOpen = true;
  }

  closeChatModal(event?: any) {
    if (event) {
      event.stopPropagation();
    }
    this.chatOpen = false;
    this.selectedChat = null;
  }

  async acceptBid(bidId: number) {
    if (!confirm('Are you sure you want to accept this bid?')) return;

    try {
      await this.bidService.acceptBid(bidId);
      alert('Bid accepted successfully!');
      await this.loadTasks(); // Reload tasks to get updated status
    } catch (error) {
      console.error('Failed to accept bid:', error);
      alert('Failed to accept bid. Please try again.');
    }
  }

  async updateTaskStatus(taskId: number, newStatus: string) {
    const statusMessages: any = {
      'Completed': 'Verify and close this work? This will create a payment request.'
    };

    if (!confirm(statusMessages[newStatus] || 'Update task status?')) return;

    try {
      await this.taskService.updateTaskStatus(taskId, newStatus);
      alert('Task completed successfully! Payment request created.');
      await this.loadTasks(); // Reload tasks to get updated status
    } catch (error) {
      console.error('Failed to update task status:', error);
      alert('Failed to update task status. Please try again.');
    }
  }

  postNewTask() {
    // TODO: Navigate to post task page
    this.router.navigate(['/app/post-task']);
  }
}
