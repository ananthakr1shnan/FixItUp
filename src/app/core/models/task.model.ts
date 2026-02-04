export interface TaskEntity {
    id: number;
    customerId: number;
    assignedWorkerId?: number;
    title: string;
    description: string;
    category: string;
    location: string;
    minBudget: number;
    maxBudget: number;
    isUrgent: boolean;
    status: 'Posted' | 'Bidding' | 'Accepted' | 'InProgress' | 'Completed' | 'UnderDispute';
    beforeImageURL?: string;
    afterImageURL?: string;
    createdAt: Date;
}

export interface TaskDTO {
    id: number;
    title: string;
    category: string;
    status: string;
    isUrgent: boolean;
    location: string;
    timeAgo: string;
    distanceInMiles: number;
}

export interface TaskChecklistItem {
    id: number;
    taskId: number;
    taskItem: string;
    isDone: boolean;
}

export interface Dispute {
    id: number;
    taskId: number;
    raisedByRole: 'Customer' | 'Worker';
    type: 'Damage' | 'Quality' | 'Delay';
    evidenceUrl: string;
    status: 'Open' | 'Resolved';
}
