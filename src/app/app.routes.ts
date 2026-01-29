import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'calendar',
        loadComponent: () => import('./pages/calendar/calendar.page').then((m) => m.CalendarPage),
    },
    {
        path: 'event',
        loadComponent: () => import('./pages/event/event.page').then((m) => m.EventPage),
    },
    {
        path: 'messages',
        loadComponent: () =>
            import('./pages/messages/messages.page').then((m) => m.MessagesPage),
    },
    {
        path: 'settings',
        loadComponent: () =>
            import('./pages/settings/settings.page').then((m) => m.SettingsPage),
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'home',
        loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
    },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  },



];
