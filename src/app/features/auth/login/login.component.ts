import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to continue to FixItUp</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
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
              placeholder="••••••••"
              [class.is-invalid]="isFieldInvalid('password')"
            >
            <div class="error-message" *ngIf="isFieldInvalid('password')">
              Password is required.
            </div>
          </div>

          <div class="form-actions">
             <a routerLink="/forgot-password" class="forgot-link">Forgot password?</a>
          </div>

          <button type="submit" class="btn btn-primary btn-block" [disabled]="loginForm.invalid || isLoading">
            <span *ngIf="isLoading">Signing in...</span>
            <span *ngIf="!isLoading">Sign In</span>
          </button>
          
        </form>

        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/register">Create one</a></p>
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
      max-width: 450px;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .auth-header h2 { font-size: 1.75rem; margin-bottom: 0.5rem; color: var(--secondary-900); }
    .auth-header p { color: var(--text-medium); }

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

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 1.5rem;
    }

    .forgot-link {
      color: var(--primary-600);
      font-size: 0.9rem;
      font-weight: 500;
    }

    .btn-block {
      width: 100%;
      padding: 0.875rem;
      font-size: 1rem;
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
    
    .demo-helper {
       margin-top: 1rem;
       text-align: center;
       background: #f0f9ff;
       padding: 0.5rem;
       border-radius: 4px;
       color: #0369a1;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;

      try {
        await this.authService.login(email, password);
        // Navigation is handled in AuthService for now, or we can move it here.
        // The service handles it in the current implementation.
      } catch (error) {
        console.error('Login failed', error);
      } finally {
        this.isLoading = false;
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
