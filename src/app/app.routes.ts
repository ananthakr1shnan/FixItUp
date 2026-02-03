import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { LoginComponent, RegisterComponent } from './features/placeholders';
import { LandingComponent } from './features/landing/landing.component';
import { CustomerDashboardComponent } from './features/customer/dashboard/dashboard.component';
import { WorkerDashboardComponent } from './features/worker/dashboard/dashboard.component';

export class FeatureComponents {
    static Landing = LandingComponent;
    static Login = LoginComponent;
    static Register = RegisterComponent;
    static CustomerDashboard = CustomerDashboardComponent;
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
            { path: 'worker-dashboard', component: FeatureComponents.WorkerDashboard },
            { path: 'my-jobs', component: FeatureComponents.WorkerDashboard },
            { path: 'find-work', component: FeatureComponents.WorkerDashboard },
        ]
    },
    { path: '**', redirectTo: '' }
];
