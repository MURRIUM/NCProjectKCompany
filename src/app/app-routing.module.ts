import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EmployeesTableComponent} from './employees-table/employees-table.component';
import {MainPageComponent} from './main-page/main-page.component';
import {EmployeeProfileComponent} from './employee-profile/employee-profile.component';
import {APP_BASE_HREF} from '@angular/common';

const routes: Routes = [
  { path: '', redirectTo: '/main-page', pathMatch: 'full' },
  {path: 'employees', component: EmployeesTableComponent},
  {path: 'main-page', component: MainPageComponent},
  {path: 'profile', component: EmployeeProfileComponent},
  {path: 'profile/:id', component: EmployeeProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{provide: APP_BASE_HREF, useValue : '/' }]
})
export class AppRoutingModule { }
