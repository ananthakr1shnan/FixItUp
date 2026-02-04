import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="admin-dashboard">
       <div class="dashboard-header">
          <div>
            <h1>System Overview</h1>
            <p class="subtitle">Last updated: Just now</p>
          </div>
          <div class="header-actions">
             <div class="search-bar">
                <input type="text" placeholder="Search users, tasks, or IDs...">
             </div>
             <div class="icon-btn notification"></div>
             <div class="admin-avatar"></div>
          </div>
       </div>

       <!-- Stats Row -->
       <div class="stats-row">
          <div class="stat-card">
             <div class="stat-top">
                <div class="icon-box"></div>
                <span class="trend positive">+12.5%</span>
             </div>
             <div class="stat-value">1,248</div>
             <div class="stat-label">Active Tasks</div>
          </div>

          <div class="stat-card">
             <div class="stat-top">
                <div class="icon-box"></div>
                <span class="trend positive">+8.2%</span>
             </div>
             <div class="stat-value">4,832</div>
             <div class="stat-label">Total Users</div>
          </div>

          <div class="stat-card">
             <div class="stat-top">
                <div class="icon-box"></div>
                <span class="trend positive">+4.1%</span>
             </div>
             <div class="stat-value">$124.5k</div>
             <div class="stat-label">Monthly Revenue</div>
          </div>

          <div class="stat-card alert-card">
             <div class="stat-top">
                <div class="icon-box alert"></div>
                <span class="trend negative">+2 New</span>
             </div>
             <div class="stat-value red">14</div>
             <div class="stat-label">Open Disputes</div>
          </div>
       </div>

       <div class="dashboard-content-grid">
          <!-- Recent Activity -->
          <div class="activity-section">
             <div class="section-header">
                <h3>Recent User Activity</h3>
                <button class="btn btn-outline btn-sm">View All Users</button>
             </div>
             
             <table class="activity-table">
                <thead>
                   <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Last Action</th>
                      <th>Status</th>
                      <th>Date</th>
                   </tr>
                </thead>
                <tbody>
                   <tr *ngFor="let activity of activities">
                      <td>
                         <div class="user-cell">
                            <img [src]="activity.avatar" class="avatar-xs">
                            <span>{{ activity.name }}</span>
                         </div>
                      </td>
                      <td>{{ activity.role }}</td>
                      <td>{{ activity.action }}</td>
                      <td>
                         <span class="status-badge" [ngClass]="activity.statusClass">{{ activity.status }}</span>
                      </td>
                      <td class="date-cell">{{ activity.date }}</td>
                   </tr>
                </tbody>
             </table>
          </div>

          <!-- Sidebar Panels -->
          <div class="right-panels">
             <!-- Disputes -->
             <div class="panel">
                <h3 class="panel-title red">Dispute Resolution</h3>
                <div class="dispute-list">
                   <div class="dispute-item" *ngFor="let dispute of disputes">
                      <div class="dispute-icon"></div>
                      <div class="dispute-content">
                         <h4>{{ dispute.title }}</h4>
                         <p>{{ dispute.desc }}</p>
                         <button class="btn btn-dark btn-xs" *ngIf="dispute.actionLabel">{{ dispute.actionLabel }}</button>
                      </div>
                   </div>
                </div>
                <div class="panel-footer">View all disputes</div>
             </div>

             <!-- Top Performers -->
             <div class="panel">
                <h3 class="panel-title">Top Performers</h3>
                <div class="performer-list">
                   <div class="performer-item" *ngFor="let p of performers; let i = index">
                      <span class="rank">{{ i + 1 }}</span>
                      <img [src]="p.avatar" class="avatar-sm">
                      <div class="p-info">
                         <div class="p-name">{{ p.name }}</div>
                         <div class="p-sub">{{ p.jobs }} Jobs this month</div>
                      </div>
                      <div class="p-income">{{ p.income }}</div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  `,
    styles: [`
    .admin-dashboard {
       padding-bottom: 2rem;
    }

    .dashboard-header {
       display: flex;
       justify-content: space-between;
       align-items: center;
       margin-bottom: 2.5rem;
    }

    h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.25rem; }
    .subtitle { color: var(--text-medium); font-size: 0.9rem; margin: 0; }

    .header-actions {
       display: flex;
       align-items: center;
       gap: 1.5rem;
    }

    .search-bar input {
       padding: 0.6rem 1rem;
       border-radius: 6px;
       border: 1px solid var(--secondary-200);
       width: 240px;
       font-size: 0.9rem;
    }

    .icon-btn.notification {
       width: 40px; height: 40px; background: white; border-radius: 50%;
    }
    .admin-avatar {
       width: 40px; height: 40px; background: #333; border-radius: 50%;
    }

    /* Stats */
    .stats-row {
       display: grid;
       grid-template-columns: repeat(4, 1fr);
       gap: 1.5rem;
       margin-bottom: 2.5rem;
    }

    .stat-card {
       background: white;
       border-radius: var(--radius-lg);
       padding: 1.5rem;
       box-shadow: var(--shadow-sm);
    }
    
    .stat-card.alert-card {
       border: 1px solid #FECACA;
    }

    .stat-top { display: flex; justify-content: space-between; margin-bottom: 1rem; }
    .icon-box { width: 40px; height: 40px; background: #F3F4F6; border-radius: 8px; }
    .icon-box.alert { background: #FEE2E2; }

    .trend { font-size: 0.75rem; font-weight: 700; }
    .trend.positive { color: var(--success); }
    .trend.negative { color: var(--danger); }

    .stat-value { font-size: 2rem; font-weight: 700; color: var(--secondary-900); line-height: 1.1; margin-bottom: 0.25rem; }
    .stat-value.red { color: var(--danger); }
    
    .stat-label { font-size: 0.85rem; color: var(--text-medium); }

    /* Grid */
    .dashboard-content-grid {
       display: grid;
       grid-template-columns: 1fr 320px;
       gap: 2rem;
    }

    /* Activity Table */
    .activity-section {
       background: white;
       border-radius: var(--radius-lg);
       padding: 1.5rem;
       box-shadow: var(--shadow-sm);
    }

    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .section-header h3 { font-size: 1.1rem; margin: 0; }

    .activity-table { width: 100%; border-collapse: collapse; }
    .activity-table th { text-align: left; font-size: 0.75rem; color: var(--text-light); text-transform: uppercase; padding-bottom: 1rem; border-bottom: 1px solid var(--secondary-100); }
    .activity-table td { padding: 1rem 0; font-size: 0.9rem; border-bottom: 1px solid var(--secondary-100); }
    .activity-table tr:last-child td { border-bottom: none; }

    .user-cell { display: flex; align-items: center; gap: 0.75rem; font-weight: 600; }
    .avatar-xs { width: 28px; height: 28px; border-radius: 50%; background: #eee; object-fit: cover; }

    .status-badge { font-size: 0.7rem; padding: 0.2rem 0.6rem; border-radius: 4px; font-weight: 600; }
    .status-active { background: #DCFCE7; color: #15803D; }
    .status-pending { background: #FFEDD5; color: #C2410C; }
    .status-flagged { background: #FEE2E2; color: #B91C1C; }

    .date-cell { color: var(--text-light); font-size: 0.85rem; }

    /* Panels */
    .right-panels { display: flex; flex-direction: column; gap: 1.5rem; }
    
    .panel {
       background: white;
       border-radius: var(--radius-lg);
       padding: 1.5rem;
       box-shadow: var(--shadow-sm);
    }
    
    .panel-title { font-size: 1rem; margin-bottom: 1.25rem; }
    .panel-title.red { color: var(--danger); }

    .dispute-item { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
    .dispute-icon { width: 32px; height: 32px; background: #FEE2E2; border-radius: 50%; flex-shrink: 0; }
    .dispute-content h4 { font-size: 0.9rem; margin-bottom: 0.25rem; }
    .dispute-content p { font-size: 0.8rem; color: var(--text-medium); line-height: 1.4; margin-bottom: 0.75rem; }
    
    .btn-dark { background: #1F2937; color: white; padding: 0.3rem 0.75rem; border-radius: 4px; font-size: 0.75rem; }
    
    .panel-footer { text-align: center; color: var(--text-light); font-size: 0.8rem; padding-top: 0.5rem; border-top: 1px solid var(--secondary-100); }

    /* Top Performers */
    .performer-item { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
    .rank { font-weight: 700; color: #B45309; width: 10px; font-size: 0.9rem; }
    .avatar-sm { width: 36px; height: 36px; border-radius: 50%; background: #ddd; object-fit: cover;}
    .p-info { flex: 1; }
    .p-name { font-size: 0.9rem; font-weight: 600; }
    .p-sub { font-size: 0.75rem; color: var(--text-light); }
    .p-income { font-weight: 700; font-size: 0.9rem; }
  `]
})
export class AdminDashboardComponent {
    activities = [
        { name: 'Alex M.', role: 'Worker', action: 'Bid on #8821', status: 'Active', statusClass: 'status-active', date: '2 mins ago', avatar: 'assets/avatar-placeholder.png' },
        { name: 'Sarah J.', role: 'Customer', action: 'Posted #9102', status: 'Active', statusClass: 'status-active', date: '15 mins ago', avatar: 'assets/avatar-placeholder.png' },
        { name: 'Carlos R.', role: 'Worker', action: 'Verification Request', status: 'Pending', statusClass: 'status-pending', date: '1 hour ago', avatar: 'assets/avatar-placeholder.png' },
        { name: 'Emily W.', role: 'Customer', action: 'Reported Issue', status: 'Flagged', statusClass: 'status-flagged', date: '3 hours ago', avatar: 'assets/avatar-placeholder.png' },
        { name: 'Hamid K.', role: 'Worker', action: 'Completed #8810', status: 'Active', statusClass: 'status-active', date: '4 hours ago', avatar: 'assets/avatar-placeholder.png' }
    ];

    disputes = [
        {
            title: 'Unfinished Job Report',
            desc: 'User @mark_s reported incomplete work on task #8821. Funds held in escrow.',
            actionLabel: 'Review Case'
        },
        {
            title: 'Harassment Flag',
            desc: 'Automated flag on chat logs for Task #7721 between Worker and Client.',
            actionLabel: 'View Logs'
        }
    ];

    performers = [
        { name: 'Raj P.', jobs: 48, income: '$3.2k', avatar: 'assets/avatar-placeholder.png' },
        { name: 'Elena D.', jobs: 41, income: '$2.8k', avatar: 'assets/avatar-placeholder.png' }
    ];
}
