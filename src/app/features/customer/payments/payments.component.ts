import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface PendingPayment {
  id: number;
  taskId: number;
  taskTitle: string;
  workerName: string;
  amount: number;
  completedDate: string;
  status: string;
}

interface Transaction {
  id: number;
  taskTitle: string;
  workerName: string;
  amount: number;
  date: string;
  transactionId: string;
  status: string;
}

interface PaymentSummary {
  totalSpent: number;
  servicesCount: number;
  totalPaid: number;
}

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  customerId: number = 1; // Get from auth service
  pendingPayments: PendingPayment[] = [];
  transactionHistory: Transaction[] = [];
  summary: PaymentSummary = {
    totalSpent: 0,
    servicesCount: 0,
    totalPaid: 0
  };

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    // Get customerId from localStorage or auth service
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      this.customerId = userData.id;
      console.log('Customer data from localStorage:', userData);
      console.log('Customer ID:', this.customerId);
      console.log('Customer role:', userData.role);
    } else {
      console.error('No user data found in localStorage!');
    }

    this.loadPendingPayments();
    this.loadTransactionHistory();
    this.loadSummary();
  }

  loadPendingPayments() {
    console.log('Loading pending payments for customer:', this.customerId);
    console.log('API URL:', `/api/payments/customer/${this.customerId}/pending`);

    this.http.get<PendingPayment[]>(`/api/payments/customer/${this.customerId}/pending`)
      .subscribe({
        next: (data) => {
          console.log('✅ Pending payments API SUCCESS');
          console.log('Pending payments received:', data);
          console.log('Number of pending items:', data.length);

          this.pendingPayments = [...data]; // Create new array reference

          console.log('After assignment - pendingPayments length:', this.pendingPayments.length);
          console.log('pendingPayments array:', this.pendingPayments);

          this.cdr.detectChanges(); // Manually trigger change detection

          console.log('Change detection triggered');
        },
        error: (err) => {
          console.error('❌ ERROR loading pending payments');
          console.error('Status:', err.status);
          console.error('Error message:', err.message);
          console.error('Error details:', err.error);
          console.error('Full error object:', err);
        }
      });
  }

  loadTransactionHistory() {
    console.log('Loading transaction history for customer:', this.customerId);
    console.log('API URL:', `/api/payments/customer/${this.customerId}/history`);

    this.http.get<Transaction[]>(`/api/payments/customer/${this.customerId}/history`)
      .subscribe({
        next: (data) => {
          console.log('✅ Transaction history API SUCCESS');
          console.log('Transaction history received:', data);
          console.log('Number of transactions:', data.length);

          this.transactionHistory = [...data];
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('❌ ERROR loading transaction history');
          console.error('Status:', err.status);
          console.error('Error details:', err.error);
        }
      });
  }

  loadSummary() {
    console.log('Loading payment summary for customer:', this.customerId);
    console.log('API URL:', `/api/payments/customer/${this.customerId}/summary`);

    this.http.get<PaymentSummary>(`/api/payments/customer/${this.customerId}/summary`)
      .subscribe({
        next: (data) => {
          console.log('✅ Payment summary API SUCCESS');
          console.log('Summary data:', data);

          this.summary = { ...data };
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('❌ ERROR loading summary');
          console.error('Status:', err.status);
          console.error('Error details:', err.error);
        }
      });
  }

  releasePayment(paymentId: number) {
    if (confirm('Are you sure you want to release this payment?')) {
      this.http.post(`/api/payments/release/${paymentId}`, {})
        .subscribe({
          next: () => {
            alert('Payment released successfully!');
            this.loadPendingPayments();
            this.loadTransactionHistory();
            this.loadSummary();
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error releasing payment:', err);
            alert('Failed to release payment. Please try again.');
          }
        });
    }
  }

  verifyAndPay(taskId: number) {
    if (confirm('Verify the work is completed properly and close this task? This will create a payment.')) {
      // First update task status to Completed
      this.http.put(`/api/tasks/${taskId}/status`, { status: 'Completed' })
        .subscribe({
          next: () => {
            alert('Task verified and closed! You can now release the payment.');
            this.loadPendingPayments();
            this.loadTransactionHistory();
            this.loadSummary();
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error verifying task:', err);
            alert('Failed to verify task. Please try again.');
          }
        });
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
