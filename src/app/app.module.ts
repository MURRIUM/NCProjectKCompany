import { BrowserModule } from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {MatDialogModule} from '@angular/material';
import { RouterModule } from '@angular/router';
import Backendless from 'backendless';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { EmployeesTableComponent } from './employees-table/employees-table.component';
import {environment} from '../environments/environment';
import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { EmployeeEditComponent } from './employee-edit/employee-edit.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { LoginPopupComponent } from './login-popup/login-popup.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { CreateAccountPopupComponent } from './create-account-popup/create-account-popup.component';

Backendless.initApp(environment.backendless.APP_ID, environment.backendless.API_KEY);

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    EmployeesTableComponent,
    EmployeeProfileComponent,
    EmployeeEditComponent,
    LoginPopupComponent,
    AdminPanelComponent,
    CreateAccountPopupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([])
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [
    EmployeeEditComponent,
    LoginPopupComponent,
    CreateAccountPopupComponent
  ]
})
export class AppModule {}
