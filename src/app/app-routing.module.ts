import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login/login.component';
import { RegistrationComponent } from './modules/registration/registration/registration.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { AuthGuard } from './core/auth-guard';
import { IncomesComponent } from './modules/incomes/incomes.component';
import { TransactionComponent } from './modules/transaction/transaction.component';
import { TransactionOverviewComponent } from './modules/transaction-overview/transaction-overview.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'incomes', component: IncomesComponent, canActivate: [AuthGuard] },
  { path: 'transaction', component: TransactionComponent, canActivate: [AuthGuard]},
  { path: 'transaction-overview', component: TransactionOverviewComponent, canActivate: [AuthGuard]},
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
