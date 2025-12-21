import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ConsultaComponent } from './pages/consulta/consulta.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: {
      breadcrumb: 'Dashboard'
    }
  },
  {
    path: 'consulta',
    component: ConsultaComponent,
    data: {
      breadcrumb: 'Consulta'
    }
  }
];
