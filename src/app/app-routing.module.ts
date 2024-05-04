import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login/login.component';
import { RegistrationComponent } from './modules/registration/registration/registration.component';
import { AuthGuard } from './core/auth-guard';
import { IncomesComponent } from './modules/incomes/incomes.component';
import { TransactionComponent } from './modules/transaction/transaction.component';
import { TransactionOverviewComponent } from './modules/transaction-overview/transaction-overview.component';
import { ExpensesComponent } from './modules/expenses/expenses.component';
import { TransactionChartComponent } from './modules/transaction-chart/transaction-chart.component';
import { UploadPdfComponent } from './modules/upload-pdf/upload-pdf.component';
import { LimitFormComponent } from './modules/limit-form/limit-form.component';
import { StartpageComponent } from './modules/startpage/startpage.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { LimitOverviewComponent } from './modules/limit-overview/limit-overview.component';
import { NotificationsOverviewComponent } from './modules/notifications-overview/notifications-overview.component';
import { NotificationsComponent } from './modules/notifications/notifications.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'incomes', component: IncomesComponent, canActivate: [AuthGuard] },
  { path: 'expenses', component: ExpensesComponent, canActivate: [AuthGuard] },
  {
    path: 'transaction',
    component: TransactionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'transaction/:id',
    component: TransactionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'transaction-overview',
    component: TransactionOverviewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'transaction-chart',
    component: TransactionChartComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'upload',
    component: UploadPdfComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'limit-form',
    component: LimitFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'notifications-overview',
    component: NotificationsOverviewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'limit-overview',
    component: LimitOverviewComponent,
    canActivate: [AuthGuard],
  },
  { path: 'startpage', component: StartpageComponent},
  // Redirect to login if the path is empty
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // Handle unknown paths (e.g., show a 404 page)
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
