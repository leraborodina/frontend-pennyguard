import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './modules/login/login/login.component';
import { RegistrationComponent } from './modules/registration/registration/registration.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { IncomesComponent } from './modules/incomes/incomes.component';
import { ExpensesComponent } from './modules/expenses/expenses.component';
import { LogoutComponent } from './modules/logout/logout.component';
import { TransactionComponent } from './modules/transaction/transaction.component';
import { TransactionOverviewComponent } from './modules/transaction-overview/transaction-overview.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LogoutComponent,
    RegistrationComponent,
    DashboardComponent,
    IncomesComponent,
    ExpensesComponent,
    TransactionComponent,
    TransactionOverviewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
