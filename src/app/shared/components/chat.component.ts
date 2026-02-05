import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService, Message } from '../../core/services/message.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-container">
      <div class="chat-header">
        <h3>{{ chatTitle }}</h3>
        <button class="close-btn" (click)="closeChat()">×</button>
      </div>

      <div class="messages-container" #messagesContainer>
        <div *ngFor="let msg of messages" 
             class="message" 
             [class.sent]="msg.senderId === currentUserId"
             [class.received]="msg.senderId !== currentUserId">
          <div class="message-bubble">
            <p>{{ msg.content }}</p>
            <span class="time">{{ formatTime(msg.createdAt) }}</span>
          </div>
        </div>
        
        <div *ngIf="messages.length === 0" class="no-messages">
          <p>No messages yet. Start the conversation!</p>
        </div>
      </div>

      <div class="chat-input">
        <input 
          type="text" 
          [(ngModel)]="newMessage" 
          (keyup.enter)="sendMessage()"
          placeholder="Type a message..."
          class="message-input"
        >
        <button (click)="sendMessage()" class="send-btn" [disabled]="!newMessage.trim()">
          Send
        </button>
      </div>
    </div>
  `,
  styles: [`
    .chat-container {
      display: flex;
      flex-direction: column;
      height: 600px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      overflow: hidden;
    }

    .chat-header {
      background: var(--primary-500);
      color: white;
      padding: 1rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .chat-header h3 {
      margin: 0;
      font-size: 1.1rem;
    }

    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 2rem;
      cursor: pointer;
      line-height: 1;
      padding: 0;
      width: 30px;
      height: 30px;
    }

    .messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
      background: #F9FAFB;
    }

    .message {
      margin-bottom: 1rem;
      display: flex;
    }

    .message.sent {
      justify-content: flex-end;
    }

    .message.received {
      justify-content: flex-start;
    }

    .message-bubble {
      max-width: 70%;
      padding: 0.75rem 1rem;
      border-radius: 12px;
      position: relative;
    }

    .message.sent .message-bubble {
      background: var(--primary-500);
      color: white;
    }

    .message.received .message-bubble {
      background: white;
      color: var(--secondary-900);
      border: 1px solid var(--secondary-200);
    }

    .message-bubble p {
      margin: 0 0 0.25rem 0;
      word-wrap: break-word;
    }

    .time {
      font-size: 0.7rem;
      opacity: 0.7;
    }

    .no-messages {
      text-align: center;
      color: var(--text-medium);
      padding: 3rem 1rem;
    }

    .chat-input {
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--secondary-200);
      display: flex;
      gap: 0.75rem;
      background: white;
    }

    .message-input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 1px solid var(--secondary-300);
      border-radius: 24px;
      font-size: 0.95rem;
      outline: none;
    }

    .message-input:focus {
      border-color: var(--primary-500);
    }

    .send-btn {
      padding: 0.75rem 1.5rem;
      background: var(--primary-500);
      color: white;
      border: none;
      border-radius: 24px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .send-btn:hover:not(:disabled) {
      background: var(--primary-600);
    }

    .send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class ChatComponent implements OnInit {
  @Input() taskId!: number;
  @Input() otherUserId!: number;
  @Input() chatTitle: string = 'Chat';

  messages: Message[] = [];
  newMessage: string = '';
  currentUserId: number = 0;

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.currentUserId = user.id;
      await this.loadMessages();
      // Mark messages as read
      await this.messageService.markAsRead(this.taskId, this.currentUserId);
    }
  }

  async loadMessages() {
    try {
      this.messages = await this.messageService.getConversation(
        this.taskId,
        this.currentUserId,
        this.otherUserId
      );
      this.cdr.detectChanges();
      this.scrollToBottom();
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  }

  async sendMessage() {
    if (!this.newMessage.trim()) return;

    const message: Message = {
      taskId: this.taskId,
      senderId: this.currentUserId,
      receiverId: this.otherUserId,
      content: this.newMessage.trim()
    };

    try {
      const sentMessage = await this.messageService.sendMessage(message);
      this.messages.push(sentMessage);
      this.newMessage = '';
      this.cdr.detectChanges();
      this.scrollToBottom();
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    }
  }

  formatTime(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  scrollToBottom() {
    setTimeout(() => {
      const container = document.querySelector('.messages-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }

  closeChat() {
    // Emit event to parent component to close chat
    window.history.back();
  }
}
