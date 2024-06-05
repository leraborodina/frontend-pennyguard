import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './modules/login/login/login.component';
import { RegistrationComponent } from './modules/registration/registration/registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IncomesComponent } from './modules/incomes/incomes.component';
import { ExpensesComponent } from './modules/expenses/expenses.component';
import { LogoutComponent } from './modules/logout/logout.component';
import { TransactionFormComponent } from './modules/transaction-form/transaction.component';
import { TransactionOverviewComponent } from './modules/transaction-overview/transaction-overview.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from './core/guards/auth.service';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';
import { TransactionChartComponent } from './modules/transaction-chart/transaction-chart.component';
import { MatMenuModule } from '@angular/material/menu';
import { UploadPdfComponent } from './modules/upload-pdf/upload-pdf.component';
import { TransactionEditComponent } from './modules/transaction-edit/transaction-edit.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NotificationsComponent } from './modules/notifications/notifications.component';
import { LimitFormComponent } from './modules/limit-form/limit-form.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { StartpageComponent } from './modules/startpage/startpage.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { TransactionsCardComponent } from './modules/transactions-card/transactions-card.component';
import { LimitOverviewComponent } from './modules/limit-overview/limit-overview.component';
import { WebSocketService } from './core/services/websocket.service';
import { NotificationService } from './shared/services/notification.service';
import { PopupMessageComponent } from './modules/popup-message/popup-message.component';
import { NotificationsOverviewComponent } from './modules/notifications-overview/notifications-overview.component';
import { FinancialGoalFormComponent } from './modules/financial-goal-form/financial-goal-form.component';
import { SavingsCalculatorComponent } from './modules/savings-calculator/savings-calculator.component';
import { SavingsProgressComponent } from './modules/savings-progress/savings-progress.component';
import { SocketIoConfig } from 'ngx-socket-io';
import { BarchartComponent } from './modules/barchart/barchart.component';
import { GlobalErrorHandlerService } from './core/services/global-error-handler.service.service';
import { DropdownToggleDirective } from './shared/directives/dropdown-toggle.directive';
import { BalanceCardComponent } from './modules/balance-card/balance-card.component';
import { CategoryLimitsCardComponent } from './modules/category-limits-card/category-limits-card.component';
import { FinancialGoalCardComponent } from './modules/financial-goal-card/financial-goal-card.component';
import { FinancialGoalOverviewComponent } from './modules/financial-goal-overview/financial-goal-overview.component';
import { MessageComponent } from './modules/message/message.component';
import { CategoryFormComponent } from './modules/category-form/category-form.component';
import { CategoryOverviewComponent } from './modules/category-overview/category-overview.component';
import { TransactionAnalysisComponent } from './modules/transaction-analysis/transaction-analysis.component';
import { LineChartComponent } from './modules/line-chart/line-chart.component';
import { CustomDatePipe } from './shared/pipes/custom-date.pipe';
import { CardComponent } from './modules/card/card.component';
import { DoughnutChartCardComponent } from './modules/doughnut-chart-card/doughnut-chart-card.component';

const config: SocketIoConfig = { url: 'ws://localhost:8080', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LogoutComponent,
    RegistrationComponent,
    IncomesComponent,
    ExpensesComponent,
    TransactionFormComponent,
    TransactionOverviewComponent,
    NavbarComponent,
    TransactionChartComponent,
    UploadPdfComponent,
    TransactionEditComponent,
    NotificationsComponent,
    LimitFormComponent,
    StartpageComponent,
    DashboardComponent,
    TransactionsCardComponent,
    LimitOverviewComponent,
    DoughnutChartCardComponent,
    PopupMessageComponent,
    NotificationsOverviewComponent,
    BarchartComponent,
    FinancialGoalFormComponent,
    SavingsCalculatorComponent,
    SavingsProgressComponent,
    DropdownToggleDirective,
    BalanceCardComponent,
    CategoryLimitsCardComponent,
    FinancialGoalCardComponent,
    FinancialGoalOverviewComponent,
    MessageComponent,
    CategoryFormComponent,
    CategoryOverviewComponent,
    TransactionAnalysisComponent,
    LineChartComponent,
    CustomDatePipe,
    CardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatButtonModule,
    MatToolbarModule,
    MatTableModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatDialogModule,
    CommonModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatSidenav,
    MatListModule,
    MatExpansionModule,
    MatGridListModule,
  ],
  providers: [
    AuthService,
    WebSocketService,
    NotificationService,
    DatePipe,
    CustomDatePipe,
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: AuthService) => () => {
        return authService.checkTokenExpirationAndLogout();
      },
      deps: [AuthService],
      multi: true,
    },
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
