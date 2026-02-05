import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Message {
    id?: number;
    taskId: number;
    senderId: number;
    receiverId: number;
    content: string;
    createdAt?: string;
    isRead?: boolean;
}

export interface Conversation {
    taskId: number;
    taskTitle: string;
    otherUser: {
        id: number;
        name: string;
        role: string;
    };
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
}

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    private apiUrl = 'https://localhost:7043/api/messages';

    constructor(private http: HttpClient) { }

    async getConversation(taskId: number, userId1: number, userId2: number): Promise<Message[]> {
        const params = { taskId, userId1, userId2 };
        return await firstValueFrom(
            this.http.get<Message[]>(`${this.apiUrl}/conversation`, { params: params as any })
        );
    }

    async getUserConversations(userId: number): Promise<Conversation[]> {
        return await firstValueFrom(
            this.http.get<Conversation[]>(`${this.apiUrl}/user/${userId}`)
        );
    }

    async sendMessage(message: Message): Promise<Message> {
        return await firstValueFrom(
            this.http.post<Message>(`${this.apiUrl}/send`, message)
        );
    }

    async markAsRead(taskId: number, userId: number): Promise<any> {
        return await firstValueFrom(
            this.http.post(`${this.apiUrl}/mark-read`, null, {
                params: { taskId, userId } as any
            })
        );
    }
}
