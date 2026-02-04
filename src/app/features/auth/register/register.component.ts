import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Create Account</h2>
          <p>Join FixItUp today</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          
          <!-- Role Selection -->
          <div class="role-selector">
             <div 
               class="role-option" 
               [class.active]="selectedRole === 'Customer'"
               (click)="setRole('Customer')"
             >
                <span class="icon">🏠</span>
                <span class="label">Homeowner</span>
             </div>
             <div 
               class="role-option" 
               [class.active]="selectedRole === 'Worker'"
               (click)="setRole('Worker')"
             >
                <span class="icon">🛠️</span>
                <span class="label">Professional</span>
             </div>
          </div>

          <!-- Skill Selection for Workers -->
          <div class="form-group" *ngIf="selectedRole === 'Worker'">
             <label>Specialized Skills (Select all that apply)</label>
             <div class="skills-grid">
                <div 
                   *ngFor="let cat of categories" 
                   class="skill-chip"
                   [class.selected]="selectedCategoryIds.includes(cat.id)"
                   (click)="toggleSkill(cat.id)"
                >
                   {{ cat.name }}
                </div>
             </div>
             <div class="error-message" *ngIf="isSubmitted && selectedCategoryIds.length === 0">
                Please select at least one skill.
             </div>
          </div>
          
          <div class="form-group">
            <label for="fullName">Full Name</label>
            <input 
              id="fullName" 
              type="text" 
              formControlName="fullName" 
              class="form-control" 
              placeholder="e.g. John Doe"
              [class.is-invalid]="isFieldInvalid('fullName')"
            >
            <div class="error-message" *ngIf="isFieldInvalid('fullName')">
              Full Name is required.
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <input 
              id="email" 
              type="email" 
              formControlName="email" 
              class="form-control" 
              placeholder="you@example.com"
              [class.is-invalid]="isFieldInvalid('email')"
            >
            <div class="error-message" *ngIf="isFieldInvalid('email')">
              Please enter a valid email.
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              id="password" 
              type="password" 
              formControlName="password" 
              class="form-control" 
              placeholder="Min 6 characters"
              [class.is-invalid]="isFieldInvalid('password')"
            >
             <div class="error-message" *ngIf="isFieldInvalid('password')">
              Password must be at least 6 characters.
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-block" [disabled]="registerForm.invalid || isLoading">
            <span *ngIf="isLoading">Creating Account...</span>
            <span *ngIf="!isLoading">
              {{ selectedRole === 'Worker' ? 'Join as Professional' : 'Join as Homeowner' }}
            </span>
          </button>
          
          <p class="terms-text">
            By clicking "Join", you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Log In</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      background-color: var(--secondary-100);
    }

    .auth-card {
      background: white;
      padding: 2.5rem;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      width: 100%;
      max-width: 500px;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .auth-header h2 { font-size: 1.75rem; margin-bottom: 0.5rem; color: var(--secondary-900); }
    .auth-header p { color: var(--text-medium); }

    /* Role Selector */
    .role-selector {
       display: flex;
       gap: 1rem;
       margin-bottom: 2rem;
    }
    
    .role-option {
       flex: 1;
       border: 2px solid var(--secondary-200);
       border-radius: var(--radius-md);
       padding: 1rem;
       text-align: center;
       cursor: pointer;
       transition: all 0.2s;
    }
    
    .role-option:hover { border-color: var(--primary-500); }
    
    .role-option.active {
       border-color: var(--primary-500);
       background-color: var(--primary-100);
       color: var(--primary-600);
    }
    
    .role-option .icon { display: block; font-size: 1.5rem; margin-bottom: 0.5rem; }
    .role-option .label { font-weight: 600; font-size: 0.9rem; }

    /* Skills Grid */
    .skills-grid {
       display: flex;
       flex-wrap: wrap;
       gap: 0.5rem;
       margin-top: 0.5rem;
    }

    .skill-chip {
       padding: 0.4rem 0.8rem;
       border: 1px solid var(--secondary-200);
       border-radius: 99px;
       font-size: 0.85rem;
       color: var(--secondary-600);
       cursor: pointer;
       transition: all 0.2s;
    }
    .skill-chip:hover { border-color: var(--secondary-400); background: var(--secondary-50); }
    .skill-chip.selected {
       background-color: var(--primary-500);
       color: white;
       border-color: var(--primary-500);
    }

    .form-group { margin-bottom: 1.5rem; }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--secondary-900);
      font-size: 0.9rem;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid black;
      border-radius: var(--radius-md);
      font-size: 1rem;
      transition: all 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgba(232, 93, 4, 0.1);
    }
    
    .form-control.is-invalid {
       border-color: var(--danger);
    }
    
    .error-message {
      color: var(--danger);
      font-size: 0.8rem;
      margin-top: 0.25rem;
    }

    .btn-block {
      width: 100%;
      padding: 0.875rem;
      font-size: 1rem;
    }
    
    .terms-text {
       font-size: 0.75rem;
       color: var(--text-light);
       margin-top: 1rem;
       text-align: center;
       line-height: 1.4;
    }

    .auth-footer {
      margin-top: 2rem;
      text-align: center;
      font-size: 0.95rem;
      color: var(--text-medium);
    }

    .auth-footer a {
      color: var(--primary-600);
      font-weight: 600;
      margin-left: 0.25rem;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  selectedRole: 'Customer' | 'Worker' = 'Customer';
  isSubmitted = false;

  categories = [
    { id: 1, name: 'Plumbing' },
    { id: 2, name: 'Electrical' },
    { id: 3, name: 'Carpentry' },
    { id: 4, name: 'Painting' },
    { id: 5, name: 'Assembly' },
    { id: 6, name: 'Cleaning' },
    { id: 7, name: 'Maintenance' },
    { id: 8, name: 'Moving' }
  ];
  selectedCategoryIds: number[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  toggleSkill(id: number) {
    if (this.selectedCategoryIds.includes(id)) {
      this.selectedCategoryIds = this.selectedCategoryIds.filter(cid => cid !== id);
    } else {
      this.selectedCategoryIds.push(id);
    }
  }

  setRole(role: 'Customer' | 'Worker') {
    this.selectedRole = role;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched || this.isSubmitted));
  }

  async onSubmit() {
    this.isSubmitted = true;

    if (this.registerForm.valid) {
      if (this.selectedRole === 'Worker' && this.selectedCategoryIds.length === 0) {
        return; // Show error via *ngIf
      }

      this.isLoading = true;

      const userData = {
        fullName: this.registerForm.value.fullName,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        role: this.selectedRole,
        categoryIds: this.selectedRole === 'Worker' ? this.selectedCategoryIds : []
      };

      const success = await this.authService.register(userData);
      this.isLoading = false;

      if (success) {
        this.router.navigate(['/login']);
      } else {
        alert('Registration failed. Please try again.');
      }
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
import { AuthService } from '../../../core/services/auth.service';
