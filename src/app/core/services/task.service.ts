import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

// Basic Task Interface matching backend model
export interface Task {
    id: number;
    title: string;
    description: string;
    category: string;
    state: string;
    city: string;
    location: string;
    minBudget: number;
    maxBudget: number;
    isUrgent: boolean;
    status: string;
    createdAt: string;
    distance?: string; // Calculated or mock for now
    timeAgo?: string; // Calculated
}

export interface WorkerInfo {
    id: number;
    fullName: string;
    trustScore: number;
    isTopRated: boolean;
    isVerifiedPro: boolean;
    jobsCompleted: number;
}

export interface BidWithWorker {
    id: number;
    amount: number;
    estimatedHours: number;
    workerId: number;
    createdAt: string;
    worker: WorkerInfo;
}

export interface CustomerTask {
    id: number;
    title: string;
    description: string;
    category: string;
    location: string;
    minBudget: number;
    maxBudget: number;
    isUrgent: boolean;
    status: string;
    createdAt: string;
    assignedWorkerId?: number;
    bidsCount: number;
    bids: BidWithWorker[];
}

export interface WorkerJob {
    id: number;
    title: string;
    description: string;
    category: string;
    location: string;
    state: string;
    city: string;
    status: string;
    createdAt: string;
    customerId: number;
    customer: {
        id: number;
        fullName: string;
        email: string;
    };
    acceptedBid: {
        id: number;
        amount: number;
        estimatedHours: number;
    };
}

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private apiUrl = 'https://localhost:7043/api';

    constructor(private http: HttpClient) { }

    async getNearbyTasks(workerId?: number): Promise<Task[]> {
        const params: any = {};
        if (workerId) params.workerId = workerId;

        const tasks = await firstValueFrom(this.http.get<Task[]>(`${this.apiUrl}/tasks/nearby`, { params }));

        // Enrich data for UI (mock distance/time for now as backend doesn't calculate)
        return tasks.map(t => ({
            ...t,
            distance: '1.2 km', // Mock
            timeAgo: '1 hour ago' // Mock
        }));
    }

    async getCustomerTasks(customerId: number): Promise<CustomerTask[]> {
        console.log('TaskService: Fetching tasks for customer ID:', customerId);
        try {
            const result = await firstValueFrom(
                this.http.get<CustomerTask[]>(`${this.apiUrl}/tasks/customer/${customerId}`)
            );
            console.log('TaskService: API response:', result);
            return result;
        } catch (error) {
            console.error('TaskService: Error fetching tasks:', error);
            throw error;
        }
    }

    async createTask(task: any): Promise<any> {
        return await firstValueFrom(
            this.http.post(`${this.apiUrl}/tasks/create`, task)
        );
    }

    async getWorkerJobs(workerId: number): Promise<WorkerJob[]> {
        return await firstValueFrom(
            this.http.get<WorkerJob[]>(`${this.apiUrl}/tasks/worker/${workerId}/my-jobs`)
        );
    }

    async updateTaskStatus(taskId: number, status: string): Promise<any> {
        return await firstValueFrom(
            this.http.put(`${this.apiUrl}/tasks/${taskId}/status`, { status })
        );
    }
}
