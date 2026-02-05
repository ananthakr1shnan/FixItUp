import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DisputeService, Dispute } from '../../../core/services/dispute.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dispute-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <header class="page-header">
        <div>
          <h2>My Disputes</h2>
          <p class="subtitle">View and manage your reported issues</p>
          <!-- Debug info -->
          <p style="font-size: 0.6rem; color: #ccc;">Debug: Disputes={{disputes.length}}</p>
        </div>
        <button class="btn-report" (click)="reportNewIssue()">
          <i class="bi bi-plus-circle"></i> Report New Issue
        </button>
      </header>

      <div class="content-wrapper">
        <div *ngIf="disputes.length === 0" class="empty-state">
          <i class="bi bi-shield-check icon"></i>
          <p>You have no reported disputes.</p>
        </div>

        <div class="disputes-list" *ngIf="disputes.length > 0">
          <div *ngFor="let dispute of disputes" class="dispute-card">
            <div class="card-header">
              <span class="task-title">{{ dispute.taskTitle || 'Unknown Task' }}</span>
              <span class="status-badge" [class]="dispute.status.toLowerCase()">{{ dispute.status }}</span>
            </div>
            
            <div class="card-body">
              <div class="info-row">
                <span class="label">Issue Type:</span>
                <span class="value">{{ dispute.type }}</span>
              </div>
              <div class="info-row">
                <span class="label">Date Reported:</span>
                <span class="value">{{ dispute.createdAt | date:'medium' }}</span>
              </div>
              <p class="description">{{ dispute.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 1.5rem 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .page-header h2 {
      color: var(--secondary-900);
      font-size: 1.75rem;
      margin-bottom: 0.25rem;
    }

    .subtitle {
      color: var(--secondary-500);
      font-size: 0.95rem;
      margin: 0;
    }

    .btn-report {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: #4F46E5;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-report:hover {
      background: #4338CA;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    }

    .btn-report i {
      font-size: 1.1rem;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 12px;
      color: var(--secondary-400);
    }

    .empty-state .icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      display: block;
      color: var(--primary-500);
    }

    .dispute-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      border: 1px solid var(--secondary-200);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--secondary-100);
    }

    .task-title {
      font-weight: 600;
      color: var(--secondary-900);
      font-size: 1.1rem;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .status-badge.open { background: #E0F2FE; color: #0284C7; }
    .status-badge.resolved { background: #DCFCE7; color: #16A34A; }

    .info-row {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }

    .label {
      color: var(--secondary-500);
    }

    .value {
      color: var(--secondary-900);
      font-weight: 500;
    }

    .description {
      margin-top: 1rem;
      color: var(--secondary-600);
      font-size: 0.95rem;
      line-height: 1.5;
    }
  `]
})
export class DisputeListComponent implements OnInit {
  disputes: Dispute[] = [];

  constructor(
    private disputeService: DisputeService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    const user = this.authService.currentUser();
    console.log('DisputeList: Current user:', user);
    if (user) {
      try {
        console.log('DisputeList: Fetching disputes for user:', user.id);
        this.disputes = await this.disputeService.getUserDisputes(user.id);
        console.log('DisputeList: Disputes received:', this.disputes);
        this.cdr.detectChanges();
      } catch (err) {
        console.error('Failed to load disputes', err);
      }
    } else {
      console.warn('DisputeList: No user found in AuthService');
    }
  }

  reportNewIssue() {
    // Navigate to dispute reporting page where user can select a task
    this.router.navigate(['/app/report-issue']);
  }
}
