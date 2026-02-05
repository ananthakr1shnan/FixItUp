import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TaskService, WorkerJob } from '../../../core/services/task.service';
import { BidService } from '../../../core/services/bid.service';
import { AuthService } from '../../../core/services/auth.service';
import { MessageService, Conversation } from '../../../core/services/message.service';
import { Router } from '@angular/router';
import { ChatComponent } from '../../../shared/components/chat.component';
import { EarningsComponent } from '../earnings/earnings.component';

@Component({
  selector: 'app-worker-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatComponent, EarningsComponent],
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
          <button class="nav-item" [class.active]="activeTab === 'opportunities'" (click)="setActiveTab('opportunities')">
            Find Work
          </button>
          <button class="nav-item" [class.active]="activeTab === 'myJobs'" (click)="setActiveTab('myJobs')">
            My Jobs
          </button>
          <button class="nav-item" [class.active]="activeTab === 'messages'" (click)="setActiveTab('messages')">
            Messages
          </button>
          <button class="nav-item" [class.active]="activeTab === 'earnings'" (click)="setActiveTab('earnings')">
            Earnings
          </button>
          <button class="nav-item" [class.active]="activeTab === 'profile'" (click)="setActiveTab('profile')">
            Profile
          </button>
        </nav>
      </aside>

      <!-- Main Content -->
      <div class="main-content">
        <header class="page-header">
         <div>
            <h1>{{ getPageTitle() }}</h1>
            <div class="availability-toggle" *ngIf="activeTab === 'opportunities'">
               <span class="status-indicator"></span>
               <span>Available for Work</span>
            </div>
         </div>
         <div class="header-actions">
           <div class="avatar-sm">{{ userInitials }}</div>
         </div>
        </header>

        <div class="dashboard-grid">
          <!-- Opportunities Tab -->
          <div *ngIf="activeTab === 'opportunities'" class="tab-content">
            <div class="section-header">
               <h2>Nearby Opportunities</h2>
               <div class="filters">
                 <button class="filter-btn" [class.active]="currentFilter === 'All'" (click)="setFilter('All')">All</button>
                 <button class="filter-btn" [class.active]="currentFilter === 'Nearest'" (click)="setFilter('Nearest')">Nearest</button>
                 <button class="filter-btn" [class.active]="currentFilter === 'Highest Pay'" (click)="setFilter('Highest Pay')">Highest Pay</button>
                 <button class="filter-btn" [class.active]="currentFilter === 'Urgent'" (click)="setFilter('Urgent')">Urgent</button>
               </div>
            </div>

            <div class="job-list">
               <div *ngIf="!jobs || jobs.length === 0" style="text-align: center; padding: 3rem; color: var(--text-medium);">
                 <p>No opportunities available at the moment. Check back soon!</p>
               </div>
               
               <div class="job-card" *ngFor="let job of jobs">
                 <div class="job-header">
                    <div class="tags">
                       <span class="distance">{{ job.distance || '1.2 km' }} away</span>
                       <span class="tag-urgent" *ngIf="job.isUrgent">URGENT</span>
                    </div>
                    <div class="budget">
                       <span class="label">Client Budget</span>
                       <span class="value">₹{{ job.minBudget }}-{{ job.maxBudget }}</span>
                    </div>
                 </div>
                 
                 <h3>{{ job.title }}</h3>
                 <p class="description">{{ job.description }}</p>

                 <!-- Bidding Interface -->
                 <div class="bid-interface">
                    <div class="slider-container">
                       <label>Your Bid</label>
                       <input type="range" [min]="job.minBudget" [max]="job.maxBudget" [(ngModel)]="job.suggestedBid" class="bid-slider">
                    </div>
                    <div class="bid-input-group">
                       <span class="currency">₹</span>
                       <input type="number" [(ngModel)]="job.suggestedBid" class="bid-input" [min]="job.minBudget" [max]="job.maxBudget">
                    </div>
                    <button class="btn btn-primary" (click)="submitBid(job)">Submit Bid</button>
                 </div>
               </div>
            </div>
          </div>

          <!-- My Jobs Tab -->
          <div *ngIf="activeTab === 'myJobs'" class="tab-content">
            <h2>My Jobs</h2>
            
            <div *ngIf="!myJobs || myJobs.length === 0" style="text-align: center; padding: 3rem; color: var(--text-medium);">
              <p>No jobs yet. Start bidding on opportunities!</p>
            </div>

            <div class="my-jobs-list">
              <div class="my-job-card" *ngFor="let job of myJobs">
                <div class="job-status-badge" [class]="getStatusClass(job.status)">
                  {{ job.status }}
                </div>
                <h3>{{ job.title }}</h3>
                <p class="description">{{ job.description }}</p>
                <div class="job-meta">
                  <span><strong>Client:</strong> {{ job.customer.fullName }}</span>
                  <span><strong>Amount:</strong> ₹{{ job.acceptedBid.amount }}</span>
                  <span><strong>Location:</strong> {{ job.city }}, {{ job.state }}</span>
                </div>
                <div class="job-actions" style="display: flex; gap: 0.75rem; margin-top: 1rem;">
                  <button 
                    *ngIf="job.status === 'Accepted'" 
                    class="btn btn-success" 
                    (click)="startWork(job.id)"
                    style="background: #10b981; color: white;">
                    🚀 Start Work
                  </button>
                  <button 
                    *ngIf="job.status === 'InProgress'" 
                    class="btn btn-success" 
                    (click)="completeWork(job.id)"
                    style="background: #8D3B23; color: white;">
                    ✓ Work Completed
                  </button>
                  <button class="btn btn-outline" (click)="openChat(job.id, job.customer.id, job.customer.fullName)">
                    <i class="bi bi-chat-dots"></i> Message Customer
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Messages Tab -->
          <div *ngIf="activeTab === 'messages'" class="tab-content">
            <h2>Messages</h2>
            
            <div *ngIf="selectedChat" class="chat-view">
              <app-chat 
                [taskId]="selectedChat.taskId"
                [otherUserId]="selectedChat.otherUserId"
                [chatTitle]="selectedChat.title">
              </app-chat>
            </div>

            <div *ngIf="!selectedChat" class="conversations-list">
              <div *ngIf="!conversations || conversations.length === 0" style="text-align: center; padding: 3rem; color: var(--text-medium);">
                <p>No messages yet</p>
              </div>

              <div class="conversation-item" *ngFor="let conv of conversations" (click)="selectConversation(conv)">
                <div class="conv-avatar">{{ conv.otherUser.name[0] }}</div>
                <div class="conv-details">
                  <div class="conv-header">
                    <strong>{{ conv.otherUser.name }}</strong>
                    <span class="conv-time">{{ formatTime(conv.lastMessageTime) }}</span>
                  </div>
                  <p class="conv-task">{{ conv.taskTitle }}</p>
                  <p class="conv-preview">{{ conv.lastMessage }}</p>
                </div>
                <span class="unread-badge" *ngIf="conv.unreadCount > 0">{{ conv.unreadCount }}</span>
              </div>
            </div>
          </div>

          <!-- Earnings Tab -->
          <div *ngIf="activeTab === 'earnings'" class="tab-content" style="padding: 0;">
            <app-earnings></app-earnings>
          </div>

          <!-- Profile Tab -->
          <div *ngIf="activeTab === 'profile'" class="tab-content">
            <div class="profile-section" style="padding: 2rem;">
              <h2>Profile Settings</h2>
              <p style="color: var(--text-medium); margin-top: 1rem;">Profile management coming soon...</p>
            </div>
          </div>
        </div>

        <!-- Sidebar: Stats -->
        <div class="stats-column">
           <!-- Reputation Card -->

        <!-- Sidebar: Stats -->
        <div class="stats-column">
           <!-- Reputation Card -->
           <div class="card reputation-card">
              <h3>Reputation</h3>
              <div class="trust-score-circle">
                 <div class="score">{{ trustScore }}</div>
                 <div class="label">TRUST SCORE</div>
              </div>
              <div class="badges-row">
                 <span class="badge-item" *ngIf="isVerifiedPro">Verified</span>
                 <span class="badge-item" *ngIf="isFastBidder">Fast Bidder</span>
                 <span class="badge-item" *ngIf="isTopRated">Top Rated</span>
              </div>
           </div>

           <!-- Earnings Card -->
           <div class="card earnings-card">
              <div class="card-header-row">
                 <h3>Earnings</h3>
                 <a href="#" class="link">View All</a>
              </div>
              <div class="earnings-summary">
                 <span class="period">Available Balance</span>
                 <div class="amount">₹{{ availableBalance }}</div>
              </div>
              <div class="stats-list">
                 <div class="stat-row">
                    <span>Pending Clearance</span>
                    <span>₹{{ pendingClearance }}</span>
                 </div>
              </div>
           </div>

           <!-- Boost Card -->
           <div class="card boost-card">
              <h4>Boost Your Win Rate</h4>
              <p>Adding a personal message to your bid increases selection chance by 40%.</p>
           </div>
        </div>

        <!-- Earnings Tab -->
        <div *ngIf="activeTab === 'earnings'" class="tab-content">
          <div class="earnings-section">
            <div class="earnings-overview">
              <div class="earnings-card-large">
                <h3>Available Balance</h3>
                <div class="balance-amount">₹{{ availableBalance }}</div>
                <button class="btn-primary">Withdraw</button>
              </div>
              <div class="earnings-card-large">
                <h3>Pending Clearance</h3>
                <div class="balance-amount">₹{{ pendingClearance }}</div>
              </div>
            </div>
            <div class="earnings-history">
              <h3>Transaction History</h3>
              <p style="text-align: center; padding: 2rem; color: var(--text-medium);">No transactions yet</p>
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
      background: var(--secondary-50);
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
      margin: 0 0 0.5rem 0;
      font-weight: 600;
      color: #1A1A1A;
    }

    .header-actions { display: flex; align-items: center; gap: 1rem; }
    
    .avatar-sm {
       width: 40px;
       height: 40px;
       border-radius: 50%;
       background: var(--primary-100);
       color: var(--primary);
       display: flex;
       align-items: center;
       justify-content: center;
       font-weight: 600;
       font-size: 0.875rem;
    }

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
      padding: 2rem;
    }
    
    @media (min-width: 1024px) {
       .dashboard-grid { grid-template-columns: 1fr 340px; }
    }

    .tab-content {
      animation: fadeIn 0.3s;
    }

    /* Earnings Section */
    .earnings-section {
      max-width: 1200px;
    }

    .earnings-overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .earnings-card-large {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .earnings-card-large h3 {
      margin: 0 0 1rem 0;
      font-size: 1rem;
      color: var(--text-medium);
      font-weight: 500;
    }

    .balance-amount {
      font-size: 2.5rem;
      font-weight: bold;
      color: var(--text-dark);
      margin-bottom: 1.5rem;
    }

    .earnings-history {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .earnings-history h3 {
      margin: 0 0 1.5rem 0;
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

    /* Tab Content */
    .tab-content {
      animation: fadeIn 0.3s;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* My Jobs */
    .my-jobs-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .my-job-card {
      background: white;
      border: 1px solid var(--secondary-200);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      position: relative;
    }

    .job-status-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    .job-status-badge.Accepted {
      background: #DBEAFE;
      color: #1E40AF;
    }

    .job-status-badge.InProgress {
      background: #FEF3C7;
      color: #92400E;
    }

    .job-status-badge.Completed {
      background: #D1FAE5;
      color: #065F46;
    }

    .my-job-card h3 {
      margin-bottom: 0.5rem;
      color: var(--secondary-900);
    }

    .job-meta {
      display: flex;
      gap: 1.5rem;
      margin: 1rem 0;
      font-size: 0.9rem;
      color: var(--text-medium);
    }

    /* Messages/Conversations */
    .conversations-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .conversation-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: white;
      border: 1px solid var(--secondary-200);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.2s;
    }

    .conversation-item:hover {
      border-color: var(--primary-500);
      background: #FFFAF8;
    }

    .conv-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: var(--primary-500);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.2rem;
    }

    .conv-details {
      flex: 1;
    }

    .conv-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.25rem;
    }

    .conv-task {
      font-size: 0.8rem;
      color: var(--text-medium);
      margin: 0.25rem 0;
    }

    .conv-preview {
      font-size: 0.85rem;
      color: var(--text-light);
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .conv-time {
      font-size: 0.75rem;
      color: var(--text-light);
    }

    .unread-badge {
      background: var(--primary-500);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .chat-view {
      margin-top: 1rem;
    }

  `]
})
export class WorkerDashboardComponent implements OnInit {
  activeTab: 'opportunities' | 'myJobs' | 'messages' | 'earnings' | 'profile' = 'opportunities';
  currentFilter = 'All';
  jobs: any[] = [];
  allJobs: any[] = [];
  myJobs: WorkerJob[] = [];
  conversations: Conversation[] = [];
  selectedChat: { taskId: number, otherUserId: number, title: string } | null = null;
  unreadCount: number = 0;
  workerCity: string = '';

  userName = 'Worker';
  userInitials = 'W';
  trustScore = 0;
  isVerifiedPro = false;
  isFastBidder = false;
  isTopRated = false;
  availableBalance = 0;
  pendingClearance = 0;
  totalEarned = 0;
  earningsHistory: any[] = [];
  workerId: number = 0;

  constructor(
    private taskService: TaskService,
    private bidService: BidService,
    public authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) { }

  async ngOnInit() {
    const user = this.authService.currentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    if (user.role !== 'Worker') {
      this.router.navigate(['/app/dashboard']);
      return;
    }

    // Set user info
    this.workerId = user.id;
    this.userName = user.fullName.split(' ')[0];
    this.userInitials = user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    this.workerCity = user.city || '';

    console.log('=== WORKER INFO ===');
    console.log('Worker full data:', user);
    console.log('Worker city from user object:', user.city);
    console.log('Worker city stored:', this.workerCity);

    this.trustScore = user.trustScore || 0;
    this.isVerifiedPro = user.isVerifiedPro || false;
    this.isFastBidder = user.isFastBidder || false;
    this.isTopRated = user.isTopRated || false;
    this.availableBalance = user.availableBalance || 0;
    this.pendingClearance = user.pendingClearance || 0;

    // Load nearby tasks
    try {
      this.allJobs = await this.taskService.getNearbyTasks(user.id);

      // Initialize suggested bid for each job (middle of budget range)
      this.allJobs = this.allJobs.map(job => ({
        ...job,
        suggestedBid: Math.round((job.minBudget + job.maxBudget) / 2)
      }));

      console.log('=== TASKS DATA ===');
      console.log('Worker city:', this.workerCity);
      console.log('Total jobs loaded:', this.allJobs.length);
      console.log('All jobs data:', this.allJobs);
      console.log('Job cities:', this.allJobs.map(j => ({ title: j.title, city: j.city, state: j.state })));

      this.applyFilter();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  }

  setFilter(filter: string) {
    this.currentFilter = filter;
    this.applyFilter();
    this.cdr.detectChanges();
  }

  applyFilter() {
    console.log('=== APPLYING FILTER ===');
    console.log('Current filter:', this.currentFilter);
    console.log('Worker city:', this.workerCity);
    console.log('Total jobs before filter:', this.allJobs.length);

    let tempJobs = [...this.allJobs];

    switch (this.currentFilter) {
      case 'All':
        // Show all opportunities in the state (already filtered by backend)
        // Sort by creation date (newest first)
        tempJobs.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });
        break;
      case 'Nearest':
        // Filter ONLY by worker's city - show tasks from same city
        console.log('=== NEAREST FILTER ===');
        if (!this.workerCity) {
          console.log('ERROR: Worker city is not set!');
          console.log('Worker city value:', this.workerCity);
          console.log('Please ensure worker has city in profile');
          tempJobs = [];
        } else {
          const workerCityNormalized = this.workerCity.trim().toLowerCase();
          console.log('Worker city normalized:', `"${workerCityNormalized}"`);

          tempJobs = tempJobs.filter(job => {
            if (!job.city) {
              console.log(`  - Job: "${job.title}" - NO CITY FIELD`);
              return false;
            }

            const jobCity = job.city;
            const jobCityNormalized = jobCity.trim().toLowerCase();
            const match = jobCityNormalized === workerCityNormalized;

            console.log(`  - Job: "${job.title}"`);
            console.log(`    Job city: "${jobCity}" -> normalized: "${jobCityNormalized}"`);
            console.log(`    Worker city: "${this.workerCity}" -> normalized: "${workerCityNormalized}"`);
            console.log(`    Match: ${match}`);

            return match;
          });

          console.log('Jobs matching worker city:', tempJobs.length);

          if (tempJobs.length === 0) {
            console.log('⚠️ No tasks found in worker\'s city');
            console.log('Available cities in all jobs:', [...new Set(this.allJobs.map(j => j.city))]);
          }
        }
        // Sort by distance (if available)
        tempJobs.sort((a, b) => {
          const distA = parseFloat(a.distance) || 999;
          const distB = parseFloat(b.distance) || 999;
          return distA - distB;
        });
        break;
      case 'Highest Pay':
        // Sort by maximum budget (highest first)
        tempJobs.sort((a, b) => b.maxBudget - a.maxBudget);
        break;
      case 'Urgent':
        // Filter only urgent tasks
        tempJobs = tempJobs.filter(job => job.isUrgent);
        // Sort urgent tasks by creation date (newest first)
        tempJobs.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });
        break;
    }

    this.jobs = tempJobs;
    console.log('Final jobs count after filter:', this.jobs.length);
    console.log('===========================');
  }

  async submitBid(job: any) {
    const user = this.authService.currentUser();
    if (!user) return;

    if (!job.suggestedBid || job.suggestedBid < job.minBudget || job.suggestedBid > job.maxBudget) {
      alert(`Please enter a bid between ₹${job.minBudget} and ₹${job.maxBudget}`);
      return;
    }

    try {
      const bidData = {
        taskId: job.id,
        workerId: user.id,
        amount: job.suggestedBid,
        estimatedHours: 2 // Default to 2 hours
      };

      await this.bidService.placeBid(bidData);
      alert('Bid submitted successfully!');

      // Remove the job from the list after successful bid
      this.allJobs = this.allJobs.filter(j => j.id !== job.id);
      this.applyFilter();
      this.cdr.detectChanges();
    } catch (error: any) {
      console.error('Failed to submit bid:', error);
      alert(error?.error || 'Failed to submit bid. Please try again.');
    }
  }

  setActiveTab(tab: 'opportunities' | 'myJobs' | 'messages' | 'earnings' | 'profile') {
    this.activeTab = tab;

    if (tab === 'myJobs' && this.myJobs.length === 0) {
      this.loadMyJobs();
    } else if (tab === 'messages' && this.conversations.length === 0) {
      this.loadConversations();
    } else if (tab === 'earnings') {
      this.loadEarnings();
    }

    this.cdr.detectChanges();
  }

  async loadMyJobs() {
    const user = this.authService.currentUser();
    if (!user) return;

    try {
      this.myJobs = await this.taskService.getWorkerJobs(user.id);
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Failed to load my jobs:', error);
    }
  }

  async loadConversations() {
    const user = this.authService.currentUser();
    if (!user) return;

    try {
      this.conversations = await this.messageService.getUserConversations(user.id);
      this.unreadCount = this.conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  }

  loadEarnings() {
    console.log('🚀 Loading earnings for worker:', this.workerId);

    // Load earnings summary
    console.log('📞 Calling API:', `https://localhost:7043/api/payments/worker/${this.workerId}/summary`);
    this.http.get<any>(`https://localhost:7043/api/payments/worker/${this.workerId}/summary`)
      .subscribe({
        next: (data) => {
          console.log('✅ Earnings summary received:', data);
          this.availableBalance = data.availableBalance || 0;
          this.pendingClearance = data.pendingClearance || 0;
          this.totalEarned = data.totalEarned || 0;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('❌ ERROR loading earnings summary:', err);
          console.error('Status:', err.status);
          console.error('Error details:', err.error);
        }
      });

    // Load earnings history
    console.log('📞 Calling API:', `https://localhost:7043/api/payments/worker/${this.workerId}/history`);
    this.http.get<any[]>(`https://localhost:7043/api/payments/worker/${this.workerId}/history`)
      .subscribe({
        next: (data) => {
          console.log('✅ Earnings history received:', data);
          console.log('Number of transactions:', data.length);
          this.earningsHistory = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('❌ ERROR loading earnings history:', err);
          console.error('Status:', err.status);
          console.error('Error details:', err.error);
        }
      });
  }

  selectConversation(conv: Conversation) {
    this.selectedChat = {
      taskId: conv.taskId,
      otherUserId: conv.otherUser.id,
      title: `${conv.taskTitle} - ${conv.otherUser.name}`
    };
    this.cdr.detectChanges();
  }

  openChat(taskId: number, customerId: number, customerName: string) {
    this.activeTab = 'messages';
    this.selectedChat = {
      taskId,
      otherUserId: customerId,
      title: `Chat with ${customerName}`
    };
    this.cdr.detectChanges();
  }

  getStatusClass(status: string): string {
    return status;
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  }

  async startWork(taskId: number) {
    if (!confirm('Start working on this task?')) return;

    try {
      await this.taskService.updateTaskStatus(taskId, 'InProgress');
      alert('Work started! The customer has been notified.');
      await this.loadMyJobs(); // Reload jobs
    } catch (error) {
      console.error('Failed to start work:', error);
      alert('Failed to update status. Please try again.');
    }
  }

  async completeWork(taskId: number) {
    if (!confirm('Mark this work as completed? The customer will be notified to verify and close the task.')) return;

    try {
      await this.taskService.updateTaskStatus(taskId, 'WorkerCompleted');
      alert('Work marked as completed! The customer will verify and close the task.');
      await this.loadMyJobs(); // Reload jobs
    } catch (error) {
      console.error('Failed to complete work:', error);
      alert('Failed to update status. Please try again.');
    }
  }

  getPageTitle(): string {
    switch (this.activeTab) {
      case 'opportunities': return 'Welcome back, ' + this.userName;
      case 'myJobs': return 'My Jobs';
      case 'messages': return 'Messages';
      case 'earnings': return 'Earnings';
      case 'profile': return 'My Profile';
      default: return 'Dashboard';
    }
  }
}
