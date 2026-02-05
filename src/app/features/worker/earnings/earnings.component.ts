import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface PaymentHistory {
  id: number;
  taskTitle: string;
  customerName: string;
  amount: number;
  status: string;
  date: string;
}

interface EarningsSummary {
  availableBalance: number;
  pendingClearance: number;
  totalEarned: number;
}

@Component({
  selector: 'app-earnings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './earnings.component.html',
  styleUrls: ['./earnings.component.css']
})
export class EarningsComponent implements OnInit {
  workerId: number = 1;
  summary: EarningsSummary = {
    availableBalance: 0,
    pendingClearance: 0,
    totalEarned: 0
  };
  earningsHistory: PaymentHistory[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {
    console.log('🔧 EarningsComponent constructor called');
  }

  ngOnInit() {
    console.log('🚀 EarningsComponent ngOnInit START');
    console.log('📍 Current URL:', window.location.href);
    
    const user = localStorage.getItem('currentUser');
    console.log('💾 localStorage user:', user);
    
    if (user) {
      const userData = JSON.parse(user);
      this.workerId = userData.id;
      console.log('✅ Worker data from localStorage:', userData);
      console.log('🆔 Worker ID:', this.workerId);
      console.log('👤 Worker role:', userData.role);
    } else {
      console.error('❌ No user data found in localStorage!');
      return;
    }

    console.log('📞 About to call loadEarningsSummary and loadPaymentHistory');
    this.loadEarningsSummary();
    this.loadPaymentHistory();
  }

  loadEarningsSummary() {
    console.log('Loading earnings summary for worker:', this.workerId);
    console.log('API URL:', `https://localhost:7043/api/payments/worker/${this.workerId}/summary`);
    
    this.http.get<EarningsSummary>(`https://localhost:7043/api/payments/worker/${this.workerId}/summary`)
      .subscribe({
        next: (data) => {
          console.log('✅ Earnings summary API SUCCESS');
          console.log('Summary data:', data);
          
          this.summary = { ...data };
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('❌ ERROR loading earnings summary');
          console.error('Status:', err.status);
          console.error('Error details:', err.error);
        }
      });
  }

  loadPaymentHistory() {
    console.log('Loading payment history for worker:', this.workerId);
    console.log('API URL:', `https://localhost:7043/api/payments/worker/${this.workerId}/history`);
    
    this.http.get<PaymentHistory[]>(`https://localhost:7043/api/payments/worker/${this.workerId}/history`)
      .subscribe({
        next: (data) => {
          console.log('✅ Payment history API SUCCESS');
          console.log('Payment history received:', data);
          console.log('Number of payments:', data.length);
          
          this.earningsHistory = [...data];
          
          console.log('After assignment - earningsHistory length:', this.earningsHistory.length);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('❌ ERROR loading payment history');
          console.error('Status:', err.status);
          console.error('Error details:', err.error);
        }
      });
  }

  getStatusBadgeClass(status: string): string {
    return status.toLowerCase();
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
