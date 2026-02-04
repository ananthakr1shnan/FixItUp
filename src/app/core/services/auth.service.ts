import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    currentUser = signal<User | null>(null);
    private apiUrl = 'http://localhost:5245/api';

    constructor(private router: Router, private http: HttpClient) {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            this.currentUser.set(JSON.parse(storedUser));
        }
    }

    async register(userData: any): Promise<boolean> {
        try {
            await firstValueFrom(this.http.post(`${this.apiUrl}/auth/register`, userData));
            return true;
        } catch (error) {
            console.error('Registration failed', error);
            return false;
        }
    }

    async login(email: string, password: string): Promise<boolean> {
        try {
            // Updated to expect { user: User } or similar from backend, 
            // but backend Login controller returns { id, role } currently.
            // We need full user details. 
            // Let's assume for now we get ID and Role, then fetch Profile? 
            // Optimization: Update Backend Login to return full User or at least key props.
            // Current Backend: return Ok(new { user.Id, user.Role });

            const response: any = await firstValueFrom(this.http.post(`${this.apiUrl}/auth/login`, null, { params: { email, password } }));

            if (response && response.id) {
                // Fetch full profile to get details + skills
                const userProfile: any = await firstValueFrom(this.http.get(`${this.apiUrl}/users/${response.id}/profile`));

                // Map backend response to User model
                const user: User = {
                    id: userProfile.id,
                    fullName: userProfile.fullName,
                    email: userProfile.email,
                    role: userProfile.role,
                    isAcceptingJobs: userProfile.role === 'Worker', // Default or derived
                    trustScore: userProfile.trustScore || 0,
                    jobCompletionRate: userProfile.jobCompletionRate || 0,
                    onTimeArrivalRate: 0, // Not in profile response yet
                    avgResponseTime: 0, // Not in profile response yet
                    isTopRated: userProfile.isTopRated,
                    isVerifiedPro: userProfile.isVerifiedPro,
                    isFastBidder: false,
                    availableBalance: 0, // Not in profile response yet, assume 0 for safety or update backend
                    pendingClearance: 0,
                    specializedSkills: userProfile.specializedSkills
                };

                this.currentUser.set(user);
                localStorage.setItem('currentUser', JSON.stringify(user));

                if (user.role === 'Worker') {
                    this.router.navigate(['/app/worker-dashboard']);
                } else if (user.role === 'Admin') {
                    this.router.navigate(['/app/admin-dashboard']);
                } else {
                    this.router.navigate(['/app/dashboard']);
                }
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login failed', error);
            return false;
        }
    }

    logout() {
        this.currentUser.set(null);
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
    }
}
