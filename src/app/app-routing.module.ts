import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login/login.component';
import { RegistrationComponent } from './modules/registration/registration/registration.component';
import { AuthGuard } from './core/guards/auth-guard';
import { IncomesComponent } from './modules/incomes/incomes.component';
import { TransactionFormComponent } from './modules/transaction-form/transaction.component';
import { TransactionOverviewComponent } from './modules/transaction-overview/transaction-overview.component';
import { ExpensesComponent } from './modules/expenses/expenses.component';
import { TransactionChartComponent } from './modules/transaction-chart/transaction-chart.component';
import { UploadPdfComponent } from './modules/upload-pdf/upload-pdf.component';
import { LimitFormComponent } from './modules/limit-form/limit-form.component';
import { StartpageComponent } from './modules/startpage/startpage.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { LimitOverviewComponent } from './modules/limit-overview/limit-overview.component';
import { NotificationsOverviewComponent } from './modules/notifications-overview/notifications-overview.component';
import { FinancialGoalFormComponent } from './modules/financial-goal-form/financial-goal-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FinancialGoalOverviewComponent } from './modules/financial-goal-overview/financial-goal-overview.component';
import { CategoryFormComponent } from './modules/category-form/category-form.component';
import { CategoryOverviewComponent } from './modules/category-overview/category-overview.component';
import { SavingsCalculatorComponent } from './modules/savings-calculator/savings-calculator.component';
import { TransactionAnalysisComponent } from './modules/transaction-analysis/transaction-analysis.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'incomes', component: IncomesComponent, canActivate: [AuthGuard] },
  { path: 'expenses', component: ExpensesComponent, canActivate: [AuthGuard] },
  {
    path: 'transaction',
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
    component: TransactionChartComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'app-financial-goal-overview',
    component: FinancialGoalOverviewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'upload',
    component: UploadPdfComponent,
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
    path: 'create-goal',
    component: FinancialGoalFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'notifications-overview',
    component: NotificationsOverviewComponent,
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
  { path: 'startpage', component: StartpageComponent },
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
