import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Payment {
  id: number;
  taskTitle: string;
  customerName: string;
  workerName: string;
  amount: number;
  status: string;
  createdAt: string;
  completedAt: string;
  transactionId: string;
}

interface FinanceSummary {
  totalRevenue: number;
  pendingAmount: number;
  totalTransactions: number;
  completedTransactions: number;
}

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="finance-container">
      <header class="page-header">
        <h2>Finance & Transactions</h2>
        <div class="filter-controls">
          <select [(ngModel)]="filterBy" (change)="onFilterChange()" class="filter-select">
            <option value="">All Time</option>
            <option value="day">Today</option>
            <option value="month">This Month</option>
          </select>
          <input 
            *ngIf="filterBy" 
            type="date" 
            [(ngModel)]="selectedDate" 
            (change)="applyFilters()"
            class="date-input"
          />
          <button class="btn btn-primary" (click)="exportReport()">
            <i class="bi bi-download"></i> Export Report
          </button>
        </div>
      </header>

      <!-- Summary Cards -->
      <div class="summary-grid">
        <div class="summary-card revenue">
          <div class="card-icon">
            <i class="bi bi-cash-stack"></i>
          </div>
          <div class="card-content">
            <h3>Total Revenue</h3>
            <p class="amount">\${{summary.totalRevenue.toFixed(2)}}</p>
            <span class="sub-text">{{summary.completedTransactions}} completed transactions</span>
          </div>
        </div>

        <div class="summary-card pending">
          <div class="card-icon">
            <i class="bi bi-clock-history"></i>
          </div>
          <div class="card-content">
            <h3>Pending Amount</h3>
            <p class="amount">\${{summary.pendingAmount.toFixed(2)}}</p>
            <span class="sub-text">Awaiting customer release</span>
          </div>
        </div>

        <div class="summary-card transactions">
          <div class="card-icon">
            <i class="bi bi-arrow-left-right"></i>
          </div>
          <div class="card-content">
            <h3>Total Transactions</h3>
            <p class="amount">{{summary.totalTransactions}}</p>
            <span class="sub-text">All payment records</span>
          </div>
        </div>
      </div>

      <!-- Transactions Table -->
      <section class="section">
        <div class="section-header">
          <h3>Transaction History</h3>
        </div>

        <div *ngIf="payments.length === 0" class="empty-state">
          <i class="bi bi-inbox"></i>
          <p>No transactions found</p>
        </div>

        <div class="transactions-table" *ngIf="payments.length > 0">
          <div class="table-header">
            <div class="col">Transaction ID</div>
            <div class="col">Task</div>
            <div class="col">Customer</div>
            <div class="col">Worker</div>
            <div class="col">Amount</div>
            <div class="col">Status</div>
            <div class="col">Date</div>
          </div>
          <div class="table-row" *ngFor="let payment of payments">
            <div class="col transaction-id">{{payment.transactionId || 'N/A'}}</div>
            <div class="col">{{payment.taskTitle}}</div>
            <div class="col">{{payment.customerName}}</div>
            <div class="col">{{payment.workerName}}</div>
            <div class="col amount">\${{payment.amount.toFixed(2)}}</div>
            <div class="col">
              <span class="status-badge" [ngClass]="payment.status.toLowerCase()">
                {{payment.status}}
              </span>
            </div>
            <div class="col">{{formatDate(payment.completedAt || payment.createdAt)}}</div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .finance-container {
      padding: 2rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .page-header h2 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1a1a1a;
    }

    .filter-controls {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .filter-select,
    .date-input {
      padding: 0.5rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.9rem;
      background: white;
    }

    .filter-select:focus,
    .date-input:focus {
      outline: none;
      border-color: #8D3B23;
    }

    .btn-primary {
      background: #8D3B23;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 600;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
    }

    .btn-primary:hover {
      background: #6f2e1a;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .summary-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      border: 1px solid #e5e7eb;
      display: flex;
      gap: 1rem;
      transition: all 0.2s;
    }

    .summary-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .summary-card .card-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: white;
      flex-shrink: 0;
    }

    .summary-card.revenue .card-icon {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }

    .summary-card.pending .card-icon {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    }

    .summary-card.transactions .card-icon {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    }

    .card-content h3 {
      font-size: 0.9rem;
      color: #6b7280;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .card-content .amount {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 0.25rem;
    }

    .card-content .sub-text {
      font-size: 0.8rem;
      color: #9ca3af;
    }

    .section {
      background: white;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      padding: 1.5rem;
    }

    .section-header {
      margin-bottom: 1.5rem;
    }

    .section-header h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1a1a1a;
    }

    .transactions-table {
      overflow-x: auto;
    }

    .table-header,
    .table-row {
      display: grid;
      grid-template-columns: 1.2fr 1.5fr 1fr 1fr 0.8fr 0.8fr 1fr;
      gap: 1rem;
      padding: 1rem 0;
      align-items: center;
    }

    .table-header {
      font-weight: 600;
      font-size: 0.85rem;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #e5e7eb;
    }

    .table-row {
      border-bottom: 1px solid #f3f4f6;
      font-size: 0.9rem;
      transition: background 0.2s;
    }

    .table-row:hover {
      background: #f9fafb;
    }

    .table-row:last-child {
      border-bottom: none;
    }

    .table-row .col.amount {
      font-weight: 600;
      color: #1a1a1a;
    }

    .table-row .col.transaction-id {
      font-family: monospace;
      font-size: 0.8rem;
      color: #6b7280;
    }

    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.completed {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.pending {
      background: #fef3c7;
      color: #92400e;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #9ca3af;
    }

    .empty-state i {
      font-size: 3rem;
      margin-bottom: 1rem;
      display: block;
    }

    @media (max-width: 768px) {
      .table-header,
      .table-row {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }

      .table-header {
        display: none;
      }

      .filter-controls {
        width: 100%;
      }

      .filter-select,
      .date-input,
      .btn-primary {
        flex: 1;
      }
    }
  `]
})
export class FinanceComponent implements OnInit {
  payments: Payment[] = [];
  summary: FinanceSummary = {
    totalRevenue: 0,
    pendingAmount: 0,
    totalTransactions: 0,
    completedTransactions: 0
  };
  filterBy: string = '';
  selectedDate: string = new Date().toISOString().split('T')[0];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadFinanceData();
  }

  onFilterChange() {
    if (this.filterBy) {
      this.applyFilters();
    } else {
      this.loadFinanceData();
    }
  }

  applyFilters() {
    let url = `https://localhost:7043/api/payments/admin/finance`;
    
    if (this.filterBy && this.selectedDate) {
      url += `?filterBy=${this.filterBy}&date=${this.selectedDate}`;
    }

    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.payments = data.payments;
        this.summary = data.summary;
      },
      error: (err) => console.error('Error loading finance data:', err)
    });
  }

  loadFinanceData() {
    this.http.get<any>('https://localhost:7043/api/payments/admin/finance')
      .subscribe({
        next: (data) => {
          this.payments = data.payments;
          this.summary = data.summary;
        },
        error: (err) => console.error('Error loading finance data:', err)
      });
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  exportReport() {
    // Implement export functionality
    alert('Exporting finance report...');
  }
}
