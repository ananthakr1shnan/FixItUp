import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface AdminStats {
    totalWorkers: number;
    totalUsers: number;
    totalTasks: number;
    activeTasks: number;
    pendingVerifications: number;
    openDisputes: number;
}

export interface Worker {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    location: string;
    skills?: string;
    trustScore: number;
    jobsCompleted: number;
    isActive: boolean;
    createdAt: string;
    earnings?: number;
    rating?: number;
    onTimeRate?: number;
}

export interface Customer {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    location: string;
    isActive: boolean;
    createdAt: string;
    tasksPosted?: number;
    totalSpent?: number;
    completedTasks?: number;
}

export interface AdminTask {
    id: number;
    title: string;
    description: string;
    category: string;
    location: string;
    minBudget: number;
    maxBudget: number;
    status: string;
    createdAt: string;
    customerId: number;
    assignedWorkerId?: number;
    customerName?: string;
    workerName?: string;
    bidsCount?: number;
}

export interface Activity {
    id: number;
    userName: string;
    userRole: string;
    action: string;
    timestamp: string;
    status: string;
}

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = 'https://localhost:7043/api';

    constructor(private http: HttpClient) { }

    async getStats(): Promise<AdminStats> {
        try {
            return await firstValueFrom(
                this.http.get<AdminStats>(`${this.apiUrl}/admin/stats`)
            );
        } catch (error) {
            console.error('Error fetching admin stats:', error);
            // Return mock data if API fails
            return {
                totalWorkers: 0,
                totalUsers: 0,
                totalTasks: 0,
                activeTasks: 0,
                pendingVerifications: 0,
                openDisputes: 0
            };
        }
    }

    async getAllWorkers(): Promise<Worker[]> {
        try {
            // Try to get all users from admin endpoint
            const users = await firstValueFrom(
                this.http.get<any[]>(`${this.apiUrl}/admin/users`)
            );
            return users
                .filter(u => u.role === 'Worker')
                .map(u => ({
                    id: u.id,
                    fullName: u.fullName || u.name || 'Unknown',
                    email: u.email,
                    phone: u.phone || 'N/A',
                    location: `${u.city || ''}, ${u.state || ''}`.trim().replace(/^,|,$/g, '') || 'N/A',
                    skills: u.skills || 'N/A',
                    trustScore: u.trustScore || 0,
                    jobsCompleted: u.jobsCompleted || 0,
                    isActive: u.isActive !== false,
                    createdAt: u.createdAt,
                    earnings: u.earnings || 0,
                    rating: u.rating || 0,
                    onTimeRate: u.onTimeRate || 0
                }));
        } catch (error: any) {
            console.error('Error fetching workers:', error);
            if (error.status === 404) {
                console.warn('Admin endpoint not found. Please add GET /api/admin/users endpoint to AdminController.cs');
            }
            return [];
        }
    }

    async getAllCustomers(): Promise<Customer[]> {
        try {
            const users = await firstValueFrom(
                this.http.get<any[]>(`${this.apiUrl}/admin/users`)
            );
            return users
                .filter(u => u.role === 'Customer')
                .map(u => ({
                    id: u.id,
                    fullName: u.fullName || u.name || 'Unknown',
                    email: u.email,
                    phone: u.phone || 'N/A',
                    location: `${u.city || ''}, ${u.state || ''}`.trim().replace(/^,|,$/g, '') || 'N/A',
                    isActive: u.isActive !== false,
                    createdAt: u.createdAt,
                    tasksPosted: u.tasksPosted || 0,
                    totalSpent: u.totalSpent || 0,
                    completedTasks: u.completedTasks || 0
                }));
        } catch (error: any) {
            console.error('Error fetching customers:', error);
            if (error.status === 404) {
                console.warn('Admin endpoint not found. Please add GET /api/admin/users endpoint to AdminController.cs');
            }
            return [];
        }
    }

    async getAllTasks(): Promise<AdminTask[]> {
        try {
            const tasks = await firstValueFrom(
                this.http.get<any[]>(`${this.apiUrl}/tasks/all`)
            );
            return tasks.map(t => ({
                id: t.id,
                title: t.title,
                description: t.description,
                category: t.category,
                location: t.location || `${t.city}, ${t.state}`,
                minBudget: t.minBudget,
                maxBudget: t.maxBudget,
                status: t.status,
                createdAt: t.createdAt,
                customerId: t.customerId,
                assignedWorkerId: t.assignedWorkerId,
                customerName: t.customerName,
                workerName: t.workerName,
                bidsCount: t.bidsCount || 0
            }));
        } catch (error: any) {
            console.error('Error fetching tasks:', error);
            if (error.status === 404) {
                console.warn('Tasks endpoint not found. Please add GET /api/tasks/all endpoint to TasksController.cs');
            }
            return [];
        }
    }

    async getRecentActivity(): Promise<Activity[]> {
        try {
            return await firstValueFrom(
                this.http.get<Activity[]>(`${this.apiUrl}/admin/activity`)
            );
        } catch (error) {
            console.error('Error fetching activity:', error);
            return [];
        }
    }
}
