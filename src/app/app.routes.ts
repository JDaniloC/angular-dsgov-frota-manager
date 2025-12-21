import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Consulta } from './pages/consulta/consulta';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: Dashboard,
    data: {
      breadcrumb: 'Dashboard'
    }
  },
  {
    path: 'consulta',
    component: Consulta,
    data: {
      breadcrumb: 'Consulta'
    }
  }
];
