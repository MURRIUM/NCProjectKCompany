import { Injectable } from '@angular/core';
import {Employee} from './Employee';
import {Observable, of} from 'rxjs';

const EmployeesOfCompany = Backendless.Data.of('CompanyTable');
const queryBuilder = Backendless.DataQueryBuilder.create();

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  constructor() {
  }

  public lastId: number;
  public employees: Employee[] = [];

  save(employee: Employee) {
    return EmployeesOfCompany.save<Employee>(employee).then(() => {this.getId(); });
  }

  delete(employee: Employee) {
    EmployeesOfCompany.remove(employee).then(() => {this.getId(); }).catch((e) => { console.log(e); });
  }

  getId() {
    queryBuilder.setSortBy('id DESC');
    queryBuilder.setPageSize(1);
    return EmployeesOfCompany.find<Employee>(queryBuilder).then((employee: Employee[]) => {
      this.lastId = employee[0].id;
    });
  }

  loadAll()  {
    queryBuilder.setPageSize(20);
    queryBuilder.setSortBy('id');
    return EmployeesOfCompany.find<Employee>(queryBuilder).then((employees: Employee[]) => {
      this.employees = employees;
    });
  }

  loadFrom(id: number) {
    queryBuilder.setPageSize(20);
    queryBuilder.setSortBy('id');
    queryBuilder.setWhereClause(`id >= ${id}`);
    return EmployeesOfCompany.find<Employee>(queryBuilder).then((employees: Employee[]) => {
      this.employees = employees;
    });
  }

  getEmployee(id: number): Observable<Employee> {
    return of(this.employees.find(employee => employee.id === id));
  }


}
