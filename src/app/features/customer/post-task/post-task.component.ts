import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { AuthService } from '../../../core/services/auth.service';
import { LocationService } from '../../../core/services/location.service';

@Component({
  selector: 'app-post-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="post-task-container">
      <div class="form-card">
        <div class="form-header">
          <button class="btn-back" (click)="goBack()">
            <i class="bi bi-arrow-left"></i> Back
          </button>
          <h1>Post a New Task</h1>
          <p>Fill in the details below to get help from skilled workers</p>
        </div>

        <form (ngSubmit)="submitTask()" #taskForm="ngForm">
          <!-- Title -->
          <div class="form-group">
            <label for="title">Task Title <span class="required">*</span></label>
            <input
              type="text"
              id="title"
              name="title"
              [(ngModel)]="task.title"
              required
              placeholder="e.g., Master Bathroom Plumbing Fix"
              class="form-control"
              maxlength="100"
            />
            <small class="form-text">Provide a clear, descriptive title</small>
          </div>

          <!-- Category -->
          <div class="form-group">
            <label for="category">Category <span class="required">*</span></label>
            <select
              id="category"
              name="category"
              [(ngModel)]="task.category"
              required
              class="form-control"
            >
              <option value="">Select a category</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Carpentry">Carpentry</option>
              <option value="Painting">Painting</option>
              <option value="Cleaning">Cleaning</option>
              <option value="HVAC">HVAC</option>
              <option value="Landscaping">Landscaping</option>
              <option value="Roofing">Roofing</option>
              <option value="Flooring">Flooring</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <!-- Description -->
          <div class="form-group">
            <label for="description">Description <span class="required">*</span></label>
            <textarea
              id="description"
              name="description"
              [(ngModel)]="task.description"
              required
              placeholder="Describe the task in detail. What needs to be done? Any specific requirements?"
              class="form-control"
              rows="5"
              maxlength="1000"
            ></textarea>
            <small class="form-text">{{ task.description.length }}/1000 characters</small>
          </div>

          <!-- Location -->
          <div class="form-row">
            <div class="form-group">
              <label>State <span class="required">*</span></label>
              <select
                name="state"
                [(ngModel)]="task.state"
                required
                class="form-control"
                (change)="onStateChange()"
              >
                <option value="">Select a state</option>
                <option *ngFor="let state of states" [value]="state">{{ state }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>City <span class="required">*</span></label>
              <select
                name="city"
                [(ngModel)]="task.city"
                required
                class="form-control"
                [disabled]="!task.state"
              >
                <option value="">Select a city</option>
                <option *ngFor="let city of cities" [value]="city">{{ city }}</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="location">Address/Landmark (Optional)</label>
            <input
              type="text"
              id="location"
              name="location"
              [(ngModel)]="task.location"
              placeholder="e.g., Flat 4B, Sunrise Apartments, Near Metro Station"
              class="form-control"
            />
          </div>

          <!-- Budget Range -->
          <div class="form-row">
            <div class="form-group">
              <label for="minBudget">Minimum Budget (₹) <span class="required">*</span></label>
              <input
                type="number"
                id="minBudget"
                name="minBudget"
                [(ngModel)]="task.minBudget"
                required
                min="0"
                placeholder="500"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="maxBudget">Maximum Budget (₹) <span class="required">*</span></label>
              <input
                type="number"
                id="maxBudget"
                name="maxBudget"
                [(ngModel)]="task.maxBudget"
                required
                min="0"
                placeholder="1000"
                class="form-control"
              />
            </div>
          </div>

          <!-- Urgent Checkbox -->
          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                name="isUrgent"
                [(ngModel)]="task.isUrgent"
              />
              <span>This is an urgent task</span>
            </label>
            <small class="form-text">Urgent tasks are prioritized and shown to workers first</small>
          </div>

          <!-- Before Image URL (Optional) -->
          <div class="form-group">
            <label for="beforeImageURL">Before Image URL (Optional)</label>
            <input
              type="url"
              id="beforeImageURL"
              name="beforeImageURL"
              [(ngModel)]="task.beforeImageURL"
              placeholder="https://example.com/image.jpg"
              class="form-control"
            />
            <small class="form-text">Provide an image URL showing the current state</small>
          </div>

          <!-- Error Message -->
          <div *ngIf="errorMessage" class="alert alert-error">
            {{ errorMessage }}
          </div>

          <!-- Success Message -->
          <div *ngIf="successMessage" class="alert alert-success">
            {{ successMessage }}
          </div>

          <!-- Action Buttons -->
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" (click)="goBack()">
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn btn-primary" 
              [disabled]="!taskForm.form.valid || isSubmitting"
            >
              {{ isSubmitting ? 'Posting...' : 'Post Task' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .post-task-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .form-card {
      background: white;
      border-radius: var(--radius-lg);
      padding: 2.5rem;
      box-shadow: var(--shadow-lg);
    }

    .form-header {
      margin-bottom: 2.5rem;
      position: relative;
    }

    .btn-back {
      background: none;
      border: none;
      color: var(--primary-500);
      font-size: 0.95rem;
      cursor: pointer;
      padding: 0.5rem 0;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: color 0.2s;
    }

    .btn-back:hover {
      color: var(--primary-600);
    }

    .form-header h1 {
      font-size: 2rem;
      color: var(--secondary-900);
      margin-bottom: 0.5rem;
      font-weight: 700;
    }

    .form-header p {
      color: var(--text-medium);
      font-size: 1rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    label {
      display: block;
      font-weight: 600;
      color: var(--secondary-900);
      margin-bottom: 0.5rem;
      font-size: 0.95rem;
    }

    .required {
      color: #DC2626;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--secondary-300);
      border-radius: var(--radius-md);
      font-size: 0.95rem;
      transition: all 0.2s;
      font-family: inherit;
    }

    .form-control:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgba(141, 59, 35, 0.1);
    }

    .form-control:invalid:not(:placeholder-shown) {
      border-color: #DC2626;
    }

    textarea.form-control {
      resize: vertical;
      min-height: 120px;
    }

    select.form-control {
      cursor: pointer;
    }

    .form-text {
      display: block;
      margin-top: 0.25rem;
      font-size: 0.85rem;
      color: var(--text-light);
    }

    .checkbox-group {
      padding: 1rem;
      background: var(--secondary-50);
      border-radius: var(--radius-md);
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      margin-bottom: 0.5rem;
    }

    .checkbox-label input[type="checkbox"] {
      width: 1.25rem;
      height: 1.25rem;
      cursor: pointer;
    }

    .alert {
      padding: 1rem 1.25rem;
      border-radius: var(--radius-md);
      margin-bottom: 1.5rem;
      font-size: 0.95rem;
    }

    .alert-error {
      background: #FEE2E2;
      color: #991B1B;
      border: 1px solid #FCA5A5;
    }

    .alert-success {
      background: #D1FAE5;
      color: #065F46;
      border: 1px solid #6EE7B7;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid var(--secondary-200);
    }

    .btn {
      padding: 0.85rem 2rem;
      border-radius: var(--radius-md);
      font-weight: 600;
      font-size: 1rem;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background-color: var(--primary-500);
      color: white;
      box-shadow: var(--shadow-md);
    }

    .btn-primary:hover:not(:disabled) {
      background-color: var(--primary-600);
      transform: translateY(-1px);
      box-shadow: var(--shadow-lg);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: white;
      color: var(--secondary-700);
      border: 1px solid var(--secondary-300);
    }

    .btn-secondary:hover {
      background-color: var(--secondary-50);
    }

    @media (max-width: 768px) {
      .post-task-container {
        padding: 1rem 0.5rem;
      }

      .form-card {
        padding: 1.5rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }
    }
  `]
})
export class PostTaskComponent implements OnInit {
  task = {
    title: '',
    description: '',
    category: '',
    state: '',
    city: '',
    location: '',
    minBudget: 0,
    maxBudget: 0,
    isUrgent: false,
    beforeImageURL: '',
    customerId: 0
  };

  states: string[] = [];
  cities: string[] = [];

  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private locationService: LocationService,
    private router: Router
  ) {}

  ngOnInit() {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.task.customerId = currentUser.id;
    
    // Load states
    this.states = this.locationService.getStates();
  }

  onStateChange() {
    this.task.city = '';
    this.cities = [];
    
    if (this.task.state) {
      this.cities = this.locationService.getCities(this.task.state);
    }
  }

  async submitTask() {
    // Validate budget
    if (this.task.minBudget > this.task.maxBudget) {
      this.errorMessage = 'Minimum budget cannot be greater than maximum budget';
      return;
    }

    if (this.task.minBudget <= 0 || this.task.maxBudget <= 0) {
      this.errorMessage = 'Budget must be greater than zero';
      return;
    }

    // Validate location
    if (!this.task.state || !this.task.city) {
      this.errorMessage = 'Please select state and city';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      // Prepare task data
      const taskData: any = {
        customerId: this.task.customerId,
        title: this.task.title,
        description: this.task.description,
        category: this.task.category,
        state: this.task.state,
        city: this.task.city,
        location: this.task.location || `${this.task.city}, ${this.task.state}`,
        minBudget: this.task.minBudget,
        maxBudget: this.task.maxBudget,
        isUrgent: this.task.isUrgent
      };

      // Only include beforeImageURL if it's not empty
      if (this.task.beforeImageURL && this.task.beforeImageURL.trim() !== '') {
        taskData.beforeImageURL = this.task.beforeImageURL;
      }

      await this.taskService.createTask(taskData);
      this.successMessage = 'Task posted successfully! Redirecting...';
      
      setTimeout(() => {
        this.router.navigate(['/app/dashboard']);
      }, 1500);
    } catch (error: any) {
      console.error('Failed to post task:', error);
      
      // Extract detailed error message if available
      if (error?.error?.errors) {
        const errorMessages = Object.values(error.error.errors).flat();
        this.errorMessage = errorMessages.join(', ');
      } else {
        this.errorMessage = error?.error?.title || error?.error?.message || 'Failed to post task. Please try again.';
      }
      
      this.isSubmitting = false;
    }
  }

  goBack() {
    this.router.navigate(['/app/dashboard']);
  }
}
