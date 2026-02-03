import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="landing-page">
      <!-- Hero Section -->
      <section class="hero-section container">
        <div class="hero-grid">
          <!-- Customer Side -->
          <div class="hero-card customer-card">
            <div class="badge">For Homeowners</div>
            <h1>Your To-Do List,<br>Done Right.</h1>
            <p>Post any household task and receive competitive bids from verified local professionals in minutes.</p>
            
            <div class="card-visual">
               <!-- Abstract Visual Representation -->
               <div class="mock-ui-card">
                 <div class="mock-header">Mount 65" TV</div>
                 <div class="mock-sub">Need help mounting a TV on drywall...</div>
                 <div class="mock-price">₹300 - ₹400</div>
               </div>
            </div>

            <a routerLink="/register" class="btn btn-primary btn-lg">Post a Task for Free</a>
          </div>

          <!-- Worker Side -->
          <div class="hero-card worker-card">
            <div class="badge badge-dark">For Professionals</div>
            <h1>Turn Skills<br>Into Income.</h1>
            <p>Find jobs nearby, bid your price, and build your reputation. No lead fees, just honest work.</p>
            
            <div class="card-visual">
               <div class="mock-ui-card dark-ui">
                 <div class="mock-header">Nearby Opportunities</div>
                 <div class="mock-item">
                    <span>Leaky Faucet Repair</span>
                    <span class="price">  ₹450</span>
                 </div>
                 <div class="mock-item">
                    <span>Furniture Assembly</span>
                    <span class="price">  ₹500</span>
                 </div>
               </div>
            </div>

            <a routerLink="/register-worker" class="btn btn-outline btn-lg inverse">Find Work Near You</a>
          </div>
        </div>
      </section>

      <!-- Stats Strip -->
      <section class="stats-strip">
        <div class="container stats-grid">
          <div class="stat-item">
            <div class="value">12k+</div>
            <div class="label">Tasks Completed</div>
          </div>
          <div class="stat-item">
            <div class="value">4.8/5</div>
            <div class="label">Average Rating</div>
          </div>
          <div class="stat-item">
            <div class="value">25min</div>
            <div class="label">Avg. Bid Time</div>
          </div>
          <div class="stat-item">
            <div class="value">₹2M+</div>
            <div class="label">Paid to Workers</div>
          </div>
        </div>
      </section>

      <!-- How It Works -->
      <section class="how-it-works container">
        <div class="section-header">
          <h2>How FixItUp Works</h2>
          <p>Simple, transparent, and built for trust.</p>
        </div>

        <div class="steps-grid">
          <div class="step-card">
            <div class="step-icon">1</div>
            <h3>Post a Task</h3>
            <p>Describe what you need done, add photos, and set your budget range.</p>
          </div>
          <div class="step-card">
            <div class="step-icon">2</div>
            <h3>Receive Bids</h3>
            <p>Local workers review your job and submit competitive bids quickly.</p>
          </div>
          <div class="step-card">
            <div class="step-icon">3</div>
            <h3>Select & Hire</h3>
            <p>Compare profiles, ratings, and prices. Pick the best fit for the job.</p>
          </div>
          <div class="step-card">
            <div class="step-icon">4</div>
            <h3>Job Done</h3>
            <p>Payment is released only when you're satisfied. Review the work.</p>
          </div>
        </div>
      </section>

      <!-- Urgent Requests -->
      <section class="urgent-requests">
        <div class="container">
          <div class="section-header-row">
             <div class="title-group">
               <span class="live-dot"></span>
               <h2>Live Urgent Requests</h2>
               <p>These neighbors need help right now.</p>
             </div>
             <a routerLink="/tasks" class="btn btn-ghost">View All Tasks</a>
          </div>

          <div class="tasks-grid">
            <div class="task-card" *ngFor="let task of urgentTasks">
              <div class="task-header">
                <h3>{{ task.title }}</h3>
                <span class="badge-urgent" *ngIf="task.isUrgent">URGENT</span>
              </div>
              <div class="task-meta">
                <span>{{ task.location }}</span>
                <span>{{ task.timeAgo }}</span>
              </div>
              <p class="task-desc">{{ task.description }}</p>
              <div class="task-footer">
                <div class="budget">
                  <span class="label">Budget</span>
                  <span class="value">{{ task.budget }}</span>
                </div>
                <!-- Action depends on user type, just show button for now -->
                <button class="btn btn-primary btn-sm">Place Bid</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Bottom CTA -->
      <section class="bottom-cta">
        <div class="container cta-content">
          <h2>Ready to get started?</h2>
          <p>Join thousands of neighbors getting things done every day.</p>
          <div class="cta-buttons">
            <a routerLink="/register" class="btn btn-primary btn-lg">Post a Task</a>
            <a routerLink="/register-worker" class="btn btn-outline btn-lg inverse">Become a Worker</a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .landing-page {
      display: flex;
      flex-direction: column;
      gap: 4rem;
      padding-top: 2rem;
    }

    /* Hero Section */
    .hero-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    @media (min-width: 900px) {
      .hero-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    .hero-card {
      background: white;
      border-radius: var(--radius-lg);
      padding: 3rem;
      position: relative;
      overflow: hidden;
      min-height: 500px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      border: 1px solid rgba(0,0,0,0.05);
    }

    .customer-card {
      background: linear-gradient(135deg, #ffffff 0%, #fffbf7 100%);
    }

    .worker-card {
      background: var(--secondary-900);
      color: white;
    }

    .hero-card h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      z-index: 2;
    }

    .hero-card p {
      font-size: 1.125rem;
      margin-bottom: 2rem;
      z-index: 2;
      opacity: 0.9;
      max-width: 80%;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background-color: var(--secondary-100);
      color: var(--secondary-900);
      border-radius: 999px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }

    .badge-dark {
      background-color: rgba(255,255,255,0.1);
      color: white;
    }
    
    .card-visual {
       flex: 1;
       width: 100%;
       position: relative;
       margin-bottom: 2rem;
    }

    .mock-ui-card {
      background: white;
      border-radius: var(--radius-md);
      padding: 1rem;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
      position: absolute;
      width: 80%;
      right: -35%;
      top: 10%;
      transform: rotate(-3deg);
    }
    
    .worker-card .mock-ui-card.dark-ui {
       background: #2C241D;
       color: white;
       border: 1px solid rgba(255,255,255,0.1);
    }

    .mock-header { font-weight: 600; margin-bottom: 0.5rem; }
    .mock-sub { font-size: 0.85rem; color: var(--text-medium); margin-bottom: 0.5rem; }
    .mock-price { color: var(--primary-500); font-weight: 700; }
    
    .dark-ui .mock-sub { color: rgba(255,255,255,0.6); }

    .btn-lg {
      padding: 1rem 2rem;
      font-size: 1.1rem;
      z-index: 2;
    }
    
    .inverse {
      border-color: rgba(255,255,255,0.3);
      color: white;
    }
    .inverse:hover {
      background: white;
      color: var(--secondary-900);
    }

    /* Stats Strip */
    .stats-strip {
      background-color: var(--secondary-900);
      color: white;
      padding: 3rem 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
      text-align: center;
    }
    @media(min-width: 768px) {
      .stats-grid { grid-template-columns: repeat(4, 1fr); }
    }

    .stat-item .value {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--primary-500);
      font-family: var(--font-display);
      margin-bottom: 0.5rem;
    }

    .stat-item .label {
      font-size: 0.9rem;
      opacity: 0.8;
    }

    /* How It Works */
    .section-header {
      text-align: center;
      margin-bottom: 3rem;
    }
    .section-header h2 { font-size: 2rem; margin-bottom: 0.5rem; color: var(--secondary-900); }
    .section-header p { color: var(--text-medium); }

    .steps-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    @media(min-width: 768px) {
      .steps-grid { grid-template-columns: repeat(4, 1fr); }
    }

    .step-card {
      background: white;
      padding: 2rem;
      border-radius: var(--radius-md);
      text-align: center;
      box-shadow: var(--shadow-sm);
    }

    .step-icon {
      width: 48px;
      height: 48px;
      background: var(--secondary-100);
      color: var(--secondary-900);
      font-weight: 700;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      font-size: 1.25rem;
    }

    .step-card h3 {
      margin-bottom: 0.75rem;
      font-size: 1.1rem;
    }
    .step-card p {
      font-size: 0.9rem;
      color: var(--text-medium);
      line-height: 1.6;
    }

    /* Urgent Requests */
    .urgent-requests {
      background-color: #F8F5F2; /* Subtle beige/grey */
      padding: 4rem 0;
    }

    .section-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
    }

    .title-group { display: flex; align-items: center; gap: 1rem; }
    .title-group h2 { font-size: 1.5rem; margin: 0; }
    .title-group p { display: none; margin: 0; color: var(--text-medium); font-size: 0.9rem; }
    
    @media(min-width: 768px) {
       .title-group p { display: block; }
    }

    .live-dot {
      width: 10px;
      height: 10px;
      background-color: var(--success);
      border-radius: 50%;
      box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
    }

    .tasks-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    @media(min-width: 768px) {
      .tasks-grid { grid-template-columns: repeat(4, 1fr); }
    }

    .task-card {
      background: white;
      padding: 1.5rem;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm);
      border-left: 4px solid var(--primary-500);
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 0.5rem;
    }

    .task-header h3 {
      font-size: 1rem;
      font-weight: 600;
      margin: 0;
      line-height: 1.4;
    }
    
    .badge-urgent {
      background: #FEF2F2;
      color: var(--danger);
      font-size: 0.65rem;
      padding: 0.1rem 0.4rem;
      border-radius: 4px;
      font-weight: 700;
      text-transform: uppercase;
    }

    .task-meta {
      font-size: 0.8rem;
      color: var(--text-light);
      margin-bottom: 1rem;
      display: flex;
      gap: 0.75rem;
    }

    .task-desc {
      font-size: 0.9rem;
      color: var(--text-medium);
      margin-bottom: 1.5rem;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .task-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid var(--secondary-100);
      padding-top: 1rem;
    }

    .budget {
      display: flex;
      flex-direction: column;
    }
    .budget .label { font-size: 0.7rem; color: var(--text-light); text-transform: uppercase; }
    .budget .value { font-weight: 700; color: var(--secondary-900); }

    /* Bottom CTA */
    .bottom-cta {
      padding: 2rem 0 6rem;
    }

    .cta-content {
      background-color: var(--secondary-900);
      color: white;
      text-align: center;
      padding: 4rem 2rem;
      border-radius: var(--radius-xl);
      position: relative;
      overflow: hidden;
    }

    .cta-content h2 { font-size: 2.5rem; margin-bottom: 1rem; }
    .cta-content p { font-size: 1.125rem; opacity: 0.8; margin-bottom: 2.5rem; }
    
    .cta-buttons {
       display: flex;
       justify-content: center;
       gap: 1.5rem;
       flex-wrap: wrap;
    }

  `]
})
export class LandingComponent {
  // Mock Data
  urgentTasks = [
    {
      title: 'Emergency Pipe Leak Repair',
      location: 'Chennai, Tamil Nadu',
      timeAgo: '15m ago',
      description: 'Water is dripping rapidly under the sink. Need someone immediately to stop the leak.',
      budget: '₹400 - ₹500',
      isUrgent: true
    },
    {
      title: 'Move Heavy Sofa Up Stairs',
      location: 'Kochi, Kerala',
      timeAgo: '25m ago',
      description: 'Need 2 strong people to help move a 3-seater sofa to the 3rd floor. No elevator.',
      budget: '₹600 - ₹800',
      isUrgent: true
    },
    {
      title: 'Front Door Lock Jammed',
      location: 'Kolkata, West Bengal',
      timeAgo: '42m ago',
      description: 'Key broke inside the lock. Locked out of apartment. Need locksmith ASAP.',
      budget: '₹300 - ₹400',
      isUrgent: true
    },
    {
      title: 'Garage Cleaning & Organizing',
      location: 'Thiruvananthapuram, Kerala',
      timeAgo: '1h ago',
      description: 'Help organize boxes and clean out dust. Estimated 3 hours of work.',
      budget: '₹200/hr',
      isUrgent: false
    }
  ];
}
