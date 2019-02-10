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
  public profileEmployee: Employee;

  saveImage(image: File) {
    return Backendless.Files.upload(image, 'profileImages', true);
  }

  deleteImage(imageUrl: string) {
    return Backendless.Files.remove(imageUrl);
  }

  save(employee: Employee) {
    return EmployeesOfCompany.save<Employee>(employee).then(() => {this.getId(); });
  }

  delete(employee: Employee) {
    this.deleteImage(employee.image);
    return EmployeesOfCompany.remove(employee).then(() => {this.getId(); }).catch((e) => { console.log(e); });
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
    }).finally(() => this.getId());
  }

  loadStartingFrom(id: number) {
    queryBuilder.setPageSize(20);
    queryBuilder.setSortBy('id');
    queryBuilder.setWhereClause(`id >= ${id}`);
    return EmployeesOfCompany.find<Employee>(queryBuilder).then((employees: Employee[]) => {
      this.employees = employees;
      queryBuilder.setWhereClause('');
    });
  }

  loadSingleEmployee(id: number) {
    queryBuilder.setWhereClause(`id = ${id}`);
    return EmployeesOfCompany.find<Employee>(queryBuilder).then((employees: Employee[]) => {
      this.profileEmployee = employees[0];
      queryBuilder.setWhereClause('');
    }).catch(e => console.log(e));
  }

  getEmployeeFromServer(id: number) {
    return this.loadSingleEmployee(id);
  }
}
