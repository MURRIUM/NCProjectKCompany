import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import Backendless from 'backendless';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { EmployeesTableComponent } from './employees/employees-table.component';
import {environment} from '../environments/environment';
import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

Backendless.initApp(environment.backendless.APP_ID, environment.backendless.API_KEY);

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    EmployeesTableComponent,
    EmployeeProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
