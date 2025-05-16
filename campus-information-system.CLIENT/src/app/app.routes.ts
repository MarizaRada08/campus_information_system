import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { Error401Component } from './pages/errors/401/401.component';
import { Error404Component } from './pages/errors/404/404.component';
import { Error500Component } from './pages/errors/500/500.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { roleGuard } from './core/guards/role.guard';
import { VerifyOtpComponent } from './pages/auth/verify-otp/verify-otp.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { FrontPageComponent } from './pages/front-page/front-page.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { StudentRegistrationFormComponent } from './pages/student-registration-form/student-registration-form.component';
import { noAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'pages/front-page',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                component: LoginComponent,
                canActivate: [noAuthGuard],
            },
            {
                path: 'register',
                component: RegisterComponent,
                canActivate: [noAuthGuard],
            },
            {
                path: 'verify-otp',
                component: VerifyOtpComponent,
                canActivate: [noAuthGuard],
            }
        ]
    },
    {
        path: 'error',
        children: [
            {
                path: '404',
                component: Error404Component,
            },
            {
                path: '401',
                component: Error401Component,
            },
            {
                path: '500',
                component: Error500Component,
            },
        ]
    },
    {
        path: 'pages',
        children: [
            {
                path: "navbar",
                component: NavbarComponent,
            },
            {
                path: "front-page",
                component: FrontPageComponent,
                canActivate: [noAuthGuard],
            },
            {
                path: "student-registration-form",
                component: StudentRegistrationFormComponent,
            },
            {
                path: "notification",
                component: NotificationComponent,
                canActivate: [authGuard, roleGuard],
            },
            {
                path: 'dashboard',
                component: DashboardComponent,
                canActivate: [authGuard, roleGuard],
            },
            {
                path: 'profile',
                component: ProfileComponent,
                canActivate: [authGuard, roleGuard],
            },
            {
                path: 'schedule',
                component: ScheduleComponent,
                canActivate: [authGuard, roleGuard],
            },
            {
                path: 'attendance',
                component: AttendanceComponent,
                canActivate: [authGuard, roleGuard],
            }
        ]
    }
];
