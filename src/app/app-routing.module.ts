import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';
import { TransactionFormComponent } from './modules/transaction/transaction-form/transaction.component';
import { UploadPdfComponent } from './modules/upload/upload-pdf/upload-pdf.component';
import { StartpageComponent } from './modules/startpage/startpage.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FinancialGoalOverviewComponent } from './modules/financial-goals/financial-goal-overview/financial-goal-overview.component';
import { SavingsCalculatorComponent } from './modules/financial-goals/savings-calculator/savings-calculator.component';
import { TransactionAnalysisComponent } from './modules/transaction/transaction-analysis/transaction-analysis.component';
import { LoginComponent } from './modules/auth/login/login/login.component';
import { RegistrationComponent } from './modules/auth/registration/registration/registration.component';
import { CategoryFormComponent } from './modules/category/category-form/category-form.component';
import { CategoryOverviewComponent } from './modules/category/category-overview/category-overview.component';
import { FinancialGoalFormComponent } from './modules/financial-goals/financial-goal-form/financial-goal-form.component';
import { LimitFormComponent } from './modules/limits/limit-form/limit-form.component';
import { LimitOverviewComponent } from './modules/limits/limit-overview/limit-overview.component';
import { NotificationsOverviewComponent } from './modules/notification/notifications-overview/notifications-overview.component';
import { TransactionOverviewComponent } from './modules/transaction/transaction-overview/transaction-overview.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'startpage', component: StartpageComponent },
  {
    path: 'transaction-form',
    component: TransactionFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'transaction/:id',
    component: TransactionFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'transaction-overview',
    component: TransactionOverviewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'transaction-chart',
    component: TransactionFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'category-form',
    component: CategoryFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'category-overview',
    component: CategoryOverviewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'category-form/:id',
    component: CategoryFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'limit-form',
    component: LimitFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'limit-form/:id',
    component: LimitFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'financial-goal-form',
    component: FinancialGoalFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'savings-calculator',
    component: SavingsCalculatorComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'transaction-analysis',
    component: TransactionAnalysisComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'financial-goal-overview',
    component: FinancialGoalOverviewComponent,
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
  // Redirect to login if the path is empty
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // Handle unknown paths (e.g., show a 404 page)
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), ReactiveFormsModule],
  exports: [RouterModule],
})
export class AppRoutingModule { }
