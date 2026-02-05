import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TaskService } from '../../core/services/task.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dispute-reporting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dispute-reporting.html',
  styleUrls: ['./dispute-reporting.css']
})
export class DisputeReportingComponent implements OnInit {
  step = 0; // Start at step 0 for task selection if no taskId provided
  selectedIssue = '';
  description = '';
  taskId: number = 0;
  isSubmitting = false;
  certificationAccepted = false;
  taskDetails: any = null;
  isLoadingTask = false;
  userTasks: any[] = []; // List of tasks for selection
  isLoadingTasks = false;

  issueTypes = [
    { id: 'Theft', label: 'Theft of Property', icon: 'bi-shield-exclamation', color: '#EF4444' },
    { id: 'Damage', label: 'Property Damage', icon: 'bi-house-slash', color: '#F97316' },
    { id: 'Harassment', label: 'Harassment', icon: 'bi-person-x', color: '#EF4444' },
    { id: 'Quality', label: 'Poor Quality', icon: 'bi-tools', color: '#EAB308' },
    { id: 'Delay', label: 'Major Delay', icon: 'bi-hourglass-bottom', color: '#3B82F6' },
    { id: 'Other', label: 'Something Else', icon: 'bi-question-circle', color: '#6B7280' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private taskService: TaskService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.route.params.subscribe(params => {
      if (params['taskId']) {
        this.taskId = +params['taskId'];
        this.step = 1; // Skip to issue selection if taskId is provided
      }
    });
  }

  ngOnInit() {
    if (this.taskId) {
      this.loadTaskDetails();
    } else {
      this.loadUserTasks();
    }
  }

  loadUserTasks() {
    const user = this.authService.currentUser();
    console.log('DisputeReporting: Current user:', user);
    if (!user) {
      console.warn('DisputeReporting: No user found');
      return;
    }

    this.isLoadingTasks = true;
    // For customers, get their posted tasks; for workers, get their assigned tasks
    const endpoint = user.role === 'Customer'
      ? `/api/tasks/customer/${user.id}`
      : `/api/tasks/worker/${user.id}/my-jobs`;

    console.log('DisputeReporting: calling endpoint', endpoint);

    this.http.get<any[]>(endpoint).subscribe({
      next: (tasks) => {
        console.log('DisputeReporting: tasks loaded raw', tasks);
        // Ensure tasks is an array even if API returns a single object
        this.userTasks = Array.isArray(tasks) ? tasks : (tasks ? [tasks] : []);
        console.log('DisputeReporting: processed userTasks:', this.userTasks);
        this.isLoadingTasks = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('DisputeReporting: Error loading tasks', err);
        this.isLoadingTasks = false;
      }
    });
  }

  selectTask(task: any) {
    this.taskId = task.id;
    this.taskDetails = task;
    this.step = 1; // Move to issue selection step
  }

  loadTaskDetails() {
    this.isLoadingTask = true;
    this.http.get(`/api/tasks/${this.taskId}`).subscribe({
      next: (task: any) => {
        this.taskDetails = task;
        this.isLoadingTask = false;
      },
      error: (err) => {
        console.error('Error loading task details', err);
        this.isLoadingTask = false;
      }
    });
  }

  selectIssue(issueId: string) {
    this.selectedIssue = issueId;
  }

  nextStep() {
    if (this.step < 3) this.step++;
  }

  prevStep() {
    if (this.step > 0) {
      this.step--;
    } else {
      // If at step 0, go back to disputes list
      this.router.navigate(['/app/disputes']);
    }
  }

  submitReport() {
    if (!this.selectedIssue || !this.description || !this.certificationAccepted) return;

    this.isSubmitting = true;
    const currentUser = this.authService.currentUser();
    const report = {
      taskId: this.taskId,
      raisedByRole: currentUser?.role || 'Customer',
      type: this.selectedIssue,
      description: this.description,
      evidenceUrl: 'mock-evidence.jpg', // TODO: Implement file upload
      status: 'Open'
    };

    this.http.post('/api/disputes', report).subscribe({
      next: () => {
        alert('Dispute reported successfully. Our support team will contact you.');
        this.router.navigate(['/app/disputes']);
      },
      error: (err) => {
        console.error('Error reporting dispute', err);
        alert('Failed to submit report. Please try again.');
        this.isSubmitting = false;
      }
    });
  }

  onFileSelected(event: any) {
    // Mock file upload
    console.log('File selected', event.target.files[0]);
  }
}
