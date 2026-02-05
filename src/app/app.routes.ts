import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { LandingComponent } from './features/landing/landing.component';
import { CustomerDashboardComponent } from './features/customer/dashboard/dashboard.component';
import { PostTaskComponent } from './features/customer/post-task/post-task.component';
import { WorkerDashboardComponent } from './features/worker/dashboard/dashboard.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';

export class FeatureComponents {
    static Landing = LandingComponent;
    static Login = LoginComponent;
    static Register = RegisterComponent;
    static CustomerDashboard = CustomerDashboardComponent;
    static PostTask = PostTaskComponent;
    static WorkerDashboard = WorkerDashboardComponent;
}

export const routes: Routes = [
    {
        path: '',
        component: PublicLayoutComponent,
        children: [
            { path: '', component: FeatureComponents.Landing },
            { path: 'login', component: FeatureComponents.Login },
            { path: 'register', component: FeatureComponents.Register },
            { path: 'how-it-works', component: FeatureComponents.Landing }, // Placeholder
        ]
    },
    {
        path: 'app',
        component: MainLayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: FeatureComponents.CustomerDashboard },
            { path: 'post-task', component: FeatureComponents.PostTask },
            {
                path: 'worker-dashboard',
                loadComponent: () => import('./features/worker/dashboard/dashboard.component').then(m => m.WorkerDashboardComponent)
            },
            {
                path: 'admin-dashboard',
                loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
            },
            {
                path: 'financials',
                loadComponent: () => import('./features/admin/finance/finance.component').then(m => m.FinanceComponent)
            },
            {
                path: 'my-tasks',
                component: FeatureComponents.CustomerDashboard  // For customers to view their posted tasks
            },
            {
                path: 'my-jobs',
                loadComponent: () => import('./features/worker/my-jobs/my-jobs.component').then(m => m.MyJobsComponent)
            },
            { path: 'find-work', component: FeatureComponents.WorkerDashboard },
            {
                path: 'payments',
                loadComponent: () => import('./features/customer/payments/payments.component').then(m => m.PaymentsComponent)
            },
            {
                path: 'messages',
                loadComponent: () => import('./features/customer/messages/messages.component').then(m => m.CustomerMessagesComponent)
            },
            {
                path: 'disputes',
                loadComponent: () => import('./features/common/dispute-list/dispute-list.component').then(m => m.DisputeListComponent)
            },
            {
                path: 'report-issue',
                loadComponent: () => import('./features/common/dispute-reporting').then(m => m.DisputeReportingComponent)
            },
            {
                path: 'report-issue/:taskId',
                loadComponent: () => import('./features/common/dispute-reporting').then(m => m.DisputeReportingComponent)
            },
            {
                path: 'earnings',
                loadComponent: () => import('./features/worker/earnings/earnings.component').then(m => m.EarningsComponent)
            },
            {
                path: 'profile',
                loadComponent: () => import('./features/worker/profile/profile.component').then(m => m.WorkerProfileComponent)
            },
            {
                path: 'financials',
                loadComponent: () => import('./features/admin/finance/finance.component').then(m => m.FinanceComponent)
            },
        ]
    },
    { path: '**', redirectTo: '' }
];
