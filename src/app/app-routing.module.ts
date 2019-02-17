import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EmployeesTableComponent} from './employees-table/employees-table.component';
import {MainPageComponent} from './main-page/main-page.component';
import {EmployeeProfileComponent} from './employee-profile/employee-profile.component';
import {APP_BASE_HREF} from '@angular/common';
import {AdminPanelComponent} from './admin-panel/admin-panel.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/main-page', pathMatch: 'full' },
  {path: 'employees', component: EmployeesTableComponent},
  {path: 'main-page', component: MainPageComponent},
  {path: 'profile', component: EmployeeProfileComponent},
  {path: 'profile/:id', component: EmployeeProfileComponent},
  {path: 'admin', component: AdminPanelComponent},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{provide: APP_BASE_HREF, useValue : '/' }]
})
export class AppRoutingModule { }
