import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Dispute {
    id?: number;
    taskId: number;
    taskTitle?: string;
    raisedByRole: string;
    type: string;
    description: string;
    evidenceUrl?: string;
    status: string;
    createdAt?: string;
}

@Injectable({
    providedIn: 'root'
})
export class DisputeService {
    private apiUrl = '/api/disputes';

    constructor(private http: HttpClient) { }

    async createDispute(dispute: Dispute): Promise<any> {
        return await firstValueFrom(this.http.post(this.apiUrl, dispute));
    }

    async getUserDisputes(userId: number): Promise<Dispute[]> {
        return await firstValueFrom(this.http.get<Dispute[]>(`${this.apiUrl}/user/${userId}`));
    }
}
