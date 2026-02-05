import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BidService {
    private apiUrl = '/api/bids';

    constructor(private http: HttpClient) { }

    async acceptBid(bidId: number): Promise<any> {
        return await firstValueFrom(
            this.http.post(`${this.apiUrl}/${bidId}/accept`, {})
        );
    }

    async placeBid(bid: any): Promise<any> {
        return await firstValueFrom(
            this.http.post(`${this.apiUrl}/place`, bid)
        );
    }
}
