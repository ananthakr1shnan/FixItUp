import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../core/services/task.service';
import { BidService } from '../../../core/services/bid.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

interface Opportunity {
  id: number;
  title: string;
  description: string;
  category: string;
  customerName: string;
  location: string;
  minBudget: number;
  maxBudget: number;
  distance?: string;
  isUrgent: boolean;
  bidAmount: number; // For the bid input
}

@Component({
  selector: 'app-worker-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="find-work-container">
      <header class="page-header">
        <div class="header-content">
          <h1>Find Work</h1>
          <p>Discover nearby opportunities that match your skills</p>
        </div>
        <div class="availability-badge">
          <span class="status-dot"></span>
          Available for Work
        </div>
      </header>

      <!-- Filters -->
      <div class="filter-section">
        <button 
          *ngFor="let filter of filters" 
          class="filter-btn"
          [class.active]="currentFilter === filter"
          (click)="setFilter(filter)">
          {{ filter }}
        </button>
      </div>

      <!-- Opportunities List -->
      <div class="opportunities-grid" *ngIf="filteredOpportunities.length > 0">
        <div class="opportunity-card" *ngFor="let opp of filteredOpportunities">
          <!-- Card Header -->
          <div class="opp-header">
            <div class="tags">
              <span class="distance-badge" *ngIf="opp.distance">
                <i class="bi bi-geo-alt"></i> {{ opp.distance }} away
              </span>
              <span class="urgent-badge" *ngIf="opp.isUrgent">URGENT</span>
            </div>
            <div class="budget-badge">
              Client Budget: ₹{{ opp.minBudget }}-{{ opp.maxBudget }}
            </div>
          </div>

          <!-- Customer Info -->
          <div class="customer-info">
            <div class="avatar">{{ opp.customerName[0] }}</div>
            <div>
              <div class="customer-name">{{ opp.customerName }}</div>
              <div class="opp-category">{{ opp.category }}</div>
            </div>
          </div>

          <!-- Opportunity Details -->
          <h3 class="opp-title">{{ opp.title }}</h3>
          <p class="opp-description">{{ opp.description }}</p>

          <div class="opp-location">
            <i class="bi bi-geo-alt-fill"></i>
            {{ opp.location }}
          </div>

          <!-- Bidding Interface -->
          <div class="bid-section">
            <div class="bid-input-wrapper">
              <label>Your Bid Amount</label>
              <div class="bid-input-group">
                <span class="currency">₹</span>
                <input 
                  type="number" 
                  [(ngModel)]="opp.bidAmount" 
                  [min]="opp.minBudget" 
                  [max]="opp.maxBudget"
                  placeholder="Enter amount">
              </div>
              <div class="bid-range">
                Range: ₹{{ opp.minBudget }} - ₹{{ opp.maxBudget }}
              </div>
            </div>
            <button class="btn-place-bid" (click)="placeBid(opp)">
              <i class="bi bi-send-fill"></i> Place Bid
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="filteredOpportunities.length === 0 && !isLoading">
        <i class="bi bi-search"></i>
        <h3>No opportunities found</h3>
        <p>Check back later for new tasks matching your skills.</p>
      </div>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="isLoading">
        <p>Loading opportunities...</p>
      </div>
    </div>
  `,
  styles: [`
    .find-work-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .page-header h1 {
      font-size: 2rem;
      color: #1F2937;
      margin-bottom: 0.5rem;
    }

    .page-header p {
      color: #6B7280;
      font-size: 1rem;
    }

    .availability-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: #ECFDF5;
      color: #059669;
      border-radius: 999px;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      background: #10B981;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .filter-section {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .filter-btn {
      padding: 0.75rem 1.5rem;
      border: 2px solid #E5E7EB;
      background: white;
      border-radius: 8px;
      font-weight: 600;
      color: #6B7280;
      cursor: pointer;
      transition: all 0.2s;
    }

    .filter-btn:hover {
      border-color: #9CA3AF;
    }

    .filter-btn.active {
      background: #4F46E5;
      color: white;
      border-color: #4F46E5;
    }

    .opportunities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .opportunity-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #E5E7EB;
      transition: all 0.3s;
    }

    .opportunity-card:hover {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      transform: translateY(-4px);
    }

    .opp-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 1rem;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tags {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .distance-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.75rem;
      background: #F3F4F6;
      color: #4B5563;
      border-radius: 999px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .urgent-badge {
      padding: 0.25rem 0.75rem;
      background: #FEE2E2;
      color: #DC2626;
      border-radius: 999px;
      font-size: 0.85rem;
      font-weight: 700;
    }

    .budget-badge {
      padding: 0.5rem 0.75rem;
      background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
      color: white;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .customer-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.2rem;
    }

    .customer-name {
      font-weight: 600;
      color: #111827;
      font-size: 1rem;
    }

    .opp-category {
      color: #6B7280;
      font-size: 0.85rem;
    }

    .opp-title {
      font-size: 1.25rem;
      color: #111827;
      margin-bottom: 0.5rem;
      font-weight: 700;
    }

    .opp-description {
      color: #4B5563;
      line-height: 1.6;
      margin-bottom: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .opp-location {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #6B7280;
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
    }

    .opp-location i {
      color: #9CA3AF;
    }

    .bid-section {
      border-top: 1px solid #E5E7EB;
      padding-top: 1.5rem;
    }

    .bid-input-wrapper label {
      display: block;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }

    .bid-input-group {
      display: flex;
      align-items: center;
      border: 2px solid #D1D5DB;
      border-radius:8px;
      overflow: hidden;
      margin-bottom: 0.5rem;
      transition: border-color 0.2s;
    }

    .bid-input-group:focus-within {
      border-color: #4F46E5;
    }

    .currency {
      padding: 0.75rem 1rem;
      background: #F9FAFB;
      color: #6B7280;
      font-weight: 600;
      border-right: 1px solid #D1D5DB;
    }

    .bid-input-group input {
      flex: 1;
      padding: 0.75rem;
      border: none;
      outline: none;
      font-size: 1rem;
      font-weight: 600;
    }

    .bid-range {
      font-size: 0.85rem;
      color: #6B7280;
      margin-bottom: 1rem;
    }

    .btn-place-bid {
      width: 100%;
      padding: 0.875rem;
      background: #4F46E5;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-place-bid:hover {
      background: #4338CA;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #9CA3AF;
    }

    .empty-state i {
      font-size: 4rem;
      margin-bottom: 1rem;
      display: block;
    }

    .empty-state h3 {
      color: #6B7280;
      margin-bottom: 0.5rem;
    }

    .loading-state {
      text-align: center;
      padding: 3rem;
      color: #6B7280;
    }
  `]
})
export class WorkerDashboardComponent implements OnInit {
  opportunities: Opportunity[] = [];
  filteredOpportunities: Opportunity[] = [];
  filters = ['All', 'Nearby', 'Urgent', 'High Pay'];
  currentFilter = 'All';
  isLoading = true;

  constructor(
    private taskService: TaskService,
    private bidService: BidService,
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadOpportunities();
  }

  loadOpportunities() {
    this.isLoading = true;
    const currentUser = this.authService.currentUser();

    if (!currentUser) {
      this.isLoading = false;
      return;
    }

    // TaskService.getNearbyTasks expects userId (number)
    this.taskService.getNearbyTasks(currentUser.id).then((tasks: any[]) => {
      this.opportunities = tasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        category: task.category,
        customerName: task.customerName || 'Unknown Customer',
        location: `${task.city}, ${task.state}`,
        minBudget: task.minBudget || task.estimatedCost * 0.8,
        maxBudget: task.maxBudget || task.estimatedCost * 1.2,
        distance: this.calculateDistance(task),
        isUrgent: task.isUrgent || false,
        bidAmount: task.estimatedCost || task.minBudget
      }));
      this.applyFilter();
      this.isLoading = false;
    }).catch((err: any) => {
      console.error('Failed to load opportunities', err);
      this.isLoading = false;
    });
  }

  calculateDistance(task: any): string {
    // Mock distance calculation - in real app, use geolocation
    const distances = ['0.5 km', '1.2 km', '2.5 km', '3.8 km', '5.1 km'];
    return distances[Math.floor(Math.random() * distances.length)];
  }

  setFilter(filter: string) {
    this.currentFilter = filter;
    this.applyFilter();
  }

  applyFilter() {
    if (this.currentFilter === 'All') {
      this.filteredOpportunities = this.opportunities;
    } else if (this.currentFilter === 'Nearby') {
      this.filteredOpportunities = this.opportunities
        .sort((a, b) => parseFloat(a.distance || '0') - parseFloat(b.distance || '0'));
    } else if (this.currentFilter === 'Urgent') {
      this.filteredOpportunities = this.opportunities.filter(opp => opp.isUrgent);
    } else if (this.currentFilter === 'High Pay') {
      this.filteredOpportunities = this.opportunities
        .sort((a, b) => b.maxBudget - a.maxBudget);
    }
  }

  placeBid(opportunity: Opportunity) {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      alert('Please login to place a bid');
      return;
    }

    if (!opportunity.bidAmount || opportunity.bidAmount < opportunity.minBudget || opportunity.bidAmount > opportunity.maxBudget) {
      alert(`Please enter a valid bid amount between ₹${opportunity.minBudget} and ₹${opportunity.maxBudget}`);
      return;
    }

    const bidData = {
      taskId: opportunity.id,
      workerId: currentUser.id,
      amount: opportunity.bidAmount,
      proposedTimeline: '3-5 business days',
      coverLetter: 'Interested in this opportunity'
    };

    // BidService.placeBid returns a Promise, not an Observable
    this.bidService.placeBid(bidData).then(() => {
      alert('Bid placed successfully! The customer will review your proposal.');
      this.loadOpportunities(); // Refresh the list
    }).catch((err: any) => {
      console.error('Failed to place bid', err);
      alert('Failed to place bid. Please try again.');
    });
  }
}
