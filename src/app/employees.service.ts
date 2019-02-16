import {Injectable} from '@angular/core';
import {Employee} from './Employee';
import {User} from './user';

const EmployeesOfCompany = Backendless.Data.of('CompanyTable');
const queryBuilder = Backendless.DataQueryBuilder.create();

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  constructor() { }

  public lastId: number;
  public employees: Employee[] = [];
  public users: Employee[] = [];
  public profileEmployee: Employee;
  public loggedUser: User;

  checkLoginUser() {
    return Backendless.UserService.getCurrentUser()
      .then( ( currentUser: User ) => {
        this.loggedUser = currentUser;
        this.loadSingleEmployee(currentUser.id).then(() => {
          this.loggedUser.profile = this.profileEmployee;
        });
      });
  }

  logIn(login: string, password: string) {
    return Backendless.UserService.login(login, password, true).then((loggedInUser: User) => {
      this.loggedUser = loggedInUser;
      this.loadSingleEmployee(loggedInUser.id).then(() => {
        this.loggedUser.profile = this.profileEmployee;
      });
    });
  }

  logOut() {
    this.loggedUser = null;
    return Backendless.UserService.logout();
  }

  saveImage(image: File) {
    return Backendless.Files.upload(image, 'profileImages', true);
  }

  deleteImage(imageUrl: string) {
    return Backendless.Files.remove(imageUrl);
  }

  registerNewUser(user: User) {
    return Backendless.UserService.register(user);
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

  loadUsers() {
    queryBuilder.setPageSize(100);
    queryBuilder.setSortBy('id');
    queryBuilder.setWhereClause(`hasLogin = true`);
    return EmployeesOfCompany.find<Employee>(queryBuilder).then((employees: Employee[]) => {
      this.users = employees;
      queryBuilder.setPageSize(20);
      queryBuilder.setWhereClause('');
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
