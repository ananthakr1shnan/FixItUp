import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <!-- Brand Column -->
          <div class="footer-brand">
            <div class="logo">
              <span class="logo-text">FixItUp</span>
            </div>
            <p class="tagline">The modern marketplace for household services. Fair prices, trusted workers, and quality results.</p>
            <p class="copyright">© 2026 FixItUp Inc. All rights reserved.</p>
          </div>

          <!-- Links Columns -->
          <div class="footer-column">
            <h4>Platform</h4>
            <a routerLink="/how-it-works">How it Works</a>
            <a routerLink="/tasks">Browse Tasks</a>
            <a routerLink="/pricing">Pricing</a>
            <a routerLink="/trust">Trust & Safety</a>
          </div>

          <div class="footer-column">
            <h4>Workers</h4>
            <a routerLink="/register-worker">Sign Up to Work</a>
            <a routerLink="/stories">Success Stories</a>
            <a routerLink="/resources">Resources</a>
            <a routerLink="/insurance">Insurance</a>
          </div>

          <div class="footer-column">
             <h4>Company</h4>
             <a routerLink="/about">About Us</a>
             <a routerLink="/careers">Careers</a>
             <a routerLink="/press">Press</a>
             <a routerLink="/contact">Contact</a>
          </div>
        </div>
        
        <div class="footer-bottom">
           <a routerLink="/privacy">Privacy Policy</a>
           <a routerLink="/terms">Terms of Service</a>
        </div>
      </div>
    </footer>
  `,
    styles: [`
    .footer {
      background-color: var(--secondary-900);
      color: var(--text-light);
      padding: 4rem 0 2rem;
      margin-top: auto;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 3rem;
      margin-bottom: 3rem;
    }

    @media (min-width: 768px) {
      .footer-grid {
        grid-template-columns: 2fr 1fr 1fr 1fr;
      }
    }

    .footer-brand .logo-text {
      color: white;
      font-family: var(--font-display);
      font-size: 1.5rem;
      font-weight: 700;
      display: block;
      margin-bottom: 1rem;
    }
    
    .footer-brand .logo-text span {
        color: var(--primary-500);
    }

    .tagline {
      margin-bottom: 2rem;
      line-height: 1.6;
      font-size: 0.9rem;
      max-width: 300px;
    }

    .footer-column h4 {
      color: white;
      margin-bottom: 1.5rem;
      font-size: 1rem;
    }

    .footer-column a {
      display: block;
      margin-bottom: 0.75rem;
      font-size: 0.9rem;
      transition: color 0.2s;
    }

    .footer-column a:hover {
      color: var(--primary-500);
    }

    .footer-bottom {
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 2rem;
      display: flex;
      justify-content: flex-end;
      gap: 2rem;
      font-size: 0.85rem;
    }
  `]
})
export class FooterComponent { }
