import { Routes } from '@angular/router';
//import { managersRoutes } from './components/managers/managers.routes';
import { LoginGuard } from './login.guard';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [LoginGuard],
    loadComponent: () => {
      return import('./components/auth/login/login.component').then(
        (c) => c.LoginComponent
      );
    },
  },
  //...managersRoutes,
  {
    path: 'managers',
    canActivate: [AuthGuard],
    data: { role: 'managers' },
    loadComponent: () => {
      return import('./components/managers/managers.component').then(
        (c) => c.ManagersComponent
      );
    },
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/_shared/not-found/not-found.component').then(
        (c) => c.NotFoundComponent
      ),
  },
];
