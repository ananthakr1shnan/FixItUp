import { Component } from '@angular/core';

@Component({
    selector: 'app-landing',
    standalone: true,
    template: `
    <div class="container" style="padding: 4rem 1.5rem; text-align: center;">
      <h1 class="display-1" style="font-size: 3rem; margin-bottom: 1rem;">Placeholder Landing Page</h1>
      <p style="color: var(--text-medium); font-size: 1.25rem;">Implementation coming next.</p>
    </div>
  `
})
export class LandingComponent { }

@Component({
    selector: 'app-login',
    standalone: true,
    template: `<div class="container"><h2 class="mt-5">Login Placeholder</h2></div>`
})
export class LoginComponent { }

@Component({
    selector: 'app-register',
    standalone: true,
    template: `<div class="container"><h2 class="mt-5">Register Placeholder</h2></div>`
})
export class RegisterComponent { }

@Component({
    selector: 'app-customer-dashboard',
    standalone: true,
    template: `<h2>Customer Dashboard Placeholder</h2>`
})
export class CustomerDashboardComponent { }

@Component({
    selector: 'app-worker-dashboard',
    standalone: true,
    template: `<h2>Worker Dashboard Placeholder</h2>`
})
export class WorkerDashboardComponent { }
