import { APP_INITIALIZER, NgModule } from '@angular/core';
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
import { TransactionComponent } from './modules/transaction/transaction.component';
import { TransactionOverviewComponent } from './modules/transaction-overview/transaction-overview.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NavbarComponent } from './navbar/navbar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from './core/auth.service';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';  
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';
import { TransactionChartComponent } from './modules/transaction-chart/transaction-chart.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LogoutComponent,
    RegistrationComponent,
    IncomesComponent,
    ExpensesComponent,
    TransactionComponent,
    TransactionOverviewComponent,
    NavbarComponent,
    TransactionChartComponent,
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
    MatMenuModule
  ],
  providers: [
    AuthService,
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: AuthService) => () => {
        return authService.checkTokenExpirationAndLogout();
      },
      deps: [AuthService],
      multi: true,
    },
    { provide: MAT_DATE_LOCALE, useValue: 'de-AT' }, // Change 'de-AT' to your desired locale
    // Provide a DateAdapter (you can choose a specific one)
    // Example: { provide: DateAdapter, useClass: YourDateAdapter }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
