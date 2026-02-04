import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

// Basic Task Interface matching backend model
export interface Task {
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
    distance?: string; // Calculated or mock for now
    timeAgo?: string; // Calculated
}

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private apiUrl = 'http://localhost:5245/api';

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
}
