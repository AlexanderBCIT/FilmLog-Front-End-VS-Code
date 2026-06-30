import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page')
      .then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page')
      .then(m => m.RegisterPage)
  },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page')
      .then(m => m.TabsPage),
    canActivate: [authGuard],
    children: [
      {
        path: 'search',
        loadComponent: () => import('./pages/search/search.page')
          .then(m => m.SearchPage)
      },
      {
        path: 'watchlist',
        loadComponent: () => import('./pages/watchlist/watchlist.page')
          .then(m => m.WatchlistPage)
      },
      {
        path: 'watched',
        loadComponent: () => import('./pages/watched/watched.page')
          .then(m => m.WatchedPage)
      },
      {
        path: 'stats',
        loadComponent: () => import('./pages/stats/stats.page')
          .then(m => m.StatsPage)
      },
      {
        path: '',
        redirectTo: 'search',
        pathMatch: 'full'
      }
    ]
  }
];