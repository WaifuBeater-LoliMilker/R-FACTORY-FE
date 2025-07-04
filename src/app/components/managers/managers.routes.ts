import { Routes } from '@angular/router';
import { AuthGuard } from '../../auth.guard';

export const managersRoutes: Routes = [
  {
    path: 'managers',
    canActivate: [AuthGuard],
    data: { role: 'managers' },
    loadComponent: () =>
      import('./managers.component').then((m) => m.ManagersComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./overview/overview.component').then(
            (m) => m.OverviewComponent
          ),
      },
      {
        path: 'factories',
        loadComponent: () =>
          import('./factories/factories.component').then(
            (m) => m.FactoriesComponent
          ),
      },
      {
        path: 'lines',
        loadComponent: () =>
          import('./lines/lines.component').then((m) => m.LinesComponent),
      },
      {
        path: 'zones',
        loadComponent: () =>
          import('./zones/zones.component').then((m) => m.ZonesComponent),
      },
      {
        path: 'stations',
        loadComponent: () =>
          import('./stations/stations.component').then(
            (m) => m.StationsComponent
          ),
      },
    ],
  },
];
