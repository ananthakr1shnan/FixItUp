import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService, Conversation } from '../../../core/services/message.service';
import { AuthService } from '../../../core/services/auth.service';
import { ChatComponent } from '../../../shared/components/chat.component';

@Component({
  selector: 'app-customer-messages',
  standalone: true,
  imports: [CommonModule, ChatComponent],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class CustomerMessagesComponent implements OnInit {
  conversations: Conversation[] = [];
  selectedConversation: Conversation | null = null;
  currentUserId: number = 0;

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.currentUserId = user.id;
      await this.loadConversations();
    }
  }

  async loadConversations() {
    try {
      this.conversations = await this.messageService.getUserConversations(this.currentUserId);
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  }

  selectConversation(conversation: Conversation) {
    this.selectedConversation = conversation;
    this.cdr.detectChanges();
  }

  backToList() {
    console.log('CustomerMessagesComponent: backToList called, clearing selectedConversation');
    this.selectedConversation = null;
    this.cdr.detectChanges(); // Force UI update
    this.loadConversations();
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  }
}
