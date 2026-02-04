export interface User {
    id: number;
    fullName: string;
    email: string;
    passwordHash?: string; // Optional on frontend usually
    role: 'Customer' | 'Worker' | 'Admin';
    isAcceptingJobs: boolean;
    trustScore: number;
    jobCompletionRate: number;
    onTimeArrivalRate: number;
    avgResponseTime: number; // in minutes
    isTopRated: boolean;
    isVerifiedPro: boolean;
    isFastBidder: boolean;
    availableBalance: number;
    pendingClearance: number;
    specializedSkills?: { id: number, name: string }[];
}
