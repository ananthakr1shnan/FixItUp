export interface Bid {
    id: number;
    taskId: number;
    workerId: number;
    amount: number;
    estimatedHours: number;
    createdAt: Date;
}

export interface BidDTO {
    bidId: number;
    amount: number;
    estimatedHours: number;
    workerName: string;
    trustScore: number;
    competitivenessScore: string; // e.g. "High", "Medium"
    isTopRated: boolean;
}
